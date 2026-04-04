"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-[80vh] bg-white/5 rounded-2xl flex items-center justify-center text-white/30">Карта жүктелуде...</div>,
});

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
      <p className="text-brand-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">Интерактивті карта</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">Алматы қаласы</h1>
      <p className="text-white/40 mb-8">Аудандарды басып, сол аудандағы ұсыныстарды көріңіз</p>
      <div style={{ position: "relative", zIndex: 0, isolation: "isolate" }}>
        <MapView />
      </div>
    </div>
  );
}