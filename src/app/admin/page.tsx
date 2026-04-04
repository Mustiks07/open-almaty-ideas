"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

 useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    else if (status === "authenticated" && session?.user?.role !== "ADMIN") router.push("/");
    else if (status === "authenticated") fetchProposals();
  }, [status, session, router]);

  const fetchProposals = async () => { const res = await fetch("/api/proposals"); setProposals(await res.json()); setLoading(false); };

  const openModal = (proposal: any, statusValue: string) => { setSelectedProposal(proposal); setNewStatus(statusValue); setMessage(""); setModalOpen(true); };

  const submitResponse = async () => {
    if (!selectedProposal || message.trim().length < 5) return;
    setSending(true);
    const res = await fetch(`/api/proposals/${selectedProposal.id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus, message }) });
    if (res.ok) { setProposals((prev) => prev.map((p) => p.id === selectedProposal.id ? { ...p, status: newStatus } : p)); setModalOpen(false); }
    setSending(false);
  };

  if (status === "loading" || loading) return <div className="text-center py-20 text-white/40">Жүктелуде...</div>;

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    ACCEPTED: "bg-brand-500/10 text-brand-400 border-brand-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    IMPLEMENTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  const statusLabels: Record<string, string> = { PENDING: "Қарастырылуда", ACCEPTED: "Қабылданды", REJECTED: "Қабылданбады", IMPLEMENTED: "Іске асырылды" };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <p className="text-amber-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Әкімшілік</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-10">Басқару панелі</h1>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-sm font-medium text-white/40">Тақырып</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/40">Автор</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/40">Аудан</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/40">Дауыс</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/40">Мәртебе</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-white/40">Әрекет</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white max-w-xs truncate">{p.title}</td>
                  <td className="px-6 py-4 text-sm text-white/50">{p.author.name}</td>
                  <td className="px-6 py-4 text-sm text-white/50">{p.district.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-brand-400">👍{p.likesCount}</span>{" "}
                    <span className="text-red-400/60">👎{p.dislikesCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[p.status]}`}>{statusLabels[p.status]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(p, "ACCEPTED")} className="text-xs bg-brand-500/10 text-brand-400 px-3 py-1.5 rounded-lg hover:bg-brand-500/20 transition border border-brand-500/20">Қабылдау</button>
                      <button onClick={() => openModal(p, "REJECTED")} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition border border-red-500/20">Қабылдамау</button>
                      <button onClick={() => openModal(p, "IMPLEMENTED")} className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition border border-blue-500/20">Іске асыру</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && selectedProposal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-dark rounded-2xl p-8 w-full max-w-lg">
            <h2 className="font-heading text-lg font-bold text-white mb-1">Ұсынысқа жауап беру</h2>
            <p className="text-sm text-white/40 mb-6">«{selectedProposal.title}» → {statusLabels[newStatus]}</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-brand-500 outline-none resize-none mb-6"
              placeholder="Пікіріңізді жазыңыз..." />
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-white/50 hover:text-white transition-colors text-sm">Бас тарту</button>
              <button onClick={submitResponse} disabled={sending || message.trim().length < 5}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
                {sending ? "Жіберілуде..." : "Жіберу"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}