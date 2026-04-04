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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
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

            <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-white/80">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Мобильді sidebar */}
      <div
        className={`fixed inset-0 z-[9999] md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className={`fixed top-0 left-0 bottom-0 w-72 z-[10000] md:hidden bg-dark-900 border-r border-white/5 transform transition-transform duration-300 ease-out ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">OA</span>
              </div>
              <span className="font-heading text-lg text-white font-semibold">Open Almaty</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Навигация */}
          <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {[
              { href: "/proposals", label: "Ұсыныстар", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
              { href: "/top", label: "Үздік идеялар", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
              { href: "/map", label: "Карта", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
              { href: "/about", label: "Жоба туралы", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Қолданушы бөлімі */}
          <div className="border-t border-white/5 p-4 space-y-2">
            {session ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                    {session.user?.name?.charAt(0)}
                  </div>
                  <span className="text-white/70 text-sm">{session.user?.name}</span>
                </div>

                {!isAdmin && (
                  <>
                    <Link href="/proposals/new" onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                      + Ұсыныс қосу
                    </Link>
                    <Link href="/profile" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Менің ұсыныстарым
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-all text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Панель
                  </Link>
                )}

                <button onClick={() => { signOut(); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm text-left">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Шығу
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-white/70 hover:text-white border border-white/10 hover:bg-white/5 transition-all text-sm">
                  Кіру
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                  Тіркелу
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}