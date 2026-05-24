export enum DeliveryStatus {
    PENDING = 'pending',
    ASSIGNED = 'assigned',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    FAILED = 'failed'
}

export interface Delivery {
    id: string;
    orderId: string;
    deliveryPersonId?: string;
    status: DeliveryStatus;
    estimatedDeliveryTime?: Date;
    actualDeliveryTime?: Date;
    createdAt: Date;
    updatedAt: Date;

    // Relations enrichment
    orderNumber?: string;
    deliveryPersonName?: string;
}

export interface DeliveryPerson {
    id: string;
    authId: string;
    pharmacyId?: string;
    currentLocation?: {
        lat: number;
        lng: number;
    };
    vehicleInfo?: any;
    createdAt: Date;
    updatedAt: Date;
}

// DTOs
export interface AssignDeliveryDTO {
    deliveryId: string;
    deliveryPersonId: string;
}

export interface UpdateDeliveryStatusDTO {
    status: DeliveryStatus;
    estimatedDeliveryTime?: Date;
}

export interface UpdatePositionDTO {
    deliveryPersonId: string;
    lat: number;
    lng: number;
}
