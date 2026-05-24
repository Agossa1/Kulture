import { AuthRepository } from "../repositories/auth.repositories";
import { AuthUser, LoginResponse } from "../types/auth.types";
import type { Logger } from 'winston';
import { PasswordService } from "../../../config/passwords/passwordServices";
import { TokenManager } from "../../../config/tokens/tokenManager"; 
import { UnauthorizedError, AppError, ForbiddenError } from "../../../shared/errors/appErrors";

export class LoginService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly logger: Logger,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenManager 
    ) {}

    /**
     * Authentifie un utilisateur via email ou téléphone et génère des tokens JWT.
     */
    public async login(identifier: string, password: string): Promise<LoginResponse> {
        try {
            // 0. Normalisation stricte de l'identifiant
            const cleanIdentifier = identifier.trim().toLowerCase().replace(/\s+/g, '');

            // 1. Récupération de l'utilisateur avec ses credentials via le repository
            const user = await this.authRepository.getUserWithCredentialsByIdentifier(cleanIdentifier);

            if (!user) {
                this.logger.warn(`Login failed: user not found for ${cleanIdentifier}`);
                throw new UnauthorizedError('Identifiants invalides');
            }

            // 2. Vérification du statut (Vérifié ?)
            if (!user.accountStatus.isVerified) {
                this.logger.warn(`Login failed: account not verified for ${cleanIdentifier}`);
                throw new ForbiddenError('Veuillez vérifier votre compte avant de vous connecter');
            }

            // 3. Vérification du mot de passe
            const isPasswordValid = await this.passwordService.comparePassword(
                password, 
                user.credentials.passwordHash
            );

            if (!isPasswordValid) {
                this.logger.warn(`Login failed: wrong password for ${cleanIdentifier}`);
                throw new UnauthorizedError('Identifiants invalides');
            }

            // 4. Génération des tokens JWT
            const payload = { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            };
            const accessToken = this.tokenService.generateAccessToken(payload);
            const refreshToken = this.tokenService.generateRefreshToken({ id: user.id });

            // 5. Persistance de la session et mise à jour last_login
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await Promise.all([
                this.authRepository.createSession({
                    userId: user.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiresAt: expiresAt,
                    revoked: false,
                    ipAddress: null,
                    userAgent: null
                } as any),
                this.authRepository.updateLastLogin(user.id)
            ]);


            // 6. Préparation d'un objet utilisateur "sûr" (sans hash)
            const { credentials, ...safeUser } = user;

            this.logger.info(`Successful login for user: ${user.id}`);

            return {
                user: safeUser,
                accessToken,
                refreshToken
            };

        } catch (error) {
            if (error instanceof AppError) throw error;
            this.logger.error('Error in LoginService:', error);
            throw new AppError('Une erreur est survenue lors de la connexion', 500);
        }
    }
}
