export interface CartItem {
    id: string;
    cartId: string;
    medicineId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    
    // Relations enrichment
    medicineName?: string;
    medicinePrice?: number;
    medicineCIP?: string;
}

export interface Cart {
    id: string;
    authId: string;
    pharmacyId: string;
    createdAt: Date;
    updatedAt: Date;
    
    // Relations
    items?: CartItem[];
    pharmacyName?: string;
}

// DTOs
export interface AddToCartDTO {
    authId: string;
    pharmacyId: string;
    medicineId: string;
    quantity: number;
}

export interface UpdateCartItemDTO {
    quantity: number;
}
