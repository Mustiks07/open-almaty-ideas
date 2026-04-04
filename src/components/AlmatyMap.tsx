"use client";

import { useRouter } from "next/navigation";

interface DistrictData {
  name: string;
  count: number;
}

export default function AlmatyMap({ districts }: { districts: DistrictData[] }) {
  const router = useRouter();

  const getCount = (name: string) => {
    return districts.find((d) => d.name.includes(name))?.count || 0;
  };

  const handleClick = (district: string) => {
    router.push(`/proposals?district=${encodeURIComponent(district)}`);
  };

  const districtPaths = [
    {
      id: "almaly",
      name: "Алмалы",
      fullName: "Алмалы ауданы",
      path: "M280,200 L340,180 L380,210 L370,260 L320,270 L270,250 Z",
      labelX: 315,
      labelY: 230,
    },
    {
      id: "bostandyk",
      name: "Бостандық",
      fullName: "Бостандық ауданы",
      path: "M200,250 L270,250 L320,270 L370,260 L360,320 L280,340 L210,310 Z",
      labelX: 285,
      labelY: 295,
    },
    {
      id: "medeu",
      name: "Медеу",
      fullName: "Медеу ауданы",
      path: "M370,260 L380,210 L440,220 L460,270 L450,330 L360,320 Z",
      labelX: 410,
      labelY: 280,
    },
   {
      id: "auezov",
      name: "Әуезов",
      fullName: "Әуезов ауданы",
      path: "M120,200 L200,180 L280,200 L270,250 L200,250 L210,310 L140,290 L110,240 Z",
      labelX: 195,
      labelY: 235,
    },
    {
      id: "zhetysu",
      name: "Жетісу",
      fullName: "Жетісу ауданы",
      path: "M340,180 L420,160 L440,220 L380,210 Z",
      labelX: 395,
      labelY: 195,
    },
    {
      id: "turksib",
      name: "Түрксіб",
      fullName: "Түрксіб ауданы",
      path: "M280,200 L340,180 L420,160 L400,120 L320,100 L240,130 L200,180 Z",
      labelX: 310,
      labelY: 150,
    },
    {
      id: "alatau",
      name: "Алатау",
      fullName: "Алатау ауданы",
      path: "M40,180 L120,200 L110,240 L140,290 L210,310 L280,340 L260,390 L180,400 L80,370 L30,300 L20,230 Z",
      labelX: 155,
      labelY: 330,
    },
    {
      id: "nauryzbay",
      name: "Наурызбай",
      fullName: "Наурызбай ауданы",
      path: "M40,180 L120,200 L200,180 L240,130 L320,100 L280,60 L180,50 L100,80 L40,130 Z",
      labelX: 180,
      labelY: 120,
    },
  ];

  const colors = [
    { fill: "#EEF2FF", hover: "#E0E7FF", stroke: "#818CF8" },
    { fill: "#ECFDF5", hover: "#D1FAE5", stroke: "#34D399" },
    { fill: "#FFF7ED", hover: "#FFEDD5", stroke: "#FB923C" },
    { fill: "#EFF6FF", hover: "#DBEAFE", stroke: "#60A5FA" },
    { fill: "#FDF2F8", hover: "#FCE7F3", stroke: "#F472B6" },
    { fill: "#F5F3FF", hover: "#EDE9FE", stroke: "#A78BFA" },
    { fill: "#ECFEFF", hover: "#CFFAFE", stroke: "#22D3EE" },
    { fill: "#FEF9C3", hover: "#FEF08A", stroke: "#FACC15" },
  ];

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 500 440"
        className="w-full max-w-2xl mx-auto"
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))" }}
      >
        {districtPaths.map((district, i) => {
          const color = colors[i % colors.length];
          const count = getCount(district.name);

          return (
            <g
              key={district.id}
              onClick={() => handleClick(district.fullName)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <path
                d={district.path}
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth="2"
                className="transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.setAttribute("fill", color.hover);
                  e.currentTarget.setAttribute("stroke-width", "3");
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.setAttribute("fill", color.fill);
                  e.currentTarget.setAttribute("stroke-width", "2");
                }}
              />
              <text
                x={district.labelX}
                y={district.labelY - 8}
                textAnchor="middle"
                className="text-xs font-semibold fill-gray-800 pointer-events-none"
                style={{ fontSize: "11px" }}
              >
                {district.name}
              </text>
              <text
                x={district.labelX}
                y={district.labelY + 8}
                textAnchor="middle"
                className="fill-gray-500 pointer-events-none"
                style={{ fontSize: "10px" }}
              >
                {count} ұсыныс
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}