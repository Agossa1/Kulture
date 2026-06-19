"use client";

import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            {items.map((item, i) => (
                <div key={i}>
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-medium text-gray-800 text-sm pr-4">{item.q}</span>
                        <LuChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                                openIndex === i ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                    {openIndex === i && (
                        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed bg-gray-50 border-t border-gray-100">
                            {item.a}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
