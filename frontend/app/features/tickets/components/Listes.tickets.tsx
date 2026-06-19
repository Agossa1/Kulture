"use client";

import { TicketCard } from "@/app/components/ui/cards/card";
import { useState } from "react";
import Link from "next/link";

interface DatabaseTicketType {
    id: string;
    event_id: string;
    name: string;
    ticket_type_details: {
        description: string | null;
        max_per_order: number;
    } | null;
    ticket_type_pricing: {
        price: number;
        currency: string;
    } | null;
    ticket_type_inventory: {
        total_quantity: number;
        status: 'available' | 'sold_out';
    } | null;
    image_url?: string;
    date?: string;
    location?: string;
    category?: string;
    organizer?: string;
    organizerAvatar?: string;
    likes?: number;
}

// Tableau de données de test (Mock Data)
const MOCK_TICKETS: DatabaseTicketType[] = [
    {
        id: "11111111-1111-1111-1111-111111111111",
        event_id: "event-001",
        name: "Concert de Dopelym à Abidjan",
        image_url: "https://images.unsplash.com/photo-1540039155732-61122a27b4bb?auto=format&fit=crop&q=80&w=600",
        ticket_type_details: {
            description: "Accès standard à l'événement. Placement libre assis ou debout selon l'ordre d'arrivée.",
            max_per_order: 10
        },
        ticket_type_pricing: { price: 5000, currency: "XOF" },
        ticket_type_inventory: { total_quantity: 120, status: 'available' },
        date: "sam. 25 juil. 2026 | 14h00",
        location: "Abidjan, Côte d'Ivoire",
        category: "Concert",
        organizer: "Ambition Consulti...",
        likes: 526,
    },
    {
        id: "22222222-2222-2222-2222-222222222222",
        event_id: "event-001",
        name: "TRK En Concert",
        image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
        ticket_type_details: {
            description: "Entrée prioritaire coupe-file, cocktail de bienvenue et espace lounge réservé.",
            max_per_order: 4
        },
        ticket_type_pricing: { price: 0, currency: "XOF" },
        ticket_type_inventory: { total_quantity: 15, status: 'available' },
        date: "sam. 18 juil. 2026 | 15h00",
        location: "Abidjan, Côte d'Ivoire",
        category: "Concert",
        organizer: "Ambition Consulti...",
        likes: 1661,
    },
    {
        id: "22222222-2222-2222-2222-2222d22222222",
        event_id: "event-001",
        name: "TNT en concert au Palais de la Culture",
        image_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=600",
        ticket_type_details: {
            description: "Entrée prioritaire coupe-file, cocktail de bienvenue et espace lounge réservé.",
            max_per_order: 4
        },
        ticket_type_pricing: { price: 10000, currency: "XOF" },
        ticket_type_inventory: { total_quantity: 50, status: 'available' },
        date: "sam. 4 juil. 2026 | 13h00",
        location: "Abidjan, Côte d'Ivoire",
        category: "Concert",
        organizer: "Guipâh Prod'Event...",
        likes: 125,
    },
    {
        id: "33333333-3333-3333-3333-333333333333",
        event_id: "event-001",
        name: "Yodé & Siro en Concert",
        image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=600",
        ticket_type_details: {
            description: "Tarif promotionnel réservé aux 50 premiers acheteurs.",
            max_per_order: 2
        },
        ticket_type_pricing: { price: 0, currency: "XOF" },
        ticket_type_inventory: { total_quantity: 0, status: 'sold_out' },
        date: "sam. 15 août 2026 | 17h00",
        location: "Abidjan, Côte d'Ivoire",
        category: "Concert",
        organizer: "Aba Sylvain",
        likes: 72,
    }
];

export default function ListesTickets() {
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);
    const totalPrice = MOCK_TICKETS.reduce((acc, t) => acc + (quantities[t.id] || 0) * (t.ticket_type_pricing?.price || 0), 0);
    const currency = MOCK_TICKETS[0]?.ticket_type_pricing?.currency || "XOF";

    const formattedTotal = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(totalPrice);

    const handleQuantityChange = (id: string, qty: number) => {
        setQuantities(prev => {
            const next = { ...prev };
            if (qty <= 0) {
                delete next[id];
            } else {
                next[id] = qty;
            }
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative pb-32">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Billetterie</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">Sélectionnez les billets que vous souhaitez acheter. Les places sont limitées, réservez vite !</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MOCK_TICKETS.map((ticket) => (
                        <TicketCard
                            key={ticket.id}
                            id={ticket.id}
                            href={`/details-tickets/${ticket.id}`}
                            name={ticket.name}
                            imageSrc={ticket.image_url}
                            description={ticket.ticket_type_details?.description ?? undefined}
                            price={(ticket.ticket_type_pricing?.price ?? 0).toString()}
                            currency={ticket.ticket_type_pricing?.currency ?? "XOF"}
                            status={ticket.ticket_type_inventory?.status ?? "available"}
                            availableQuantity={ticket.ticket_type_inventory?.total_quantity ?? 0}
                            maxPerOrder={ticket.ticket_type_details?.max_per_order}
                            quantity={quantities[ticket.id] || 0}
                            onQuantityChange={(qty) => handleQuantityChange(ticket.id, qty)}
                            date={ticket.date}
                            location={ticket.location}
                            category={ticket.category}
                            organizer={ticket.organizer}
                            likes={ticket.likes}
                        />
                    ))}
                </div>
            </div>

            {/* Sticky Checkout Bar */}
            {totalTickets > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] p-4 sm:p-6 z-50 animate-in slide-in-from-bottom-full duration-300">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Total de la commande</p>
                            <p className="text-lg font-bold text-gray-900">{totalTickets} billet{totalTickets > 1 ? 's' : ''} sélectionné{totalTickets > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-gray-500 font-medium mb-1">Total</p>
                                <p className="text-2xl font-extrabold text-yellow-600">{formattedTotal}</p>
                            </div>
                            <button className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3.5 px-8 rounded-full transition-all shadow-md shadow-yellow-500/20 text-lg">
                                Continuer →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
