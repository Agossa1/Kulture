import { AuthRepository } from "../repositories/auth.repositories";
import { UserPreferences } from "../types/auth.types";
import type { Logger } from 'winston';
import { AppError } from "../../../shared/errors/appErrors";

export class PreferencesService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly logger: Logger
    ) {}

    /**
     * Récupère les préférences d'un utilisateur.
     */
    public async getPreferences(authId: string): Promise<UserPreferences> {
        try {
            let prefs = await this.authRepository.getUserPreferences(authId);
            if (!prefs) {
                // Création des préférences par défaut si elles n'existent pas
                prefs = await this.authRepository.updateUserPreferences(authId, {
                    language: 'fr',
                    theme: 'light',
                    notificationsEnabled: true
                });
            }
            return prefs;
        } catch (error) {
            if (error instanceof AppError) throw error;
            this.logger.error(`Error fetching preferences for user ${authId}:`, error);
            throw new AppError('Erreur lors de la récupération des préférences', 500);
        }
    }

    /**
     * Met à jour les préférences d'un utilisateur.
     */
    public async updatePreferences(authId: string, prefs: Partial<UserPreferences>): Promise<UserPreferences> {
        try {
            const updatedPrefs = await this.authRepository.updateUserPreferences(authId, prefs);
            this.logger.info(`Preferences updated for user: ${authId}`);
            return updatedPrefs;
        } catch (error) {
            if (error instanceof AppError) throw error;
            this.logger.error(`Error updating preferences for user ${authId}:`, error);
            throw new AppError('Erreur lors de la mise à jour des préférences', 500);
        }
    }
}
