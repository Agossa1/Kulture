"use client";

import React, { useState } from "react";
import { LuCalendar, LuMapPin, LuClock, LuTicket, LuArrowLeft, LuStar, LuUsers, LuChevronRight, LuX, LuMaximize2 } from "react-icons/lu";


import Link from "next/link";

import { MOCK_EVENT, FAQ_ITEMS } from "./constants/EventDetail.mock";
import { FaqAccordion } from "./FaqAccordion";
import { TierCard } from "./TierCard";

// ── Main Component ───────────────────────────────────────────────────────────
export default function EventDetailPage({ eventId }: { eventId?: string }) {
    const event = MOCK_EVENT; // In production: fetch event by eventId
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [mapOpen, setMapOpen] = useState(false);
    const [mapZoom, setMapZoom] = useState(14);

    const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);
    const totalPrice = event.ticketTiers.reduce(
        (acc, tier) => acc + (quantities[tier.id] || 0) * tier.price,
        0
    );

    const formattedTotal = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
    }).format(totalPrice);

    const handleQuantityChange = (tierId: string, qty: number) => {
        setQuantities((prev) => {
            const next = { ...prev };
            if (qty <= 0) delete next[tierId];
            else next[tierId] = qty;
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">

            {/* ── Map Modal ── */}
            {mapOpen && (
                <div
                    className="fixed inset-0 z-[100] flex flex-col bg-black/70 backdrop-blur-sm"
                    onClick={() => setMapOpen(false)}
                >
                    <div
                        className="relative flex flex-col w-full h-full max-w-5xl mx-auto my-8 sm:my-12 bg-white rounded overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <LuMapPin className="w-5 h-5 text-yellow-500" />
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{event.location}</p>
                                    <p className="text-xs text-gray-500">{event.city}</p>
                                </div>
                            </div>
                            {/* Zoom Controls + Close */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                    <button
                                        onClick={() => setMapZoom(z => Math.max(1, z - 2))}
                                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold text-lg transition-colors"
                                        aria-label="Dézoomer"
                                        title="Dézoomer"
                                    >
                                        −
                                    </button>
                                    <span className="px-2 text-xs font-semibold text-gray-500 select-none">{mapZoom}</span>
                                    <button
                                        onClick={() => setMapZoom(z => Math.min(21, z + 2))}
                                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold text-lg transition-colors"
                                        aria-label="Zoomer"
                                        title="Zoomer"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => { setMapOpen(false); setMapZoom(14); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                    aria-label="Fermer la carte"
                                >
                                    <LuX className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {/* Map Iframe */}
                        <div className="flex-1">
                            <iframe
                                key={mapZoom}
                                title="Carte de l'événement"
                                width="100%"
                                height="100%"
                                loading="lazy"
                                style={{ border: 0, display: 'block' }}
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps?q=${encodeURIComponent(event.location + ', ' + event.city)}&output=embed&z=${mapZoom}`}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Back Button */}
                <Link
                    href="/home"
                    className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium hover:bg-black/50 transition"
                >
                    <LuArrowLeft className="w-4 h-4" />
                    Retour
                </Link>

                {/* Category Badge */}
                <div className="absolute top-6 right-6 bg-yellow-500 text-gray-50 px-4 py-1.5 rounded-full text-sm font-bold">
                    {event.category}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1.5"><LuCalendar className="w-4 h-4" />{event.date}</span>
                        <span className="flex items-center gap-1.5"><LuClock className="w-4 h-4" />{event.time}</span>
                        <span className="flex items-center gap-1.5"><LuMapPin className="w-4 h-4" />{event.city}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT: Event Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Organizer */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Organisateur</h3>
                            <div className="flex items-center gap-3">
                                <img src={event.organizerAvatar} alt={event.organizer} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                                <div>
                                    <p className="font-bold text-gray-900">{event.organizer}</p>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm mt-0.5">
                                        <LuStar className="w-3.5 h-3.5 fill-current" />
                                        <span className="font-semibold text-gray-700">{event.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Détails</h3>
                            <div className="flex items-start gap-3">
                                <LuMapPin className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">{event.location}</p>
                                    <p className="text-sm text-gray-500">{event.city}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <LuCalendar className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">{event.date}</p>
                                    <p className="text-sm text-gray-500">{event.time}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <LuUsers className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900">{event.attendees.toLocaleString("fr-FR")} participants</p>
                                    <p className="text-sm text-gray-500">confirment leur présence</p>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">À propos</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{event.description}</p>
                        </div>
                    </div>

                    {/* RIGHT: Ticket Tiers */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <LuTicket className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-2xl font-extrabold text-gray-900">Choisissez vos billets</h2>
                        </div>
                        <div className="space-y-4">
                            {event.ticketTiers.map((tier) => (
                                <TierCard
                                    key={tier.id}
                                    tier={tier}
                                    quantity={quantities[tier.id] || 0}
                                    onQuantityChange={(qty) => handleQuantityChange(tier.id, qty)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map + FAQ Section */}
            <div className="max-w-[1440px]  mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Map */}
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Lieu sur carte</h2>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm w-full h-64 sm:h-72 relative group">
                            <iframe
                                title="Lieu de l'événement"
                                width="100%"
                                height="100%"
                                loading="lazy"
                                style={{ border: 0 }}
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps?q=${encodeURIComponent(MOCK_EVENT.location + ', ' + MOCK_EVENT.city)}&output=embed`}
                            />
                            {/* Overlay click to open modal */}
                            <button
                                onClick={() => setMapOpen(true)}
                                className="absolute inset-0 w-full h-full bg-transparent cursor-pointer"
                                aria-label="Agrandir la carte"
                            />
                            <button
                                onClick={() => setMapOpen(true)}
                                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-gray-200 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <LuMaximize2 className="w-3.5 h-3.5" />
                                Agrandir
                            </button>
                        </div>
                        <button
                            onClick={() => setMapOpen(true)}
                            className="inline-flex items-center gap-1.5 mt-3 text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                        >
                            <LuMapPin className="w-4 h-4" />
                            Voir le lieu sur la carte
                        </button>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-4">Questions fréquentes</h2>
                        <FaqAccordion items={FAQ_ITEMS} />
                    </div>

                </div>
            </div>

            {totalTickets > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] p-4 sm:p-5 z-50">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Récapitulatif</p>
                            <p className="text-base font-bold text-gray-900">
                                {totalTickets} billet{totalTickets > 1 ? "s" : ""} sélectionné{totalTickets > 1 ? "s" : ""}
                            </p>
                            {/* Breakdown */}
                            <div className="flex flex-wrap gap-3 mt-1">
                                {event.ticketTiers
                                    .filter((t) => (quantities[t.id] || 0) > 0)
                                    .map((t) => (
                                        <span key={t.id} className="text-xs text-gray-500">
                                            {quantities[t.id]}× {t.name}
                                        </span>
                                    ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-extrabold text-yellow-600">{formattedTotal}</p>
                            </div>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3.5 px-8 rounded-full transition-all shadow-md shadow-yellow-500/20 text-base">
                                Procéder au paiement
                                <LuChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
