import { Request, Response, NextFunction } from "express";
import { RegisterService } from "../services/register.service";
import { registerSchema } from "../validations/register.validations";
import crypto from 'crypto';

export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    /**
     * Gère l'inscription d'un nouvel utilisateur.
     */
    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Validation des données d'entrée
            const validatedData = registerSchema.parse(req.body);

            // 2. Génération des IDs et préparation des objets pour les trois tables 
            const userId = crypto.randomUUID();

            const userDto = {
                id: userId,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                email: validatedData.email,
                phone: validatedData.phone,
                role: validatedData.role,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const credentials = {
                id: crypto.randomUUID(),
                userId: userId,
                passwordHash: validatedData.password, 
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const accountStatus = {
                id: crypto.randomUUID(),
                userId: userId,
                isActive: true,
                isVerified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            // 3. Appel du service métier
            const newUser = await this.registerService.registerUser(userDto, credentials, accountStatus);
            
            // 4. Réponse au client
            return res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès. Un code de vérification a été envoyé.',
                data: {
                    user: {
                        id: newUser.id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        phone: newUser.phone,
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }
}