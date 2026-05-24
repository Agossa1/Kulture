import { z } from 'zod';

export const updateCartItemSchema = z.object({
    quantity: z.number().int().positive('La quantité doit être supérieure à 0')
});
