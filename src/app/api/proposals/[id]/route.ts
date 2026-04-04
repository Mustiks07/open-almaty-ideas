import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Жеке ұсынысты алу
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: { select: { id: true, name: true } },
      district: { select: { name: true } },
      category: { select: { name: true } },
      media: { select: { id: true, url: true, type: true } },
    },
  });

  if (!proposal) {
    return NextResponse.json({ error: "Табылмады" }, { status: 404 });
  }

  return NextResponse.json(proposal);
}

// Ұсынысты өңдеу
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: Number(params.id) },
  });

  if (!proposal) {
    return NextResponse.json({ error: "Табылмады" }, { status: 404 });
  }

  if (proposal.authorId !== Number(session.user.id)) {
    return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
  }

  const { title, description } = await req.json();

  const updated = await prisma.proposal.update({
    where: { id: Number(params.id) },
    data: { title, description },
  });

  return NextResponse.json(updated);
}

// Ұсынысты өшіру
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: Number(params.id) },
  });

  if (!proposal) {
    return NextResponse.json({ error: "Табылмады" }, { status: 404 });
  }

  const isAuthor = proposal.authorId === Number(session.user.id);
  const isAdmin = (session.user as any).role === "ADMIN";

  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
  }

  await prisma.proposal.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ message: "Өшірілді" });
}