import { z } from 'zod';

export const addToCartSchema = z.object({
    authId: z.string().uuid('ID utilisateur invalide'),
    pharmacyId: z.string().uuid('ID pharmacie invalide'),
    medicineId: z.string().uuid('ID médicament invalide'),
    quantity: z.number().int().positive('La quantité doit être supérieure à 0')
});
