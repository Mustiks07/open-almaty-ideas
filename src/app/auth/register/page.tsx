"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.ok) { router.push("/"); router.refresh(); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">OA</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Тіркелу</h1>
          <p className="text-white/40 text-sm mt-2">Платформаға қосылыңыз</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Аты-жөні</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Аты-жөніңіз" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="email@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Кемінде 6 таңба" required minLength={6} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-50">
            {loading ? "Тіркелу..." : "Тіркелу"}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-8">
          Аккаунт бар ма?{" "}
          <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium">Кіру</Link>
        </p>
      </div>
    </div>
  );
}