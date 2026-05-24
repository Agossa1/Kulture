import { z } from 'zod';
import { Role } from '../types/auth.types';

export const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long'),
    password: z.string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères")
        .regex(/[A-Z]/, "Il faut au moins une majuscule")
        .regex(/[0-9]/, "Il faut au moins un chiffre"),
    role: z.nativeEnum(Role).default(Role.USER)
})


export type RegisterDTO = z.infer<typeof registerSchema>;