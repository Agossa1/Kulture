import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
    lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
    phone: z.string().min(8, 'Numéro de téléphone invalide').optional()
}).refine(data => Object.values(data).some(v => v !== undefined), {
    message: 'Au moins un champ doit être fourni'
});
