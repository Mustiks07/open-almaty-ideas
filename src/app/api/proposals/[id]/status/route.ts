import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Рұқсат жоқ" }, { status: 403 });
  }

  const { status, message } = await req.json();

  if (!["PENDING", "ACCEPTED", "REJECTED", "IMPLEMENTED"].includes(status)) {
    return NextResponse.json({ error: "Қате мәртебе" }, { status: 400 });
  }

  if (!message || message.trim().length < 5) {
    return NextResponse.json({ error: "Пікір кемінде 5 таңба болуы керек" }, { status: 400 });
  }

  const proposal = await prisma.proposal.update({
    where: { id: Number(params.id) },
    data: { status },
  });

  await prisma.adminResponse.create({
    data: {
      message: message.trim(),
      proposalId: Number(params.id),
      adminId: Number(session.user.id),
    },
  });

  return NextResponse.json(proposal);
}