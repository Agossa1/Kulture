import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { AuthRepository } from './repositories/auth.repositories';
import { TokenManager } from '../../config/tokens/tokenManager';
import { passwordServiceInstance } from '../../config/passwords/passwordServices';
import { authMailer } from '../../utils/mailer/authMailer';

import { RegisterService } from './services/register.service';
import { LoginService } from './services/login.service';
import { VerifyService } from './services/verify.service';
import { LogoutService } from './services/logout.service';
import { RefreshTokenService } from './services/refreshtoken.service';
import { PreferencesService } from './services/preferences.service';
import { ResendOtpService } from './services/resendOtp.service';

import { RegisterController } from './controllers/register.controller';
import { LoginController } from './controllers/login.controller';
import { VerifyController } from './controllers/verify.controller';
import { LogoutController } from './controllers/logout.controller';
import { RefreshTokenController } from './controllers/refreshToken.controller';
import { PreferencesController } from './controllers/preferences.controller';
import { ResendOtpController } from './controllers/resendOtp.controller';

/**
 * Module d'Authentification.
 * Centralise l'instanciation et l'injection de dépendances pour tout le domaine auth.
 */
export class AuthModule {
    public readonly registerController: RegisterController;
    public readonly loginController: LoginController;
    public readonly verifyController: VerifyController;
    public readonly logoutController: LogoutController;
    public readonly refreshController: RefreshTokenController;
    public readonly preferencesController: PreferencesController;
    public readonly resendOtpController: ResendOtpController;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository & Utils
        const authRepository = new AuthRepository(db, logger);
        const tokenManager = new TokenManager();

        // 2. Services métiers
        const registerService = new RegisterService(authRepository, logger, authMailer, passwordServiceInstance);
        const loginService = new LoginService(authRepository, logger, passwordServiceInstance, tokenManager);
        const verifyService = new VerifyService(authRepository, logger, authMailer);
        const logoutService = new LogoutService(authRepository, logger);
        const refreshService = new RefreshTokenService(authRepository, logger, tokenManager);
        const preferencesService = new PreferencesService(authRepository, logger);
        const resendOtpService = new ResendOtpService(authRepository, logger, authMailer);

        // 3. Contrôleurs
        this.registerController = new RegisterController(registerService);
        this.loginController = new LoginController(loginService);
        this.verifyController = new VerifyController(verifyService, logger); // <-- Modification ici
        this.logoutController = new LogoutController(logoutService);
        this.refreshController = new RefreshTokenController(refreshService);
        this.preferencesController = new PreferencesController(preferencesService);
        this.resendOtpController = new ResendOtpController(resendOtpService);
    }
}