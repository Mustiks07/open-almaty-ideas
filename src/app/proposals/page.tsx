"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProposalCard from "@/components/ProposalCard";

export default function ProposalsPage() {
  const searchParams = useSearchParams();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [filterDistrict, setFilterDistrict] = useState(searchParams.get("district") || "");
  const [filterCategory, setFilterCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const districts = [
    "Алмалы ауданы", "Әуезов ауданы", "Бостандық ауданы", "Жетісу ауданы",
    "Медеу ауданы", "Наурызбай ауданы", "Түрксіб ауданы", "Алатау ауданы",
  ];
  const categories = [
    "Көлік", "Экология", "Инфрақұрылым", "Қауіпсіздік",
    "Білім", "Денсаулық сақтау", "Мәдениет және спорт", "Басқа",
  ];

  useEffect(() => { fetchProposals(); }, [sort, filterDistrict, filterCategory, search]);

  const fetchProposals = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (filterDistrict) params.set("district", filterDistrict);
    if (filterCategory) params.set("category", filterCategory);
    if (search) params.set("search", search);
    const res = await fetch(`/api/proposals?${params}`);
    setProposals(await res.json());
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearch(searchInput); };
  const clearSearch = () => { setSearchInput(""); setSearch(""); };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Барлық ұсыныстар</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-10">Ұсыныстар тізімі</h1>

      <div className="glass rounded-2xl p-5 mb-10 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Ұсыныстарды іздеу..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
            {searchInput && <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">✕</button>}
          </div>
          <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all">Іздеу</button>
        </form>

        <div className="flex flex-col md:flex-row gap-3">
          {[
            { value: filterDistrict, setter: setFilterDistrict, placeholder: "Барлық аудандар", options: districts },
            { value: filterCategory, setter: setFilterCategory, placeholder: "Барлық санаттар", options: categories },
          ].map((f, i) => (
            <select key={i} value={f.value} onChange={(e) => f.setter(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
              <option value="" className="bg-dark-800">{f.placeholder}</option>
              {f.options.map((o) => <option key={o} value={o} className="bg-dark-800">{o}</option>)}
            </select>
          ))}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
            <option value="newest" className="bg-dark-800">Жаңалар</option>
            <option value="popular" className="bg-dark-800">Танымалдар</option>
          </select>
          {(filterDistrict || filterCategory || search) && (
            <button onClick={() => { setFilterDistrict(""); setFilterCategory(""); clearSearch(); }}
              className="text-sm text-red-400 hover:text-red-300 px-3 py-3">Тазалау</button>
          )}
        </div>
        {search && <p className="text-sm text-white/40">«{search}» бойынша {proposals.length} ұсыныс табылды</p>}
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/40">Жүктелуде...</div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/50 text-lg">Ұсыныстар табылмады</p>
          <p className="text-white/30 text-sm mt-2">{search ? "Басқа сөзбен іздеп көріңіз" : "Бірінші ұсынысты сіз қосыңыз!"}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((p) => <ProposalCard key={p.id} proposal={p} />)}
        </div>
      )}
    </div>
  );
}