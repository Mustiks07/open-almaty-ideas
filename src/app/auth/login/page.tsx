"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Email немесе пароль қате");
      setLoading(false);
     } else {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      if (sessionData?.user?.role === "ADMIN") {
        signOut({ redirect: false });
        setError("Бұл бет тек пайдаланушылар үшін");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">OA</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Жүйеге кіру</h1>
          <p className="text-white/40 text-sm mt-2">Open Almaty Ideas платформасына қош келдіңіз</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="••••••" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-50">
            {loading ? "Кіру..." : "Кіру"}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-8">
          Аккаунт жоқ па?{" "}
          <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 font-medium">Тіркелу</Link>
        </p>
      </div>
    </div>
  );
}