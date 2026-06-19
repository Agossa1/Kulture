export interface TicketTier {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
    perks: string[];
    availableQuantity: number;
    maxPerOrder: number;
    status: "available" | "sold_out";
    badge?: string;
    highlight?: boolean;
}

export interface EventDetails {
    id: string;
    title: string;
    category: string;
    date: string;
    time: string;
    location: string;
    city: string;
    image: string;
    description: string;
    organizer: string;
    organizerAvatar: string;
    rating: number;
    attendees: number;
    ticketTiers: TicketTier[];
}
