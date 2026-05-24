import { z } from 'zod';

export const updatePositionSchema = z.object({
    deliveryPersonId: z.string().uuid('ID de livreur invalide'),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
});
