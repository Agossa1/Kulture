import { AuthRepository } from "../repositories/auth.repositories";
import { users_status, AuthUser, Credentials, User } from "../types/auth.types";
import type { Logger } from 'winston';
import { AuthMailer } from '../../../utils/mailer/authMailer';
import { ConflictError, AppError } from "../../../shared/errors/appErrors";
import { PasswordService } from "../../../config/passwords/passwordServices";

export class RegisterService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly logger: Logger,
        private readonly authMailer: AuthMailer,
        private readonly hash: PasswordService
    ) {}

    /**
     * Enregistre un nouvel utilisateur dans le système.
     * Effectue les vérifications d'unicité, le hachage du mot de passe et l'envoi du code de vérification.
     */
    public async registerUser(dto: User, credentials: Credentials, accountStatus: users_status): Promise<AuthUser> {
        try {
            // 0. Normalisation des données
            const normalizedEmail = dto.email.toLowerCase().trim();
            const normalizedPhone = dto.phone.replace(/\s+/g, '').trim(); // Supprime les espaces

            // 1. Vérification de l'unicité
            const [existingEmail, existingPhone] = await Promise.all([
                this.authRepository.getUserByEmail(normalizedEmail),
                this.authRepository.getUserByPhone(normalizedPhone)
            ]);

            if (existingEmail) throw new ConflictError('Email already in use');
            if (existingPhone) throw new ConflictError('Phone number already in use');

            // 2. Hachage du mot de passe
            const hashedPassword = await this.hash.hashPassword(credentials.passwordHash);

            // 3. Préparation des objets avec données normalisées
            const finalDto = { 
                ...dto, 
                email: normalizedEmail, 
                phone: normalizedPhone 
            };
            
            const linkedCredentials = { 
                ...credentials, 
                authId: dto.id, 
                passwordHash: hashedPassword 
            };
            
            const linkedStatus = { 
                ...accountStatus, 
                authId: dto.id 
            };

            // 4. Création en base de données
            const newUser = await this.authRepository.createUser(finalDto, linkedCredentials, linkedStatus);

            // 5. Génération et envoi de l'OTP
            try {
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
                const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 
                
                await this.authRepository.createOtp(newUser.id, otpCode, expiresAt);
                await this.authMailer.sendVerificationCode(newUser.email, newUser.firstName, otpCode);
                
            } catch (mailError) {
                this.logger.error(`Failed to send verification code to ${newUser.email}:`, mailError);
            }

            return newUser;

        } catch (error) {
            if (error instanceof AppError) throw error;
            this.logger.error('Unexpected error during user registration:', error);
            throw new AppError('An unexpected error occurred during registration', 500);
        }
    }
}