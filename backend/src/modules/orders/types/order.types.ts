export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    READY = 'ready',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export enum DeliveryMode {
    PICKUP = 'pickup',
    DELIVERY = 'delivery'
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    MOBILE = 'mobile'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export interface OrderItem {
    id: string;
    orderId: string;
    medicineId: string;
    quantity: number;
    price: number;
    medicineName?: string;
}

export interface OrderStatusHistory {
    id: string;
    orderId: string;
    status: OrderStatus;
    changedByAuthId?: string;
    notes?: string;
    createdAt: Date;
}

export interface Order {
    id: string;
    authId: string;
    pharmacyId: string;
    prescriptionId?: string;
    deliveryAddressId?: string;
    invoiceNumber?: string;
    invoiceUrl?: string;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    discountAmount: number;
    totalAmount: number;
    status: OrderStatus;
    deliveryMode: DeliveryMode;
    createdAt: Date;
    updatedAt: Date;

    // Relations optionnelles
    items?: OrderItem[];
    statusHistory?: OrderStatusHistory[];
    patientName?: string;
    pharmacyName?: string;
}

// DTOs
export interface CreateOrderDTO {
    authId: string;
    pharmacyId: string;
    prescriptionId?: string;
    deliveryAddressId?: string;
    deliveryMode: DeliveryMode;
    items: {
        medicineId: string;
        quantity: number;
        price: number;
    }[];
    deliveryFee?: number;
    serviceFee?: number;
    discountAmount?: number;
}

export interface UpdateOrderStatusDTO {
    status: OrderStatus;
    notes?: string;
    changedByAuthId?: string;
}
