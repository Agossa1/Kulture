import { z } from 'zod';
import { AlertType } from '../types/stock.types';

export const updateStockSchema = z.object({
    quantity: z.number().int().min(0, 'La quantité ne peut pas être négative').optional(),
    price: z.number().positive('Le prix doit être positif').optional(),
    expirationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Date d\'expiration invalide'
    }).optional(),
    alertLevel: z.nativeEnum(AlertType, { message: 'Niveau d\'alerte invalide' }).optional(),
    movementReason: z.string().min(2, 'La raison du mouvement est requise pour la traçabilité').optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni pour la mise à jour'
});
