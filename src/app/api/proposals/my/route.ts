import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
  }

  const proposals = await prisma.proposal.findMany({
    where: { authorId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
    include: {
      district: { select: { name: true } },
      category: { select: { name: true } },
      media: { select: { id: true, url: true, type: true } },
    },
  });

  return NextResponse.json(proposals);
}