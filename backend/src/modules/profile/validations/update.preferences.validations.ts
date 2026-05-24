import { z } from 'zod';

export const updatePreferencesSchema = z.object({
    photoUrl: z.string().url('URL de photo invalide').optional(),
    language: z.enum(['fr', 'en', 'ar'], { message: 'Langue invalide (fr, en, ar)' }).optional(),
    fcmToken: z.string().optional(),
    theme: z.enum(['light', 'dark'], { message: 'Thème invalide' }).optional(),
    notificationsEnabled: z.boolean().optional()
}).refine(data => Object.values(data).some(v => v !== undefined), {
    message: 'Au moins une préférence doit être fournie'
});
