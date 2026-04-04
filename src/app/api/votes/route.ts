import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Кіру қажет" }, { status: 401 });
  }

  const { proposalId, voteType } = await req.json();
  const userId = Number(session.user.id);

  // Бұрынғы дауысты тексер
  const existingVote = await prisma.vote.findUnique({
    where: { userId_proposalId: { userId, proposalId } },
  });

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      // Сол дауысты қайта бассса — дауысты жою
      await prisma.vote.delete({
        where: { id: existingVote.id },
      });

      await prisma.proposal.update({
        where: { id: proposalId },
        data: {
          likesCount: voteType === "LIKE" ? { decrement: 1 } : undefined,
          dislikesCount: voteType === "DISLIKE" ? { decrement: 1 } : undefined,
        },
      });

      return NextResponse.json({ action: "removed" });
    } else {
      // Дауысты ауыстыру (лайктан дизлайкке немесе керісінше)
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType },
      });

      await prisma.proposal.update({
        where: { id: proposalId },
        data: {
          likesCount:
            voteType === "LIKE" ? { increment: 1 } : { decrement: 1 },
          dislikesCount:
            voteType === "DISLIKE" ? { increment: 1 } : { decrement: 1 },
        },
      });

      return NextResponse.json({ action: "changed" });
    }
  }

  // Жаңа дауыс
  await prisma.vote.create({
    data: { userId, proposalId, voteType },
  });

  await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      likesCount: voteType === "LIKE" ? { increment: 1 } : undefined,
      dislikesCount: voteType === "DISLIKE" ? { increment: 1 } : undefined,
    },
  });

  return NextResponse.json({ action: "voted" });
}
