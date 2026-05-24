import { z } from 'zod';
import { OrderStatus, DeliveryMode } from '../types/order.types';

export const queryOrderSchema = z.object({
    authId: z.string().uuid().optional(),
    pharmacyId: z.string().uuid().optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    deliveryMode: z.nativeEnum(DeliveryMode).optional(),
    page: z.string().transform(val => parseInt(val, 10)).default(1),
    limit: z.string().transform(val => parseInt(val, 10)).default(20)
});
