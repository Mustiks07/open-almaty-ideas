"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

interface ProposalCardProps {
  proposal: {
    id: number; title: string; description: string; status: string;
    likesCount: number; dislikesCount: number; createdAt: string;
    author: { id?: number; name: string }; district: { name: string };
    category: { name: string }; media?: { id: number; url: string; type: string }[];
  };
}

const statusLabels: Record<string, { text: string; color: string }> = {
  PENDING: { text: "Қарастырылуда", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ACCEPTED: { text: "Қабылданды", color: "bg-brand-500/10 text-brand-400 border-brand-500/20" },
  REJECTED: { text: "Қабылданбады", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  IMPLEMENTED: { text: "Іске асырылды", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
};

export default function ProposalCard({ proposal }: ProposalCardProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(proposal.likesCount);
  const [dislikes, setDislikes] = useState(proposal.dislikesCount);
  const [voting, setVoting] = useState(false);

  const vote = async (voteType: "LIKE" | "DISLIKE") => {
    if (!session) { window.location.href = "/auth/login"; return; }
    if (voting) return;
    setVoting(true);
    const res = await fetch("/api/votes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proposalId: proposal.id, voteType }) });
    if (res.ok) {
      const data = await res.json();
      if (data.action === "voted") { voteType === "LIKE" ? setLikes(p => p + 1) : setDislikes(p => p + 1); }
      else if (data.action === "removed") { voteType === "LIKE" ? setLikes(p => p - 1) : setDislikes(p => p - 1); }
      else if (data.action === "changed") { if (voteType === "LIKE") { setLikes(p => p + 1); setDislikes(p => p - 1); } else { setDislikes(p => p + 1); setLikes(p => p - 1); } }
    }
    setVoting(false);
  };

  const status = statusLabels[proposal.status] || { text: proposal.status, color: "bg-white/5 text-white/50 border-white/10" };
  const images = proposal.media?.filter(m => m.type === "IMAGE") || [];
  const videos = proposal.media?.filter(m => m.type === "VIDEO") || [];

  return (
    <div className="glass rounded-2xl overflow-hidden hover-lift group flex flex-col h-full">
      <Link href={`/proposals/${proposal.id}`}>
        {(images.length > 0 || videos.length > 0) && (
          <div className="relative h-48 bg-dark-800">
            {images.length > 0 ? (
              <img src={images[0].url} alt={proposal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <video src={videos[0].url} className="w-full h-full object-cover" muted />
            )}
            {images.length > 1 && <span className="absolute bottom-3 right-3 glass text-white text-xs px-2 py-1 rounded-lg">+{images.length - 1} фото</span>}
            {videos.length > 0 && <span className="absolute bottom-3 left-3 glass text-white text-xs px-2 py-1 rounded-lg">▶ {videos.length} видео</span>}
          </div>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
          <span className="text-xs bg-brand-500/10 text-brand-400 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-brand-500/20">{proposal.category.name}</span>
          <span className="text-xs bg-white/5 text-white/50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10">{proposal.district.name}</span>
          <span className={`text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border ${status.color}`}>{status.text}</span>
        </div>

        <Link href={`/proposals/${proposal.id}`}>
          <h3 className="font-semibold text-white mb-2 text-base sm:text-lg group-hover:text-brand-400 transition-colors line-clamp-2">{proposal.title}</h3>
        </Link>

        <div className="text-white/40 text-sm mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: proposal.description }} />

        <div className="flex items-center justify-between text-sm text-white/30 mb-4">
          <span className="truncate mr-2">{proposal.author.name}</span>
          <span className="flex-shrink-0">{new Date(proposal.createdAt).toLocaleDateString("kk-KZ")}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pt-3 border-t border-white/5 mt-auto">
          <button onClick={() => vote("LIKE")} disabled={voting}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition text-sm font-medium disabled:opacity-50 border border-brand-500/20">
            👍 {likes}
          </button>
          <button onClick={() => vote("DISLIKE")} disabled={voting}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm font-medium disabled:opacity-50 border border-red-500/20">
            👎 {dislikes}
          </button>
          <div className="ml-auto text-xs sm:text-sm text-white/20">{likes + dislikes} дауыс</div>
        </div>
      </div>
    </div>
  );
}