import { z } from 'zod';
import { DeliveryStatus } from '../types/delivery.types';

export const updateDeliveryStatusSchema = z.object({
    status: z.nativeEnum(DeliveryStatus, { message: 'Statut de livraison invalide' }),
    estimatedDeliveryTime: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined)
});
