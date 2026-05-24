import { z } from 'zod';

export const assignDeliverySchema = z.object({
    deliveryId: z.string().uuid('ID de livraison invalide'),
    deliveryPersonId: z.string().uuid('ID de livreur invalide')
});
