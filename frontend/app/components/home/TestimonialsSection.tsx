"use client";
import React, { useRef } from "react";
import { LuChevronLeft, LuChevronRight, LuArrowRight } from "react-icons/lu";

const testimonials = [
    {
        id: 1,
        name: "Aminata Touré",
        role: "Passionnée de culture",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
        review: "J'ai trouvé des événements que je n'aurais jamais découverts autrement. La plateforme est intuitive et les billets arrivent en quelques secondes. Je recommande vivement !",
        colors: { imgBg: "bg-[#f0e6df]", boxBg: "bg-[#d95e0c]" }
    },
    {
        id: 2,
        name: "Kofi Mensah",
        role: "Artiste indépendant",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        review: "En tant qu'artiste, Kulture m'a permis de vendre mes œuvres à un public que je n'aurais jamais pu atteindre seul. La gestion des événements est vraiment simple et efficace.",
        colors: { imgBg: "bg-[#dbe7fd]", boxBg: "bg-[#0f50c0]" }
    },
    {
        id: 3,
        name: "Fatou Camara",
        role: "Organisatrice d'événements",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=400",
        review: "Avant Kulture, je jonglais entre plusieurs apps. Maintenant tout est centralisé : mes événements, mes billets, mes artistes. Un vrai gain de temps inestimable.",
        colors: { imgBg: "bg-[#e2efcc]", boxBg: "bg-[#536f2e]" }
    },
    {
        id: 4,
        name: "Segun Adeyemi",
        role: "Photographe",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        review: "J'ai découvert des paiements en ligne simplifiés grâce à Kulture. Une super expérience, je remercie l'équipe pour cela. Des frais raisonnables et une interface claire.",
        colors: { imgBg: "bg-[#f5e1f0]", boxBg: "bg-[#71286c]" } 
    },
    {
        id: 5,
        name: "Mariama Diallo",
        role: "Mélomane",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
        review: "Je suis abonnée à Kulture depuis le lancement. Je paie mes billets, je suis mes artistes préférés et je reçois des alertes pour les nouveaux événements. Aucune plainte !",
        colors: { imgBg: "bg-[#ffe4e1]", boxBg: "bg-[#c0392b]" } 
    },
    {
        id: 6,
        name: "Amoin Konan",
        role: "Collectionneur d'art",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
        review: "J'adore la transparence des prix sur Kulture. Je vois exactement où va mon argent chaque mois. Kulture m'a même aidé à mettre de côté pour mes achats.",
        colors: { imgBg: "bg-[#e0f2f1]", boxBg: "bg-[#00695c]" } 
    },
];

export default function TestimonialsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -700 : 700;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ce que disent nos utilisateurs</h2>
                    <p className="text-gray-600 text-lg">Découvrez comment Kulture a transformé leur expérience artistique.</p>
                </div>
                
                {/* Pagination Controls Desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition">
                        <LuChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center hover:bg-gray-400 transition">
                        <LuChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="relative">
                <div 
                    ref={scrollRef} 
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-4 sm:px-6 lg:px-8 xl:px-0 xl:pl-[max(1rem,calc((100vw-80rem)/2))] hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((t) => (
                        <div key={t.id} className="snap-center shrink-0 flex items-center w-[340px] md:w-[750px] flex-col md:flex-row relative z-10">
                            
                            {/* Photo Container */}
                            <div className={`w-full md:w-[280px] h-[340px] md:h-[380px] rounded-lg ${t.colors.imgBg} relative overflow-hidden flex-shrink-0 z-10`}>
                                <img 
                                    src={t.avatar} 
                                    alt={t.name} 
                                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale opacity-90 transition-transform duration-700 hover:scale-105" 
                                />
                            </div>

                            {/* Text Container */}
                            <div className={`w-full md:w-[500px] md:-ml-12 mt-[-40px] md:mt-0 min-h-[420px] rounded-lg ${t.colors.boxBg} text-white p-8 md:p-12 relative z-20   flex flex-col`}>
                                <div className="text-6xl font-serif opacity-40 leading-none mb-4">“</div>
                                <p className="text-lg md:text-xl font-medium mb-8 leading-relaxed flex-1">
                                    {t.review}
                                </p>
                                <div className="mt-auto">
                                    <p className="text-sm font-bold uppercase tracking-widest text-white mb-1">{t.name}, {t.role}</p>
                                    <a href="#" className="text-sm mt-4 font-semibold flex items-center gap-2 hover:opacity-80 transition group w-max">
                                        Lire l'histoire <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                                {/* Subtle internal overlay to mimic screenshot shadow effect */}
                                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/20 to-transparent rounded-r-lg pointer-events-none mix-blend-overlay"></div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Pagination Controls Mobile */}
                <div className="lg:hidden flex items-center justify-center gap-3 mt-4">
                    <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition">
                        <LuChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full bg-gray-300 text-white flex items-center justify-center hover:bg-gray-400 transition">
                        <LuChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Inject custom CSS to hide scrollbar for webkit browsers */}
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section>
    );
}
