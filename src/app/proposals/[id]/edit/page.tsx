"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const Editor: any = dynamic(
  () => import("@tinymce/tinymce-react").then((mod: any) => mod.Editor),
  { ssr: false, loading: () => <div className="h-64 bg-white/5 rounded-xl animate-pulse" /> }
);

export default function EditProposalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchProposal();
    }
  }, [status]);

  const fetchProposal = async () => {
    const res = await fetch(`/api/proposals/${params.id}`);
    if (!res.ok) {
      router.push("/profile");
      return;
    }
    const data = await res.json();
    if (data.author?.id !== Number(session?.user?.id)) {
      router.push("/profile");
      return;
    }
    setTitle(data.title);
    setDescription(data.description);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(`/api/proposals/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      router.push(`/proposals/${params.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Қате орын алды");
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center py-20 text-white/40">Жүктелуде...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
        Ұсынысты өңдеу
      </p>
      <h1 className="font-heading text-3xl font-bold text-white mb-8">
        Өңдеу
      </h1>

      <div className="glass rounded-2xl p-8">
        {error && (
          <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Тақырып
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-brand-500 outline-none"
              required
              minLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Сипаттама
            </label>
            <Editor
              apiKey="oscq8owz84ft5skrkqp95vgunv4cu2mu46njwn9dxocch87k"
              value={description}
              onEditorChange={(content: string) => setDescription(content)}
              init={{
                height: 300,
                menubar: false,
                language: "ru",
                plugins: ["lists", "link", "autolink", "emoticons", "wordcount"],
                toolbar: "bold italic underline | bullist numlist | link emoticons | removeformat",
                content_style: "body { font-family: Inter, sans-serif; font-size: 15px; line-height: 1.6; background: #1E293B; color: #E2E8F0; }",
                skin: "oxide-dark",
                content_css: "dark",
                branding: false,
                statusbar: true,
                elementpath: false,
              }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-50"
            >
              {saving ? "Сақталуда..." : "Сақтау"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-4 glass text-white/70 hover:text-white rounded-xl font-semibold transition-all"
            >
              Бас тарту
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}