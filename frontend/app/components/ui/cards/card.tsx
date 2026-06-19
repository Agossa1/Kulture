"use client";

import Link from "next/link";
import { useState } from "react";
import { LuHeart, LuMapPin, LuCalendar, LuTicket } from "react-icons/lu";
import { TicketCardProps } from "./card.types";

export const TicketCard: React.FC<TicketCardProps> = ({
    id,
    href,
    name,
    description,
    imageSrc,
    price,
    currency = "XOF",
    status = "available",
    availableQuantity,
    maxPerOrder = 10,
    quantity = 0,
    onQuantityChange,
    className = "",
    date,
    location,
    category,
    organizer,
    organizerAvatar,
    likes = 0,
}) => {
    const [liked, setLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(likes);

    const isSoldOut = status !== "available" || availableQuantity <= 0;

    const formattedPrice =
        Number(price) === 0
            ? "Gratuit"
            : new Intl.NumberFormat("fr-FR", {
                  maximumFractionDigits: 0,
              }).format(Number(price)) +
              " F " +
              (currency === "XOF" ? "CFA" : currency);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((v) => !v);
        setLocalLikes((n) => (liked ? n - 1 : n + 1));
    };

    const CardWrapper = ({ children }: { children: React.ReactNode }) =>
        href ? (
            <Link href={href} className="block group">
                {children}
            </Link>
        ) : (
            <div className="group">{children}</div>
        );

    return (
        <div
            className={`
                w-full bg-white rounded-2xl overflow-hidden flex flex-col
                border border-gray-100 shadow-sm
                transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5
                ${quantity > 0 ? "ring-2 ring-yellow-400 border-yellow-300" : ""}
                ${isSoldOut ? "opacity-70" : ""}
                ${className}
            `.trim()}
        >
            {/* ── Image block ── */}
            <CardWrapper>
                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <LuTicket className="w-12 h-12 text-gray-300" />
                        </div>
                    )}

                    {/* Dark gradient at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Top-left: Verified dot */}
                    <div className="absolute top-3 left-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Top-right: Like button */}
                    <button
                        onClick={handleLike}
                        className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-full transition-all hover:bg-black/60"
                    >
                        <LuHeart
                            className={`w-3.5 h-3.5 transition-colors ${liked ? "fill-red-500 text-red-500" : ""}`}
                        />
                        {localLikes > 0 && <span>{localLikes}</span>}
                    </button>

                    {/* Bottom-right: Category badge */}
                    {category && (
                        <div className="absolute bottom-3 right-3 bg-yellow-500 text-gray-50 text-[13px] font-extrabold  px-2.5 py-1 rounded-lg shadow">
                            {category}
                        </div>
                    )}

                    {/* Bottom-left: Sold out overlay */}
                    {isSoldOut && (
                        <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-lg">
                            Épuisé
                        </div>
                    )}
                </div>
            </CardWrapper>

            {/* ── Content block ── */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                {/* Title */}
                <CardWrapper>
                    <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-yellow-600 transition-colors">
                        {name.toUpperCase()}
                    </h3>
                </CardWrapper>

                {/* Date */}
                {date && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                        <LuCalendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {date}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-sm font-extrabold ${
                            Number(price) === 0 ? "text-green-600" : "text-gray-900"
                        }`}
                    >
                        {Number(price) === 0 ? "Gratuit" : `À partir de ${formattedPrice}`}
                    </span>
                </div>

                {/* Location */}
                {location && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>🇨🇮</span>
                        <LuMapPin className="w-3 h-3 shrink-0" />
                        {location}
                    </p>
                )}

                {/* CTA */}
                <div className="mt-auto pt-3">
                    {isSoldOut ? (
                        <button
                            disabled
                            className="w-full py-2.5 rounded-xl font-bold text-sm bg-gray-200 text-gray-400 cursor-not-allowed"
                        >
                            Indisponible
                        </button>
                    ) : href ? (
                        <Link
                            href={href}
                            className="block w-full py-2.5 rounded-xl font-bold text-sm text-center bg-yellow-500 hover:bg-yellow-400 text-gray-900 transition-all shadow-sm shadow-yellow-200 active:scale-95"
                        >
                            Acheter tickets
                        </Link>
                    ) : (
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                                <button
                                    onClick={() => onQuantityChange?.(Math.max(0, quantity - 1))}
                                    disabled={quantity <= 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:border-yellow-400 hover:text-yellow-600 disabled:opacity-40 transition-colors"
                                >
                                    −
                                </button>
                                <span className="w-5 text-center font-bold text-gray-900 text-sm">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => onQuantityChange?.(Math.min(maxPerOrder, availableQuantity, quantity + 1))}
                                    disabled={quantity >= maxPerOrder || quantity >= availableQuantity}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:border-yellow-400 hover:text-yellow-600 disabled:opacity-40 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-sm font-extrabold text-gray-900">{formattedPrice}</span>
                        </div>
                    )}
                </div>

                {/* Organizer footer */}
                {organizer && (
                    <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {organizerAvatar ? (
                                <img
                                    src={organizerAvatar}
                                    alt={organizer}
                                    className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] font-extrabold text-gray-900">
                                    {organizer.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-[9px] text-gray-400 leading-none">Publié par</p>
                                <p className="text-[11px] font-bold text-gray-700 leading-tight truncate max-w-[100px]">
                                    {organizer}
                                </p>
                            </div>
                        </div>
                        <button className="text-[10px] font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full transition-colors">
                            S'abonner
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};