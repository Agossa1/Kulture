import { z } from 'zod';
import { DeliveryMode } from '../types/order.types';

export const createOrderSchema = z.object({
    authId: z.string().uuid('ID du patient invalide'),
    pharmacyId: z.string().uuid('ID de la pharmacie invalide'),
    prescriptionId: z.string().uuid().optional(),
    deliveryAddressId: z.string().uuid().optional(),
    deliveryMode: z.nativeEnum(DeliveryMode, { message: 'Mode de livraison invalide' }),
    items: z.array(z.object({
        medicineId: z.string().uuid('ID du médicament invalide'),
        quantity: z.number().int().min(1, 'La quantité doit être au moins 1'),
        price: z.number().positive('Le prix doit être positif')
    })).min(1, 'La commande doit contenir au moins un médicament'),
    deliveryFee: z.number().min(0).default(0),
    serviceFee: z.number().min(0).default(0),
    discountAmount: z.number().min(0).default(0)
}).refine(data => {
    // Si le mode est livraison, l'adresse est obligatoire
    if (data.deliveryMode === DeliveryMode.DELIVERY && !data.deliveryAddressId) {
        return false;
    }
    return true;
}, {
    message: 'Une adresse de livraison est requise pour le mode "livraison"',
    path: ['deliveryAddressId']
});
