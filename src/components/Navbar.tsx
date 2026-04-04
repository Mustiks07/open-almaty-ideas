"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-dark-900/95 backdrop-blur-lg shadow-lg shadow-black/20 border-b border-white/5"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-sm">OA</span>
            </div>
            <span className="font-heading text-xl text-white font-semibold tracking-tight">
              Open Almaty
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/proposals" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">Ұсыныстар</Link>
            <Link href="/top" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">Үздік идеялар</Link>
            <Link href="/map" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">Карта</Link>
            <Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide">Жоба туралы</Link>

            {session ? (
              <div className="flex items-center gap-4">
                {!isAdmin && (
                  <>
                    <Link href="/proposals/new" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/25">
                      + Ұсыныс қосу
                    </Link>
                    <Link href="/profile" className="text-white/70 hover:text-white transition-colors text-sm">
                      Менің ұсыныстарым
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link href="/admin" className="text-amber-400 hover:text-amber-300 transition-colors text-sm">
                    Панель
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <span className="text-white/60 text-sm">{session.user?.name}</span>
                  <button onClick={() => signOut()} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                    Шығу
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors text-sm">Кіру</Link>
                <Link href="/auth/register" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/25">
                  Тіркелу
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white/80">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-6 border-t border-white/10 mt-2 bg-dark-900 rounded-b-2xl">
            <div className="flex flex-col gap-4 pt-6">
              <Link href="/proposals" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Ұсыныстар</Link>
              <Link href="/top" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Үздік идеялар</Link>
              <Link href="/map" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Карта</Link>
              <Link href="/about" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Жоба туралы</Link>
              {session ? (
                <>
                  {!isAdmin && (
                    <>
                      <Link href="/proposals/new" className="bg-brand-500 text-white px-4 py-2.5 rounded-xl text-center text-sm font-semibold" onClick={() => setMenuOpen(false)}>+ Ұсыныс қосу</Link>
                      <Link href="/profile" className="text-white/70 text-sm" onClick={() => setMenuOpen(false)}>Менің ұсыныстарым</Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="text-amber-400 text-sm" onClick={() => setMenuOpen(false)}>Панель</Link>
                  )}
                  <button onClick={() => { signOut(); setMenuOpen(false); }} className="text-red-400 text-left text-sm">Шығу</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-white/70 text-sm" onClick={() => setMenuOpen(false)}>Кіру</Link>
                  <Link href="/auth/register" className="bg-brand-500 text-white px-4 py-2.5 rounded-xl text-center text-sm font-semibold" onClick={() => setMenuOpen(false)}>Тіркелу</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}