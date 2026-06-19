"use client";

import React from "react";
import { LuCheck } from "react-icons/lu";
import { TicketTier } from "./types/EventDetail.types";

export function TierCard({
    tier,
    quantity,
    onQuantityChange,
}: {
    tier: TicketTier;
    quantity: number;
    onQuantityChange: (qty: number) => void;
}) {
    const isSoldOut = tier.status === "sold_out" || tier.availableQuantity <= 0;

    const formattedPrice = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: tier.currency,
        maximumFractionDigits: 0,
    }).format(tier.price);

    return (
        <div
            className={`relative rounded border-2 p-6 transition-all duration-200 ${
                quantity > 0
                    ? "border-yellow-500 bg-yellow-50/30 shadow-lg shadow-yellow-500/10"
                    : tier.highlight
                    ? "border-gray-900 bg-white shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            } ${isSoldOut ? "opacity-60" : ""}`}
        >
            {/* Badge */}
            {tier.badge && (
                <div
                    className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold ${
                        tier.highlight
                            ? "bg-gray-900 text-white"
                            : "bg-yellow-500 text-gray-900"
                    }`}
                >
                    {tier.badge}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                    <p className="text-2xl font-extrabold text-gray-900">{formattedPrice}</p>
                    <p className="text-xs text-gray-400">par billet</p>
                </div>
            </div>

            {/* Perks */}
            <ul className="space-y-2 mb-6">
                {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <LuCheck className="w-4 h-4 text-green-500 shrink-0" />
                        {perk}
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                    {isSoldOut ? (
                        <span className="text-red-500 font-semibold">Épuisé</span>
                    ) : (
                        <span>{tier.availableQuantity} places restantes</span>
                    )}
                </div>

                {isSoldOut ? (
                    <button disabled className="px-5 py-2 rounded-xl bg-gray-200 text-gray-400 text-sm font-semibold cursor-not-allowed">
                        Indisponible
                    </button>
                ) : (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <button
                            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                            disabled={quantity <= 0}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 font-bold hover:text-yellow-600 hover:border-yellow-400 disabled:opacity-40 transition-colors"
                        >
                            -
                        </button>
                        <span className="w-5 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                        <button
                            onClick={() => onQuantityChange(Math.min(tier.maxPerOrder, tier.availableQuantity, quantity + 1))}
                            disabled={quantity >= tier.maxPerOrder || quantity >= tier.availableQuantity}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 font-bold hover:text-yellow-600 hover:border-yellow-400 disabled:opacity-40 transition-colors"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
