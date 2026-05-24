import { z } from 'zod';

export const listAddressesSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    neighborhoodId: z.string().uuid('ID de quartier invalide').optional()
});
