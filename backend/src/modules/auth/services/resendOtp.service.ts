import { AuthRepository } from "../repositories/auth.repositories";
import type { Logger } from 'winston';
import { AuthMailer } from '../../../utils/mailer/authMailer';
import { AppError, NotFoundError, BadRequestError } from "../../../shared/errors/appErrors";

export class ResendOtpService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly logger: Logger,
        private readonly authMailer: AuthMailer
    ) {}

    /**
     * Renvoie un nouveau code de vérification à l'utilisateur.
     */
    public async resendOtp(identifier: string): Promise<void> {
        try {
            // 1. Rechercher l'utilisateur
            const user = await this.authRepository.getUserWithCredentialsByIdentifier(identifier);
            if (!user) {
                this.logger.warn(`Resend OTP attempt for non-existent user: ${identifier}`);
                // On ne révèle pas si l'utilisateur existe pour des raisons de sécurité
                return;
            }

            // 2. Vérifier si le compte est déjà vérifié
            if (user.accountStatus.isVerified) {
                this.logger.info(`Resend OTP ignored: account already verified for ${user.id}`);
                return;
            }

            // 3. Générer un nouveau code OTP (6 chiffres)
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

            // 4. Sauvegarder et envoyer
            await this.authRepository.createOtp(user.id, otpCode, expiresAt);
            
            try {
                await this.authMailer.sendVerificationCode(user.email, user.firstName, otpCode);
                this.logger.info(`New OTP sent to ${user.email}`);
            } catch (mailError) {
                this.logger.error(`Failed to send resend-OTP email to ${user.email}:`, mailError);
                throw new AppError('Erreur lors de l\'envoi de l\'email de vérification', 500);
            }

        } catch (error) {
            if (error instanceof AppError) throw error;
            this.logger.error('Unexpected error during OTP resend:', error);
            throw new AppError('Une erreur est survenue lors de l\'envoi du code', 500);
        }
    }
}
