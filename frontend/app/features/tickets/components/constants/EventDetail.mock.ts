import { EventDetails } from "../types/EventDetail.types";

export const MOCK_EVENT: EventDetails = {
    id: "event-001",
    title: "Festival des Arts & Cultures d'Afrique 2024",
    category: "Festival",
    date: "Samedi 15 Février 2025",
    time: "18h00 – 02h00",
    location: "Palais des Sports de Dakar",
    city: "Dakar, Sénégal",
    image: "https://images.unsplash.com/photo-1540039155732-61122a27b4bb?auto=format&fit=crop&q=80&w=1600",
    description: "Une soirée inoubliable célébrant la richesse des arts et cultures africaines. Concerts live, expositions, gastronomie et bien plus encore. Des artistes de renommée internationale vous feront vibrer toute la nuit dans un cadre exceptionnel.",
    organizer: "Kulture Events",
    organizerAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100",
    rating: 4.8,
    attendees: 2340,
    ticketTiers: [
        {
            id: "tier-standard",
            name: "Standard",
            price: 5000,
            currency: "XOF",
            description: "Accès standard à l'événement avec placement libre.",
            perks: [
                "Accès à toutes les scènes",
                "Placement libre",
                "Programme de la soirée",
            ],
            availableQuantity: 200,
            maxPerOrder: 10,
            status: "available",
            badge: "Le plus populaire",
        },
        {
            id: "tier-vip",
            name: "VIP",
            price: 25000,
            currency: "XOF",
            description: "Expérience premium avec accès prioritaire et avantages exclusifs.",
            perks: [
                "Entrée coupe-file",
                "Espace lounge réservé",
                "Cocktail de bienvenue",
                "Kit souvenir",
                "Rencontre avec les artistes",
            ],
            availableQuantity: 50,
            maxPerOrder: 4,
            status: "available",
            badge: "Recommandé",
            highlight: true,
        },
        {
            id: "tier-premium",
            name: "Premium",
            price: 75000,
            currency: "XOF",
            description: "L'expérience ultime avec accès backstage et services personnalisés.",
            perks: [
                "Tout ce qui est inclus dans VIP",
                "Accès backstage",
                "Table réservée au premier rang",
                "Dîner gastronomique inclus",
                "Chauffeur privé aller-retour",
                "Photo avec les artistes",
            ],
            availableQuantity: 10,
            maxPerOrder: 2,
            status: "available",
        },
        {
            id: "tier-early-bird",
            name: "Early Bird",
            price: 3500,
            currency: "XOF",
            description: "Tarif promotionnel limité aux 50 premiers acheteurs.",
            perks: [
                "Même accès que Standard",
                "Prix réduit de 30%",
            ],
            availableQuantity: 0,
            maxPerOrder: 2,
            status: "sold_out",
        },
    ],
};

export const FAQ_ITEMS = [
    {
        q: "Quels sont les moyens de paiement disponibles ?",
        a: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), Mobile Money (Orange Money, MTN Money, Wave) et par virement bancaire pour les commandes de groupe.",
    },
    {
        q: "Comment puis-je accéder à mes tickets après l'achat ?",
        a: "Après votre paiement, un e-mail de confirmation vous sera envoyé. Pour des raisons de sécurité, vos tickets ne sont pas envoyés par e-mail ni accessibles sur le site web. Ils sont exclusivement consultables dans l'application mobile TIKERAMA disponible gratuitement sur le Play Store (Android) et l'App Store (iOS). Connectez-vous avec l'adresse e-mail utilisée lors de l'achat pour les retrouver.",
    },
    {
        q: "Comment valider mon ticket le jour J ?",
        a: "Présentez simplement votre QR code depuis l'application mobile à l'entrée de l'événement. Nos agents se chargeront de le scanner pour valider votre accès.",
    },
    {
        q: "Puis-je acheter des tickets pour d'autres personnes ?",
        a: "Oui, vous pouvez acheter plusieurs tickets en une seule commande. Chaque ticket est nominatif et comportera le nom renseigné lors de l'achat.",
    },
    {
        q: "Que faire si je n'ai pas reçu mon ticket ?",
        a: "Vérifiez vos spams en premier lieu. Si vous ne trouvez pas l'e-mail de confirmation, connectez-vous directement sur l'application mobile avec l'adresse e-mail utilisée lors de l'achat.",
    },
    {
        q: "Les tickets sont-ils remboursables ?",
        a: "Les tickets sont remboursables uniquement en cas d'annulation de l'événement par l'organisateur. Hors ce cas, les ventes sont définitives.",
    },
];
