import { z } from 'zod';
import { OrderStatus } from '../types/order.types';

export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus, { message: 'Statut de commande invalide' }),
    notes: z.string().optional(),
    changedByAuthId: z.string().uuid().optional()
});
