export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELED = 'canceled'
}

export interface PaymentTransaction {
    id: string;
    orderId: string;
    authId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    provider: 'fedapay';
    providerTransactionId?: string;
    paymentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InitializePaymentDTO {
    orderId: string;
    callbackUrl: string;
}

export interface FedaPayWebhookBody {
    event: string;
    entity: {
        id: number;
        reference: string;
        amount: number;
        status: string;
        [key: string]: any;
    };
}
