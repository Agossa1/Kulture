"use client";
import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const faqs = [
    {
        q: "Comment fonctionne la billetterie sur Kulture ?",
        a: "C'est très simple : parcourez les événements disponibles, sélectionnez vos places et payez en ligne en quelques clics. Vos billets sont envoyés directement sur votre email et disponibles dans votre espace personnel."
    },
    {
        q: "Comment vendre mes œuvres ou mes billets en tant qu'artiste ?",
        a: "Créez votre compte artiste gratuitement, puis accédez à votre tableau de bord pour publier vos événements ou mettre en vente vos œuvres. Notre équipe vérifie les publications pour garantir la qualité de la plateforme."
    },
    {
        q: "Quels moyens de paiement sont acceptés ?",
        a: "Kulture accepte les principales cartes bancaires (Visa, Mastercard), ainsi que les solutions de paiement mobile populaires en Afrique comme Orange Money, Wave et MTN Mobile Money."
    },
    {
        q: "Puis-je me faire rembourser mon billet ?",
        a: "Les conditions de remboursement dépendent de chaque organisateur. En cas d'annulation de l'événement par l'organisateur, un remboursement complet est automatiquement effectué dans un délai de 5 à 10 jours ouvrables."
    },
    {
        q: "Y a-t-il des frais sur les transactions ?",
        a: "Kulture applique une petite commission sur chaque vente pour couvrir les frais de la plateforme. Ces frais sont clairement affichés avant la validation de toute transaction — pas de mauvaise surprise !"
    },
    {
        q: "Comment devenir organisateur d'événements ?",
        a: "Inscrivez-vous, sélectionnez le profil 'Organisateur' et soumettez votre demande de vérification. Une fois validé, vous aurez accès à tous les outils de création et de gestion d'événements."
    },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 last:border-none">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-4 sm:py-5 text-left gap-4 group"
            >
                <span className={`text-sm sm:text-base font-medium transition-colors ${open ? "text-yellow-600" : "text-gray-800 group-hover:text-yellow-600"}`}>
                    {q}
                </span>
                <LuChevronDown className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-all duration-200 ${open ? "rotate-180 text-yellow-500" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-60 pb-4" : "max-h-0"}`}>
                <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
            </div>
        </div>
    );
}

export default function FaqSection() {
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Questions fréquentes</h2>
                    <p className="text-gray-600">Vous avez une question ? Nous avons probablement la réponse ici.</p>
                </div>
                <div className="divide-y divide-gray-200 rounded-2xl border border-gray-100 shadow-sm bg-white px-6 sm:px-8">
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}
