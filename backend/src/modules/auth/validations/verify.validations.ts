import { z } from "zod";

export const verifyAccountSchema = z.object({
    // On s'assure que c'est un UUID valide pour éviter les injections
    userId: z.string().uuid("ID utilisateur invalide"),
    
    // On s'assure que le code est exactement de 6 chiffres
    code: z.string()
        .length(6, "Le code doit faire exactement 6 caractères")
        .regex(/^\d+$/, "Le code ne doit contenir que des chiffres")
});

export type VerifyAccountDTO = z.infer<typeof verifyAccountSchema>;
