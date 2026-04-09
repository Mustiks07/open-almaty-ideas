import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Open Almaty Ideas",
  description: "Алматы қаласын бірге жақсартайық!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body className="bg-dark-950 min-h-screen flex flex-col text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 bg-dark-900/50">
            <div className="max-w-5xl mx-auto px-6 py-12">
              {/* Негізгі layout: сол жақ логотип, оң жақ контент */}
              <div className="flex flex-col md:flex-row md:justify-between gap-10">
                {/* Сол жақ — Логотип */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">OA</span>
                    </div>
                    <span className="font-heading text-lg text-white font-semibold">Open Almaty Ideas</span>
                  </div>
                  <p className="text-white/20 text-xs mt-6">© 2026 Open Almaty Ideas</p>
                  <p className="text-white/15 text-xs">Алматы, Қазақстан</p>
                </div>

                {/* Оң жақ — Навигация + Автор */}
                <div className="text-right">
                  {/* Навигация */}
                  <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 text-sm mb-8">
                    <a href="/proposals" className="text-white/40 hover:text-white/70 transition-colors">Ұсыныстар</a>
                    <a href="/top" className="text-white/40 hover:text-white/70 transition-colors">Үздік идеялар</a>
                    <a href="/map" className="text-white/40 hover:text-white/70 transition-colors">Карта</a>
                    <a href="/about" className="text-white/40 hover:text-white/70 transition-colors">Жоба туралы</a>
                  </div>

                  {/* Автор */}
                  <div className="border-t border-white/5 pt-6">
                    <p className="text-brand-400/60 text-xs font-semibold tracking-[0.15em] uppercase mb-2">Жоба авторы</p>
                    <p className="text-white/50 text-sm font-medium mb-1">Ермекова Айнур Ардаковна</p>
                    <p className="text-white/25 text-xs leading-relaxed max-w-md ml-auto">
                      Қ. Құлажанов атындағы Қазақ технология және бизнес университеті, 7M04144 – «Мемлекеттік және жергілікті басқару». Диссертациялық жұмыс шеңберінде әзірленді.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}