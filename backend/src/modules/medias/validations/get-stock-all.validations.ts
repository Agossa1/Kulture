import { z } from 'zod';
import { AlertType } from '../types/stock.types';

export const queryStockSchema = z.object({
    pharmacyId: z.string().uuid('ID de la pharmacie invalide').optional(),
    medicineId: z.string().uuid('ID du médicament invalide').optional(),
    alertLevel: z.nativeEnum(AlertType).optional(),
    search: z.string().optional(),
    page: z.string().transform(val => parseInt(val, 10)).default(1),
    limit: z.string().transform(val => parseInt(val, 10)).default(20)
});
