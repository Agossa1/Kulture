import { z } from 'zod';

export const addAddressSchema = z.object({
    addressId: z.string().uuid('ID d\'adresse invalide'),
    label: z.string().max(50).optional(),
    isDefault: z.boolean().optional()
});
