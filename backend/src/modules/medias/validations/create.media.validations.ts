import { z } from 'zod';

export const createStockSchema = z.object({
    pharmacyId: z.string().uuid('ID de la pharmacie invalide'),
    medicineId: z.string().uuid('ID du médicament invalide'),
    batchNumber: z.string().min(1, 'Le numéro de lot est requis'),
    quantity: z.number().int().min(0, 'La quantité ne peut pas être négative'),
    price: z.number().positive('Le prix doit être positif'),
    expirationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Date d\'expiration invalide'
    })
});
