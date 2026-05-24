import { Request, Response, NextFunction } from 'express';
import { VerifyService } from '../services/verify.service';
import { verifyAccountSchema } from '../validations/verify.validations';
import { Logger } from 'winston';
import { successResponse } from '../../../shared/utils/apiResponse'; // Importation de la fonction utilitaire

/**
 * Contrôleur gérant la vérification des comptes utilisateurs via OTP.
 */
export class VerifyController {
    constructor(
        private readonly verifyService: VerifyService,
        private readonly logger: Logger
    ) {}

    /**
     * Valide le code OTP envoyé par l'utilisateur.
     */
    public verify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.logger.info(`Verification attempt for user: ${req.body.userId}`);

            // 1. Validation Zod (ID utilisateur et Code 6 chiffres)
            const validatedData = verifyAccountSchema.parse(req.body);

            // 2. Appel au service de vérification métier
            await this.verifyService.verifyAccount(
                validatedData.userId,
                validatedData.code
            );

            // 3. Réponse de succès standardisée
            this.logger.info(`Account successfully verified for userId: ${validatedData.userId}`);
            return res.status(200).json(
                successResponse('Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.')
            );

        } catch (error) {
            this.logger.error(`Error during account verification for userId: ${req.body.userId || 'unknown'}:`, error);
            // Transfert vers le middleware global de gestion d'erreurs
            next(error);
        }
    }
}