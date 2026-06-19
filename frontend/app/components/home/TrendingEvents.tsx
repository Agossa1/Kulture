import React from "react";

const events = [
    {
        id: 1,
        title: "Dans vos soirées",
        description: "Vibrez au rythme des meilleurs concerts et festivals directement depuis l'application avec des billets instantanés.",
        bgClass: "bg-[#25262b]", // Dark grey/black
        img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        title: "Dans vos galeries",
        description: "Plongez dans des expositions d'art moderne et classique avec un accès coupe-file exclusif.",
        bgClass: "bg-[#dae4f5]", // Light blue
        img: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        title: "Avec plus de 3000 artistes",
        description: "Des musiciens, comédiens, sculpteurs, et peintres se connectent facilement avec vous.",
        bgClass: "bg-[#f4f5f7]", // Light gray
        img: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        title: "Dans vos habitudes",
        description: "L'application offre des processus flexibles et s'adapte parfaitement à votre façon de vivre la culture au quotidien.",
        bgClass: "bg-[#0f50c0]", // Bright blue
        img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=600"
    }
];

export default function TrendingEvents() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Center aligned header matching screenshot */}
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Où que vous soyez, l'événement est là</h2>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">Que vous planifiez à l'avance ou cherchiez une sortie de dernière minute, Kulture s'adapte à vos envies.</p>
                </div>

                {/* 4 Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8">
                    {events.map((event) => (
                        <div key={event.id} className="flex flex-col group cursor-pointer">
                            
                            {/* Padded square image block */}
                            <div className={`w-full aspect-square ${event.bgClass} flex items-center justify-center p-6 md:p-8 mb-6 rounded-[4px] overflow-hidden`}>
                                <img 
                                    src={event.img} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500" 
                                />
                            </div>

                            {/* Clean text block below */}
                            <div className="pr-4">
                                <h3 className="text-[22px] font-bold text-gray-900 mb-3 leading-tight">{event.title}</h3>
                                <p className="text-gray-600 text-[15px] leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
