export type TicketStatus = 'available' | 'sold_out' | 'suspended';

export interface TicketCardProps {
   id?: string;
   href?: string;
   name: string;
   description?: string;
   imageSrc?: string;
   price: string;
   currency?: string;
   status?: TicketStatus;
   availableQuantity: number;
   maxPerOrder?: number;
   quantity?: number;
   onQuantityChange?: (qty: number) => void;
   className?: string;
   // Event-level extras
   date?: string;
   location?: string;
   category?: string;
   organizer?: string;
   organizerAvatar?: string;
   likes?: number;
}