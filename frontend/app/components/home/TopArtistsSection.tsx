"use client";
import React, { useRef } from "react";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";

const artists = [
    {
        id: 1,
        name: "Aminata Diallo",
        specialty: "Musicienne & Chanteuse",
        badge: "N°1 SEMAINE",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
        color: "bg-[#d95e0c]", // Orange
        textColor: "text-[#d95e0c]",
    },
    {
        id: 2,
        name: "Kofi Mensah",
        specialty: "Peintre & Sculpteur",
        badge: "ARTISTE DU MOIS",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        color: "bg-[#536f2e]", // Olive green
        textColor: "text-[#536f2e]",
    },
    {
        id: 3,
        name: "Fatou Camara",
        specialty: "Stand-up Comédienne",
        badge: "TENDANCE",
        img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=400",
        color: "bg-[#0f50c0]", // Blue
        textColor: "text-[#0f50c0]",
    },
    {
        id: 4,
        name: "Segun Adeyemi",
        specialty: "Photographe & Cinéaste",
        badge: "RÉVÉLATION",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        color: "bg-[#71286c]", // Purple
        textColor: "text-[#71286c]",
    },
    {
        id: 5,
        name: "Aisha Touré",
        specialty: "Danseuse Contemporaine",
        badge: "NOUVELLE",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
        color: "bg-[#0b2447]", // Dark Navy
        textColor: "text-[#0b2447]",
    },
    {
        id: 6,
        name: "Aisha Touré",
        specialty: "Danseuse Contemporaine",
        badge: "NOUVELLE",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
        color: "bg-[#0b2447]", // Dark Navy
        textColor: "text-[#0b2447]",
    }
];

export default function TopArtistsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            // Scroll by roughly the width of one card + gap
            const scrollAmount = direction === 'left' ? -340 : 340;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-white relative">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header matching screenshot with buttons */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="text-left">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 ">Meilleurs artistes du moment</h2>
                        <p className="text-gray-600 text-lg sm:text-xl">Découvrez les talents les plus appréciés et explorez leurs œuvres.</p>
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-black transition shadow-sm">
                            <LuChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-black transition shadow-sm">
                            <LuChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Horizontal scrolling card container */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {artists.map((artist) => (
                        <div 
                            key={artist.id} 
                            className="snap-start shrink-0 w-full sm:w-[320px] rounded overflow-hidden flex flex-col group cursor-pointer"
                        >
                            {/* Top Half: Image */}
                            <div className="h-[280px] w-full relative bg-gray-100 overflow-hidden">
                                <img 
                                    src={artist.img} 
                                    alt={artist.name} 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            </div>

                            {/* Bottom Half: Solid color block */}
                            <div className={`flex-1 p-6 sm:p-8 ${artist.color} text-white flex flex-col min-h-[260px]`}>
                                <div>
                                    <span className={`inline-block text-[11px] font-bold tracking-widest uppercase bg-white ${artist.textColor} px-2 py-0.5 rounded-sm mb-5`}>
                                        {artist.badge}
                                    </span>
                                    <h3 className="text-2xl font-semibold leading-tight mb-3">
                                        {artist.name}
                                    </h3>
                                    <p className="text-white/90 text-[15px] leading-snug">
                                        {artist.specialty}
                                    </p>
                                </div>
                                
                                <div className="mt-auto pt-6">
                                    <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Voir le profil <LuArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Navigation Buttons */}
                <div className="md:hidden flex items-center justify-center gap-3 mt-4">
                    <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-black transition shadow-sm">
                        <LuChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-black transition shadow-sm">
                        <LuChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Custom CSS to hide scrollbar for webkit browsers */}
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section>
    );
}
