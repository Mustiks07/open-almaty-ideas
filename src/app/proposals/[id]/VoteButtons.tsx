"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function VoteButtons({ proposalId, initialLikes, initialDislikes }: { proposalId: number; initialLikes: number; initialDislikes: number }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [voting, setVoting] = useState(false);

  const vote = async (voteType: "LIKE" | "DISLIKE") => {
    if (!session) { window.location.href = "/auth/login"; return; }
    if (voting) return;
    setVoting(true);
    const res = await fetch("/api/votes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proposalId, voteType }) });
    if (res.ok) {
      const data = await res.json();
      if (data.action === "voted") { voteType === "LIKE" ? setLikes(p => p + 1) : setDislikes(p => p + 1); }
      else if (data.action === "removed") { voteType === "LIKE" ? setLikes(p => p - 1) : setDislikes(p => p - 1); }
      else if (data.action === "changed") { if (voteType === "LIKE") { setLikes(p => p + 1); setDislikes(p => p - 1); } else { setDislikes(p => p + 1); setLikes(p => p - 1); } }
    }
    setVoting(false);
  };

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => vote("LIKE")} disabled={voting}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition font-medium disabled:opacity-50 border border-brand-500/20">
        👍 Қолдаймын ({likes})
      </button>
      <button onClick={() => vote("DISLIKE")} disabled={voting}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition font-medium disabled:opacity-50 border border-red-500/20">
        👎 Қолдамаймын ({dislikes})
      </button>
      <span className="text-sm text-white/30 ml-2">Барлығы {likes + dislikes} дауыс</span>
    </div>
  );
}