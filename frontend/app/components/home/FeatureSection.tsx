"use client";
import React from "react";
import { LuZap, LuUser, LuBrush, LuShieldCheck } from "react-icons/lu";

const features = [
    {
        id: 1,
        title: "La simplicité avant tout",
        description: "Pensée pour tous, notre plateforme est simple d'utilisation. Une simplicité se reflétant également dans le parcours d'achat de vos participants.",
        icon: <LuZap className="w-[18px] h-[18px] text-gray-900 relative z-10" />
    },
    {
        id: 2,
        title: "Une autonomie totale",
        description: "Nos outils vous offrent une autonomie complète sur l'ensemble de vos opérations, pour un contrôle total de votre événement.",
        icon: <LuUser className="w-[18px] h-[18px] text-gray-900 relative z-10" />
    },
    {
        id: 3,
        title: "100% personnalisée",
        description: "Une centaine d'options sont disponibles pour personnaliser votre billetterie en ligne selon l'image de votre événement et pour vous créer une identité forte.",
        icon: <LuBrush className="w-[18px] h-[18px] text-gray-900 relative z-10" />
    },
    {
        id: 4,
        title: "Une fiabilité à tout épreuve",
        description: "Nos billetteries en ligne sont conçues pour supporter des charges importantes de participants connectés au même moment.",
        icon: <LuShieldCheck className="w-[18px] h-[18px] text-gray-900 relative z-10" />
    }
];

export default function FeatureSection() {
    return (
        <section className="py-20 sm:py-32 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 4 Column Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex flex-col">
                            
                            {/* Jagged Purple Badge */}
                            <div className="relative w-[48px] h-[48px] flex items-center justify-center mb-6">
                                {/* Jagged / Scalloped Starburst SVG Background */}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 100 100" 
                                    className="absolute inset-0 w-full h-full text-yellow-500 fill-current"
                                >
                                    <path d="M50 0L57.5 4.5L66 2L71.5 8.5L80 8L83 16L91 18L91.5 26.5L98 30.5L95.5 39L100 45L95.5 52.5L98 61L91.5 65L91 73.5L83 75.5L80 83.5L71.5 83L66 89.5L57.5 87L50 91.5L42.5 87L34 89.5L28.5 83L20 83.5L17 75.5L9 73.5L8.5 65L2 61L4.5 52.5L0 45L4.5 37.5L2 29L8.5 25L9 16.5L17 14.5L20 6.5L28.5 7L34 0.5L42.5 3L50 0Z" />
                                </svg>
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-[16px] text-gray-600 leading-[1.6]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
