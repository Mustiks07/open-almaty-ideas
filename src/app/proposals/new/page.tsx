"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Editor: any = dynamic(
  () => import("@tinymce/tinymce-react").then((mod: any) => mod.Editor),
  { ssr: false, loading: () => <div className="h-64 bg-white/5 rounded-xl animate-pulse" /> }
);

export default function NewProposalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const districts = [
    { id: 1, name: "Алмалы ауданы" }, { id: 2, name: "Әуезов ауданы" },
    { id: 3, name: "Бостандық ауданы" }, { id: 4, name: "Жетісу ауданы" },
    { id: 5, name: "Медеу ауданы" }, { id: 6, name: "Наурызбай ауданы" },
    { id: 7, name: "Түрксіб ауданы" }, { id: 8, name: "Алатау ауданы" },
  ];
  const categories = [
    { id: 1, name: "Көлік" }, { id: 2, name: "Экология" },
    { id: 3, name: "Инфрақұрылым" }, { id: 4, name: "Қауіпсіздік" },
    { id: 5, name: "Білім" }, { id: 6, name: "Денсаулық сақтау" },
    { id: 7, name: "Мәдениет және спорт" }, { id: 8, name: "Басқа" },
  ];

  useEffect(() => { if (status === "unauthenticated") router.push("/auth/login"); }, [status, router]);
  if (status === "loading") return <div className="text-center py-20 text-white/40">Жүктелуде...</div>;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => {
      if (f.size > 10 * 1024 * 1024) { setError(`${f.name} — 10MB-дан асады`); return false; }
      const ok = f.type.startsWith("image/") || f.type.startsWith("video/");
      if (!ok) setError(`${f.name} — рұқсат етілмеген формат`);
      return ok;
    });
    setFiles((p) => [...p, ...valid]);
    valid.forEach((f) => {
      setPreviews((p) => [...p, { url: URL.createObjectURL(f), type: f.type.startsWith("image/") ? "image" : "video" }]);
    });
  };

  const removeFile = (i: number) => {
    URL.revokeObjectURL(previews[i].url);
    setFiles((p) => p.filter((_, j) => j !== i));
    setPreviews((p) => p.filter((_, j) => j !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plain = description.replace(/<[^>]*>/g, "").trim();
    if (plain.length < 20) { setError("Сипаттама кемінде 20 таңба"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/proposals", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, districtId: Number(districtId), categoryId: Number(categoryId) }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          setUploadProgress(`Файл жүктелуде ${i + 1}/${files.length}...`);
          const fd = new FormData(); fd.append("file", files[i]); fd.append("proposalId", String(data.id));
          await fetch("/api/upload", { method: "POST", body: fd });
        }
      }
      router.push("/proposals");
    } catch { setError("Қате орын алды"); setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Жаңа ұсыныс</p>
      <h1 className="font-heading text-3xl font-bold text-white mb-8">Ұсыныс қосу</h1>

      <div className="glass rounded-2xl p-8">
        {error && <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Ұсыныстың тақырыбы</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Мысалы: Веложолдарды көбейту" required minLength={5} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Аудан</label>
              <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                <option value="" className="bg-dark-800">Таңдаңыз</option>
                {districts.map((d) => <option key={d.id} value={d.id} className="bg-dark-800">{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Санат</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                <option value="" className="bg-dark-800">Таңдаңыз</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-dark-800">{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Сипаттама</label>
            <Editor apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY} value={description}
              onEditorChange={(content: string) => setDescription(content)}
              init={{ height: 300, menubar: false, language: "ru", plugins: ["lists", "link", "autolink", "emoticons", "wordcount"],
                toolbar: "bold italic underline | bullist numlist | link emoticons | removeformat",
                placeholder: "Ұсынысыңызды толық жазыңыз...",
                content_style: "body { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.6; background: #1E293B; color: #E2E8F0; }",
                skin: "oxide-dark", content_css: "dark", branding: false, statusbar: true, elementpath: false }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Фото / Видео қосу</label>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple onChange={handleFileSelect} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-brand-500/40 hover:bg-brand-500/5 transition cursor-pointer">
              <div className="text-3xl mb-2">📎</div>
              <p className="text-white/50 text-sm">Суреттер мен видеоларды таңдаңыз</p>
              <p className="text-white/20 text-xs mt-1">JPG, PNG, WebP, MP4, WebM — Макс 10MB</p>
            </button>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {previews.map((p, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10">
                    {p.type === "image" ? <img src={p.url} alt="" className="w-full h-28 object-cover" /> : <video src={p.url} className="w-full h-28 object-cover" />}
                    <button type="button" onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1">
                      {p.type === "image" ? "📷" : "🎥"} {files[i]?.name?.slice(0, 15)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-50">
            {loading ? uploadProgress || "Жіберілуде..." : "Ұсыныс жіберу"}
          </button>
        </form>
      </div>
    </div>
  );
}