import Link from "next/link";
import React from "react";
import { LuArrowRight } from "react-icons/lu";

export default function HeroSection() {
    return (
        <section className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">

                    {/* Contenu Texte */}
                    <div className="w-full text-center lg:text-left lg:w-1/2 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-semibold mb-5">
                            <span className="flex w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                            La nouvelle plateforme culturelle
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-5 leading-tight">
                            Vivez l'art. <br />
                            <span className="text-black text-5xl sm:text-6xl md:text-xl lg:text-5xl font-extrabold">
                                Partagez la culture.
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                            La première plateforme tout-en-un pour les passionnés d'art.
                            Achetez des billets pour les meilleurs événements, découvrez des artistes locaux et gérez vos propres événements en toute simplicité.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/products" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-yellow-600 rounded-full hover:bg-black transition-all shadow- hover:shadow-xl hover:-translate-y-0.5">
                                Explorer les événements
                                <LuArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-full hover:border-yellow-500 hover:text-yellow-600 transition-all">
                                Créer un événement
                            </Link>
                        </div>
                    </div>

                    {/* Visuel (Composition originale et réaliste) */}
                    <div className="hidden lg:block lg:w-1/2 relative z-10 h-[550px] w-full">
                        {/* Décoration d'arrière-plan */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-yellow-400/20 via-pink-400/10 to-transparent blur-[80px] rounded-full -z-10"></div>
                        
                        {/* Image principale (Centre Droit) */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[65%] h-[420px] rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.02] duration-700 z-10 ring-1 ring-black/5">
                            <img src="https://images.unsplash.com/photo-1540039155732-61122a27b4bb?auto=format&fit=crop&q=80&w=800" alt="Concert Live" className="w-full h-full object-cover" />
                        </div>

                        {/* Image secondaire (Haut Gauche) */}
                        <div className="absolute left-6 top-6 w-[45%] h-[240px] rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.02] duration-700 z-20 border-[6px] border-white">
                            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800" alt="Festival Crowd" className="w-full h-full object-cover" />
                        </div>

                        {/* Image tertiaire (Bas Gauche) */}
                        <div className="absolute left-16 bottom-6 w-[38%] h-[200px] rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.02] duration-700 z-20 border-[6px] border-white">
                            <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800" alt="Art Expo" className="w-full h-full object-cover" />
                        </div>

                        {/* Badge Glassmorphism flottant */}
                        <div className="absolute bottom-28 -right-8 bg-white/85 backdrop-blur-md border border-white/60 py-3.5 px-5 rounded-2xl shadow-xl z-30 flex items-center gap-3 animate-[bounce_4s_ease-in-out_infinite]">
                            <div className="flex -space-x-2">
                                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Artiste" />
                                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Artiste" />
                                <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-900 text-white text-[10px] flex items-center justify-center font-bold">
                                    +5k
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-900 font-bold text-sm leading-tight">Artistes locaux et organisateurs</p>
                                <p className="text-gray-500 text-xs">Nous font confiance</p>
                            </div>
                        </div>
                    </div>

                    {/* Visuel Mobile (Composition simplifiée) */}
                    <div className="block lg:hidden w-full mt-10">
                        <div className="relative h-[320px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1540039155732-61122a27b4bb?auto=format&fit=crop&q=80&w=800" alt="Concert" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            {/* Badge Mobile */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-white/60 p-4 rounded-2xl shadow-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                                        <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold text-sm leading-tight">+5k Artistes</p>
                                        <p className="text-gray-500 text-xs">Nous font confiance</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
