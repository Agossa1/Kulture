import { z } from 'zod';

export const createNotificationSchema = z.object({
    authId: z.string().uuid('ID utilisateur invalide'),
    title: z.string().min(1, 'Titre requis'),
    body: z.string().min(1, 'Message requis'),
    data: z.any().optional()
});
