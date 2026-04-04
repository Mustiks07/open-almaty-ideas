"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    else if (status === "authenticated") fetchMyProposals();
  }, [status, router]);

  const fetchMyProposals = async () => { const res = await fetch("/api/proposals/my"); setProposals(await res.json()); setLoading(false); };

  const deleteProposal = async (id: number) => {
    setDeleting(id);
    const res = await fetch(`/api/proposals/${id}`, { method: "DELETE" });
    if (res.ok) setProposals((p) => p.filter((x) => x.id !== id));
    setDeleting(null); setConfirmDelete(null);
  };

  if (status === "loading" || loading) return <div className="text-center py-20 text-white/40">Жүктелуде...</div>;

  const statusLabels: Record<string, { text: string; color: string }> = {
    PENDING: { text: "Қарастырылуда", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    ACCEPTED: { text: "Қабылданды", color: "bg-brand-500/10 text-brand-400 border-brand-500/20" },
    REJECTED: { text: "Қабылданбады", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    IMPLEMENTED: { text: "Іске асырылды", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Профиль</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Менің ұсыныстарым</h1>
          <p className="text-white/40 mt-1">{proposals.length} ұсыныс</p>
        </div>
        <Link href="/proposals/new" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25 text-center">
          + Жаңа ұсыныс
        </Link>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-white/50 text-lg mb-2">Сізде әлі ұсыныс жоқ</p>
          <p className="text-white/30 text-sm mb-6">Бірінші ұсынысыңызды қосыңыз!</p>
          <Link href="/proposals/new" className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all">Ұсыныс қосу</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => {
            const st = statusLabels[p.status] || { text: p.status, color: "bg-white/5 text-white/50 border-white/10" };
            const images = p.media?.filter((m: any) => m.type === "IMAGE") || [];
            const videos = p.media?.filter((m: any) => m.type === "VIDEO") || [];
            return (
              <div key={p.id} className="glass rounded-2xl overflow-hidden hover-lift">
                <div className="flex flex-col sm:flex-row">
                  {(images.length > 0 || videos.length > 0) && (
                    <Link href={`/proposals/${p.id}`} className="flex-shrink-0 relative">
                      {images.length > 0 ? (
                        <img src={images[0].url} alt="" className="w-full sm:w-32 h-40 sm:h-full object-cover" />
                      ) : (
                        <video src={videos[0].url} className="w-full sm:w-32 h-40 sm:h-full object-cover" muted />
                      )}
                      {videos.length > 0 && (
                        <span className="absolute bottom-1 left-1 glass text-white text-[10px] px-1.5 py-0.5 rounded">▶ {videos.length}</span>
                      )}
                    </Link>
                  )}
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs bg-brand-500/10 text-brand-400 px-2.5 py-1 rounded-full border border-brand-500/20">{p.category.name}</span>
                          <span className="text-xs bg-white/5 text-white/40 px-2.5 py-1 rounded-full border border-white/10">{p.district.name}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full border ${st.color}`}>{st.text}</span>
                        </div>
                        <Link href={`/proposals/${p.id}`}>
                          <h3 className="font-semibold text-white hover:text-brand-400 transition-colors text-base sm:text-lg truncate">{p.title}</h3>
                        </Link>
                        <div className="flex items-center gap-3 sm:gap-4 mt-2 text-sm text-white/30">
                          <span>{new Date(p.createdAt).toLocaleDateString("kk-KZ")}</span>
                          <span className="text-brand-400">👍 {p.likesCount}</span>
                          <span className="text-red-400/60">👎 {p.dislikesCount}</span>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0 flex items-center gap-1 sm:gap-2">
                        <Link href={`/proposals/${p.id}/edit`} className="text-white/30 hover:text-brand-400 transition-colors p-1" title="Өңдеу">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Link>
                        {confirmDelete === p.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => deleteProposal(p.id)} disabled={deleting === p.id}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition disabled:opacity-50">
                              {deleting === p.id ? "..." : "Өшір"}
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="text-xs text-white/40 px-1 py-1">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(p.id)} className="text-white/30 hover:text-red-400 transition-colors p-1" title="Өшіру">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}