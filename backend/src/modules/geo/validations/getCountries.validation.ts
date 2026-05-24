import z from 'zod';

// Schema d'un pays (réponse DB / typage)
export const countrySchema = z.object({
    name:        z.string(),
    code:        z.string().length(2),
    area_sqkm:   z.number().positive(),
    center_lat:  z.number().min(-90).max(90),
    center_long: z.number().min(-180).max(180),
    geometry:    z.string(),
});

// Schema des query params (filtres optionnels)
export const queryCountriesSchema = z.object({
    name:      z.string().optional(),
    code:      z.string().length(2).optional(),
    tolerance: z.coerce.number().min(0).max(1).optional(),
});

export type Country = z.infer<typeof countrySchema>;
export type QueryCountriesParams = z.infer<typeof queryCountriesSchema>;