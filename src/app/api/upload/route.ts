import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const proposalId = formData.get("proposalId") as string;

    console.log("Upload request:", { fileName: file?.name, fileType: file?.type, fileSize: file?.size, proposalId });

    if (!file || !proposalId) {
      return NextResponse.json({ error: "Файл және ұсыныс ID қажет" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Файл көлемі 10MB-дан аспауы керек" }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Тек JPG, PNG, WebP суреттер және MP4, WebM видеолар рұқсат" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `proposals/${proposalId}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    console.log("Uploading to Supabase:", { filePath, bufferSize: buffer.length, contentType: file.type });
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20) + "...");

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("media")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    console.log("Supabase upload result:", { uploadError, uploadData });

    if (uploadError) {
      console.error("Supabase upload error:", JSON.stringify(uploadError));
      return NextResponse.json({ error: "Файл жүктеу қатесі: " + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    console.log("Public URL:", urlData.publicUrl);

    const media = await prisma.media.create({
      data: {
        url: urlData.publicUrl,
        type: isImage ? "IMAGE" : "VIDEO",
        filename: file.name,
        sizeBytes: file.size,
        proposalId: Number(proposalId),
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Upload catch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}