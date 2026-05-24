import { mailer, Mailer } from './mailer';
import { otpTemplate } from './templates/otpTemplate';
import { welcomeTemplate } from './templates/welcomeTemplate';
import { logger } from '../../shared/loggers/logger';

/**
 * Service spécialisé pour les emails liés à l'authentification.
 * Utilise l'instance de Mailer de base.
 */
export class AuthMailer {
    constructor(private readonly mailerInstance: Mailer = mailer) {}

    /**
     * Envoie le code de vérification (OTP) à l'utilisateur.
     */
    public async sendVerificationCode(email: string, firstName: string, otpCode: string): Promise<void> {
        try {
            await this.mailerInstance.sendMail({
                to: email,
                subject: 'Doto - Code de vérification',
                html: otpTemplate(firstName, otpCode),
            });
            logger.info(`OTP sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Error sending OTP to ${email}:`, error);
            throw new Error('Failed to send verification code');
        }
    }

    /**
     * Envoie l'email de bienvenue après validation du compte.
     */
    public async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
        try {
            await this.mailerInstance.sendMail({
                to: email,
                subject: 'Bienvenue chez Doto !',
                html: welcomeTemplate(firstName),
            });
            logger.info(`Welcome email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Error sending welcome email to ${email}:`, error);
            // On ne bloque pas forcément le flux pour un mail de bienvenue
        }
    }
}

// Instance singleton
export const authMailer = new AuthMailer();
