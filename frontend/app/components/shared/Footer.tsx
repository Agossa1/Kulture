import Link from "next/link";
import React from "react";
import { LuInstagram, LuTwitter, LuFacebook, LuYoutube } from "react-icons/lu";

const footerLinks = {
    plateforme: [
        { label: "Événements", href: "/marketplace/evenements" },
        { label: "Billetterie", href: "/marketplace/tickets" },
        { label: "Marketplace", href: "/marketplace/oeuvres" },
        { label: "Artistes", href: "/classement-artistes" },
    ],
    organisateurs: [
        { label: "Créer un événement", href: "/register" },
        { label: "Outils de gestion", href: "/products" },
        { label: "Meilleurs organisateurs", href: "/classement-organisateurs" },
        { label: "Soutien aux artistes", href: "/soutien" },
    ],
    aide: [
        { label: "FAQ", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Mentions légales", href: "#" },
        { label: "Politique de confidentialité", href: "#" },
    ]
};

export default function Footer() {
    return (
        <footer className="bg-white   text-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Top row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="text-5xl font-extrabold text-yellow-500 tracking-tight">
                            Kulture
                        </Link>
                        <p className="mt-4 text-[17px] leading-relaxed text-gray-900 max-w-xs">
                            La plateforme tout-en-un pour les passionnés d'art et de culture en Afrique. Achetez des billets, exposez vos œuvres et gérez vos événements.
                        </p>
                        {/* Réseaux sociaux */}
                        <div className="flex items-center gap-4 mt-6">
                            {[LuInstagram, LuTwitter, LuFacebook, LuYoutube].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-200 hover:bg-yellow-500 hover:text-white transition-all">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-[18px]  font-semibold text-gray-900 mb-4">Plateforme</h4>
                        <ul className="space-y-3">
                            {footerLinks.plateforme.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-[16px] text-gray-900 hover:text-yellow-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[18px]  font-semibold text-gray-900  mb-4">Organisateurs</h4>
                        <ul className="space-y-3">
                            {footerLinks.organisateurs.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-[16px] text-gray-900 hover:text-yellow-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[18px]  font-semibold text-gray-900   mb-4">Aide</h4>
                        <ul className="space-y-3">
                            {footerLinks.aide.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-[16px] text-gray-900 hover:text-yellow-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[15px]  text-gray-900">
                        © {new Date().getFullYear()} Kulture. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-1 text-[15px]  text-gray-900">
                        Fait avec <span className="text-yellow-500 mx-1">❤</span> pour la culture africaine
                    </div>
                </div>
            </div>
        </footer>
    );
}
