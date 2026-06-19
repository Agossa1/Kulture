"use client";
import { useState } from "react";
import { 
  LuLayoutGrid, 
  LuMusic, 
  LuPalette, 
  LuGraduationCap, 
  LuWine, 
  LuMapPin, 
  LuDumbbell, 
  LuTent, 
  LuAtom, 
  LuChurch, 
  LuUtensils, 
  LuBriefcase, 
  LuShieldQuestion 
} from "react-icons/lu";

export const categories = [
  { id: "all", name: "Toutes", icon: LuLayoutGrid },
  { id: "concert", name: "Concert", icon: LuMusic },
  { id: "culture", name: "Culture", icon: LuPalette },
  { id: "formation", name: "Formation", icon: LuGraduationCap },
  { id: "soiree", name: "Soirée", icon: LuWine },
  { id: "tourisme", name: "Tourisme", icon: LuMapPin },
  { id: "sport", name: "Sport", icon: LuDumbbell },
  { id: "festival", name: "Festival", icon: LuTent },
  { id: "science", name: "Science", icon: LuAtom },
  { id: "religieux", name: "Religieux", icon: LuChurch },
  { id: "gastronomie", name: "Gastronomie", icon: LuUtensils },
  { id: "business", name: "Business", icon: LuBriefcase },
  { id: "autre", name: "Autre", icon: LuShieldQuestion },
];

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="w-full overflow-x-auto py-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex gap-4 min-w-max pb-2 px-4 sm:px-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[110px] h-[96px] rounded-2xl border transition-all duration-200 ${
                isActive 
                  ? "bg-red-50 border-red-100 shadow-sm" 
                  : "bg-white border-gray-200 hover:border-yellow-300 hover:shadow-sm"
              }`}
            >
              <Icon className="w-7 h-7 mb-2.5 text-yellow-500" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-800 tracking-tight">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Hide scrollbar for webkit (Chrome, Safari) */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
