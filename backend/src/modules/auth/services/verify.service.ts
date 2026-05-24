import { AuthRepository } from "../repositories/auth.repositories";
import type { Logger } from 'winston';
import { AuthMailer } from '../../../utils/mailer/authMailer';
import { AppError, UnauthorizedError } from "../../../shared/errors/appErrors";

export class VerifyService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly logger: Logger,
        private readonly authMailer: AuthMailer
    ) {}

    /**
     * Vérifie le compte d'un utilisateur via un code OTP.
     * Envoie le mail de bienvenue après une vérification réussie.
     */
    public async verifyAccount(userId: string, code: string): Promise<void> {
        try {
            // 1. Appel au repository pour valider le code et mettre à jour le statut
            // Changement de nom pour forcer l'IDE à re-détecter le type de retour (email, firstName)
            const result = await this.authRepository.verifyUserAccount(userId, code);

            if (!result) {
                this.logger.warn(`Verification failed for authId: ${userId}`);
                throw new UnauthorizedError('Invalid or expired verification code');
            }

            // Ici result est garanti non-null et possède email + firstName
            const { email, firstName } = result;

            // 2. Envoi du mail de bienvenue via AuthMailer
            try {
                await this.authMailer.sendWelcomeEmail(email, firstName);
            } catch (mailError) {
                this.logger.error(`Failed to send welcome email to ${email}:`, mailError);
            }

            this.logger.info(`Account verified successfully for authId: ${userId}`);

        } catch (error) {
            if (error instanceof AppError) throw error;
            this.logger.error('Unexpected error during account verification:', error);
            throw new AppError('An unexpected error occurred during verification', 500);
        }
    }
}
