import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Барлық ұсыныстарды алу
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district");
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search");

  const where: any = {};

  if (district) {
    where.district = { name: { contains: district } };
  }
  if (category) {
    where.category = { name: category };
  }
  if (status) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: any =
    sort === "popular"
      ? { likesCount: "desc" }
      : { createdAt: "desc" };

  const proposals = await prisma.proposal.findMany({
    where,
    orderBy,
    take: 50,
    include: {
      author: { select: { id: true, name: true } },
      district: { select: { name: true } },
      category: { select: { name: true } },
      media: { select: { id: true, url: true, type: true } },
      _count: { select: { votes: true } },
    },
  });

  return NextResponse.json(proposals);
}

// Жаңа ұсыныс қосу
const proposalSchema = z.object({
  title: z.string().min(5, "Тақырып кемінде 5 таңба"),
  description: z.string().min(20, "Сипаттама кемінде 20 таңба"),
  districtId: z.number(),
  categoryId: z.number(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = proposalSchema.parse(body);

    const proposal = await prisma.proposal.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: Number(session.user.id),
        districtId: data.districtId,
        categoryId: data.categoryId,
      },
      include: {
        author: { select: { name: true } },
        district: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Серверлік қате" }, { status: 500 });
  }
}