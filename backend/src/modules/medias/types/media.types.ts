export enum AlertType {
    NORMAL = 'normal',
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    EXPIRING_SOON = 'expiring_soon',
    EXPIRED = 'expired'
}

export enum StockMovementType {
    IN = 'in',
    OUT = 'out',
    ADJUSTMENT = 'adjustment',
    EXPIRED = 'expired'
}

export interface Stock {
    id: string;
    pharmacyId: string;
    medicineId: string;
    batchNumber: string;
    quantity: number;
    price: number;
    expirationDate: Date;
    alertLevel: AlertType;
    createdAt: Date;
    updatedAt: Date;

    // Optionnel : relations
    medicineName?: string; // Jointure utile pour l'affichage
    pharmacyName?: string;
}

export interface StockAlert {
    id: string;
    stockId: string;
    alertType: AlertType;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface StockMovement {
    id: string;
    stockId: string;
    movementType: StockMovementType;
    quantityChange: number;
    reason?: string;
    createdAt: Date;
}

// DTOs
export interface CreateStockDTO {
    pharmacyId: string;
    medicineId: string;
    batchNumber: string;
    quantity: number;
    price: number;
    expirationDate: string | Date;
    // alertLevel est par défaut 'normal'
}

export interface UpdateStockDTO {
    quantity?: number;
    price?: number;
    expirationDate?: string | Date;
    alertLevel?: AlertType;
    movementReason?: string; // Raison de la modification (pour log dans stock_movement)
}
