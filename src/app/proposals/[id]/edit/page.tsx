"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const Editor: any = dynamic(
  () => import("@tinymce/tinymce-react").then((mod: any) => mod.Editor),
  { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" /> }
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
    return <div className="text-center py-20 text-gray-500">Жүктелуде...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ұсынысты өңдеу</h1>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тақырып</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
              minLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Сипаттама</label>
            <Editor
              apiKey="5coqgns2dzfla00yq66p6l8oorh4mysl8e4cddklnlza2btf"
              value={description}
              onEditorChange={(content: string) => setDescription(content)}
              init={{
                height: 300,
                menubar: false,
                language: "ru",
                plugins: ["lists", "link", "autolink", "emoticons", "wordcount"],
                toolbar: "bold italic underline | bullist numlist | link emoticons | removeformat",
                content_style: "body { font-family: Inter, -apple-system, sans-serif; font-size: 15px; line-height: 1.6; }",
                branding: false,
                statusbar: true,
                elementpath: false,
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {saving ? "Сақталуда..." : "Сақтау"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-600 border rounded-lg hover:bg-gray-50 transition"
            >
              Бас тарту
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}