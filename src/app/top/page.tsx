import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const revalidate = 30;
export default async function TopPage() {
  const proposals = await prisma.proposal.findMany({
    take: 10,
    orderBy: { likesCount: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      district: { select: { name: true } },
      category: { select: { name: true } },
      media: { select: { id: true, url: true, type: true } },
    },
  });

  const statusLabels: Record<string, { text: string; color: string }> = {
    PENDING: { text: "Қарастырылуда", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    ACCEPTED: { text: "Қабылданды", color: "bg-brand-500/10 text-brand-400 border-brand-500/20" },
    REJECTED: { text: "Қабылданбады", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    IMPLEMENTED: { text: "Іске асырылды", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
      <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Рейтинг</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">Үздік идеялар</h1>
      <p className="text-white/40 mb-12">Ең көп дауыс жинаған ұсыныстар</p>

      {proposals.length === 0 ? (
        <div className="text-center py-20"><p className="text-white/40 text-lg">Әзірге ұсыныстар жоқ</p></div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal, i) => {
            const st = statusLabels[proposal.status] || { text: proposal.status, color: "bg-white/5 text-white/50 border-white/10" };
            const firstImage = proposal.media.find((m) => m.type === "IMAGE");
            const videoCount = proposal.media.filter((m) => m.type === "VIDEO").length;

            return (
              <Link key={proposal.id} href={`/proposals/${proposal.id}`} className="block group">
                <div className="glass rounded-2xl overflow-hidden hover-lift flex">
                  <div className="flex-shrink-0 w-16 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-heading font-bold text-lg ${
                      i === 0 ? "bg-amber-500/20 text-amber-400" : i === 1 ? "bg-gray-400/20 text-gray-300" : i === 2 ? "bg-orange-500/20 text-orange-400" : "bg-white/5 text-white/30"
                    }`}>
                      {i + 1}
                    </div>
                  </div>

                  {(firstImage || videoCount > 0) && (
                    <div className="flex-shrink-0 w-36 bg-dark-800 relative overflow-hidden">
                      {firstImage ? (
                        <img src={firstImage.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ minHeight: "110px", maxHeight: "130px" }} />
                      ) : (
                        <video src={proposal.media.find(m => m.type === "VIDEO")?.url} className="w-full h-full object-cover" muted style={{ minHeight: "110px", maxHeight: "130px" }} />
                      )}
                    </div>
                  )}

                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs bg-brand-500/10 text-brand-400 px-2.5 py-1 rounded-full border border-brand-500/20">{proposal.category.name}</span>
                      <span className="text-xs bg-white/5 text-white/40 px-2.5 py-1 rounded-full border border-white/10">{proposal.district.name}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${st.color}`}>{st.text}</span>
                      {videoCount > 0 && <span className="text-xs bg-white/5 text-white/40 px-2.5 py-1 rounded-full border border-white/10">▶ {videoCount} видео</span>}
                    </div>
                    <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-brand-400 transition-colors">{proposal.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/30">
                      <span>{proposal.author.name}</span>
                      <span>{new Date(proposal.createdAt).toLocaleDateString("kk-KZ")}</span>
                      <span className="text-brand-400">👍 {proposal.likesCount}</span>
                      <span className="text-red-400/60">👎 {proposal.dislikesCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}