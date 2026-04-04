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
          <footer className="bg-dark-900 border-t border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">OA</span>
                </div>
                <span className="font-heading text-lg text-white font-semibold">Open Almaty Ideas</span>
              </div>
              <p className="text-white/40 text-sm mb-1">Азаматтардың пікірін ескеретін ашық цифрлық платформа</p>
              <p className="text-white/30 text-xs">Біз бірге қаламызды жақсартамыз!</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}