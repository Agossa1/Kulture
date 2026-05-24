import { z } from 'zod';

export const createAddressSchema = z.object({
    neighborhoodId: z.string().uuid('ID de quartier invalide'),
    street: z.string().min(2, 'Le nom de la rue est requis'),
    postalCode: z.string().min(2, 'Le code postal est requis'),
    latitude: z.number().min(-90).max(90, 'Latitude invalide'),
    longitude: z.number().min(-180).max(180, 'Longitude invalide')
});
