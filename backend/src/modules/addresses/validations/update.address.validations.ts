import { z } from 'zod';

export const updateAddressSchema = z.object({
    neighborhoodId: z.string().uuid('ID de quartier invalide').optional(),
    street: z.string().min(2, 'Le nom de la rue doit avoir au moins 2 caractères').optional(),
    postalCode: z.string().min(2, 'Le code postal doit avoir au moins 2 caractères').optional(),
    latitude: z.number().min(-90).max(90, 'Latitude invalide').optional(),
    longitude: z.number().min(-180).max(180, 'Longitude invalide').optional()
}).refine(data => {
    // Si latitude est fournie, longitude doit l'être aussi, et vice versa.
    if (data.latitude !== undefined && data.longitude === undefined) return false;
    if (data.longitude !== undefined && data.latitude === undefined) return false;
    return true;
}, {
    message: 'Latitude et longitude doivent être fournies ensemble',
    path: ['latitude', 'longitude']
});
