import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import VoteButtons from "./VoteButtons";
import MediaGallery from "./MediaGallery";

export default async function ProposalPage({
  params,
}: {
  params: { id: string };
}) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: Number(params.id) },
    include: {
      author: { select: { id: true, name: true } },
      district: { select: { name: true } },
      category: { select: { name: true } },
      media: true,
      adminResponses: {
        include: { admin: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!proposal) return notFound();

  const statusLabels: Record<string, { text: string; color: string }> = {
    PENDING: { text: "Қарастырылуда", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    ACCEPTED: { text: "Қабылданды", color: "bg-brand-500/10 text-brand-400 border-brand-500/20" },
    REJECTED: { text: "Қабылданбады", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    IMPLEMENTED: { text: "Іске асырылды", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };

  const status = statusLabels[proposal.status] || { text: proposal.status, color: "bg-white/5 text-white/50 border-white/10" };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
      <Link href="/proposals" className="inline-flex items-center gap-1 text-white/40 hover:text-brand-400 transition mb-8 text-sm">
        ← Барлық ұсыныстарға оралу
      </Link>

      <div className="glass rounded-2xl overflow-hidden">
        {proposal.media.length > 0 && (
          <MediaGallery media={proposal.media} />
        )}

        <div className="p-8">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-sm bg-brand-500/10 text-brand-400 px-3 py-1 rounded-full border border-brand-500/20">
              {proposal.category.name}
            </span>
            <span className="text-sm bg-white/5 text-white/40 px-3 py-1 rounded-full border border-white/10">
              {proposal.district.name}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full border ${status.color}`}>
              {status.text}
            </span>
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">
            {proposal.title}
          </h1>

          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
            <div className="w-11 h-11 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
              {proposal.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-white">{proposal.author.name}</p>
              <p className="text-sm text-white/40">
                {new Date(proposal.createdAt).toLocaleDateString("kk-KZ", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8 text-white/70" dangerouslySetInnerHTML={{ __html: proposal.description }} />

          {proposal.adminResponses.length > 0 && (
            <div className="mb-8 space-y-4">
              <h2 className="font-heading text-lg font-semibold text-white">Админ жауабы</h2>
              {proposal.adminResponses.map((response: any) => (
                <div key={response.id} className={`rounded-xl p-5 border-l-4 ${
                  proposal.status === "ACCEPTED" ? "bg-brand-500/5 border-brand-500" :
                  proposal.status === "REJECTED" ? "bg-red-500/5 border-red-500" :
                  proposal.status === "IMPLEMENTED" ? "bg-blue-500/5 border-blue-500" :
                  "bg-white/5 border-white/20"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">A</div>
                    <span className="font-medium text-white text-sm">{response.admin.name}</span>
                    <span className="text-xs text-white/30">
                      {new Date(response.createdAt).toLocaleDateString("kk-KZ", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-white/60">{response.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="glass rounded-xl p-6">
            <p className="text-sm text-white/40 mb-3">Бұл ұсынысты қолдайсыз ба?</p>
            <VoteButtons proposalId={proposal.id} initialLikes={proposal.likesCount} initialDislikes={proposal.dislikesCount} />
          </div>
        </div>
      </div>
    </div>
  );
}