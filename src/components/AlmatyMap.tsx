"use client";

interface DistrictData {
  name: string;
  count: number;
}

export default function AlmatyMap({ districts }: { districts: DistrictData[] }) {
  return (
    <div className="relative flex items-center justify-center">
      <img
        src="/almaty-map.jpg"
        alt="Алматы аудандары"
        className="w-full rounded-2xl"
      />
    </div>
  );
}