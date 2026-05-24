import z from 'zod';

// Schema d'un pays (réponse DB / typage)
export const citySchema = z.object({
    region_id:z.string(),
    name:        z.string(),
    area_sqkm:   z.number().positive(),
    center_lat:  z.number().min(-90).max(90),
    center_long: z.number().min(-180).max(180),
    geometry:    z.string(),
});

// Schema des query params (filtres optionnels)
export const queryCitySchema = z.object({
    name:      z.string().optional(),
    tolerance: z.coerce.number().min(0).max(1).optional(),
});

export type Country = z.infer<typeof citySchema>;
export type QueryCountriesParams = z.infer<typeof queryCitySchema>;