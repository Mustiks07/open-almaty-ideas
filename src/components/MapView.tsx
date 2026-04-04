"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Leaflet маркер иконкасын түзету
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const districts = [
  {
    name: "Алмалы ауданы",
    lat: 43.2567,
    lng: 76.9286,
    description: "Қала орталығы, іскерлік аймақ",
  },
  {
    name: "Әуезов ауданы",
    lat: 43.2352,
    lng: 76.8536,
    description: "Ең тығыз қоныстанған аудан",
  },
  {
    name: "Бостандық ауданы",
    lat: 43.2220,
    lng: 76.9050,
    description: "Оқу орындары мен саябақтар",
  },
  {
    name: "Жетісу ауданы",
    lat: 43.27,
    lng: 76.98,
    description: "Шығыс бөлігі, тұрғын аймақ",
  },
  {
    name: "Медеу ауданы",
    lat: 43.23,
    lng: 76.96,
    description: "Медеу мұзайдыны, тау бөктері",
  },
  {
    name: "Наурызбай ауданы",
    lat: 43.28,
    lng: 76.82,
    description: "Батыс бөлігі, жаңа құрылыстар",
  },
  {
    name: "Түрксіб ауданы",
    lat: 43.29,
    lng: 76.94,
    description: "Солтүстік-шығыс, өнеркәсіп аймағы",
  },
  {
    name: "Алатау ауданы",
    lat: 43.21,
    lng: 76.84,
    description: "Оңтүстік-батыс, жаңа аудан",
  },
];

export default function MapView() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((proposals) => {
        const countMap: Record<string, number> = {};
        proposals.forEach((p: any) => {
          const name = p.district.name;
          countMap[name] = (countMap[name] || 0) + 1;
        });
        setCounts(countMap);
      });
  }, []);

  return (
    <div
      className="rounded-xl overflow-hidden border shadow-sm"
      style={{ height: "85vh" }}
    >
      <MapContainer
        center={[43.2551, 76.9126]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {districts.map((district) => (
          <Marker
            key={district.name}
            position={[district.lat, district.lng]}
            icon={icon}
          >
            <Popup>
              <div className="text-center" style={{ minWidth: "180px" }}>
                <h3 style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>
                  {district.name}
                </h3>

                <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                  {district.description}
                </p>

                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#4F46E5",
                    marginBottom: "8px",
                  }}
                >
                  {counts[district.name] || 0} ұсыныс
                </p>

                {/* 🔥 FIX ОСЫ ЖЕР */}
                <Link
                  href={`/proposals?district=${encodeURIComponent(district.name)}`}
                  style={{
                    display: "inline-block",
                    background: "#4F46E5",
                    color: "white",
                    padding: "6px 16px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    textDecoration: "none",
                  }}
                >
                  Ұсыныстарды көру
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}