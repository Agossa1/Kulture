import { z } from 'zod';

export const searchAvailabilitySchema = z.object({
    medicineId: z.string().uuid('ID du médicament invalide'),
    latitude: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val), 'Latitude invalide'),
    longitude: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val), 'Longitude invalide'),
    radiusKm: z.string().transform(val => parseFloat(val)).default(10), // Par défaut 10 km
    targetPharmacyId: z.string().uuid().optional(), // Si on vérifie pour une pharmacie spécifique d'abord
    limit: z.string().transform(val => parseInt(val, 10)).default(5) // Nombre de suggestions max
});

export const searchPharmaciesByCitySchema = z.object({
    cityId: z.string().uuid('ID de la ville invalide').optional(), // Optionnel si on cherche juste autour de soi
    cityName: z.string().optional(), // Alternative: recherche par nom
    isOnDuty: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    latitude: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val)).optional(),
    longitude: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val)).optional(),
    limit: z.string().transform(val => parseInt(val, 10)).default(50)
}).refine(data => data.cityId || data.cityName || (data.latitude && data.longitude), {
    message: "Vous devez fournir soit un ID de ville, soit le nom de la ville, soit des coordonnées GPS."
});

