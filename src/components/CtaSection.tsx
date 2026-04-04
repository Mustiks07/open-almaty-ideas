"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CtaSection() {
  const { data: session } = useSession();

  if (session) return null;

  return (
    <section className="hero-bg py-24 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
          Қаланы бірге жақсартайық
        </h2>
        <p className="text-white/40 mb-10 text-lg">
          Сіздің идеяңыз Алматының болашағын өзгерте алады
        </p>
        <Link
          href="/auth/register"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-brand-500/25 hover:-translate-y-1"
        >
          Тіркелу
        </Link>
      </div>
    </section>
  );
}