import { ProfileRepository } from "../repositories/profile.repositories";
import type { Logger } from 'winston';
import { UserPreferences, UpdatePreferencesDTO } from "../types/profile.types";

export class UpdatePreferencesService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly logger: Logger
    ) {}

    public async update(authId: string, dto: UpdatePreferencesDTO): Promise<UserPreferences> {
        try {
            const prefs = await this.profileRepository.upsertPreferences(authId, dto);
            this.logger.info(`Préférences mises à jour pour l'utilisateur : ${authId}`);
            return prefs;
        } catch (error) {
            this.logger.error(`Error in UpdatePreferencesService for ${authId}:`, error);
            throw error;
        }
    }
}
