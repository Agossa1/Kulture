import { ProfileRepository } from "../repositories/profile.repositories";
import type { Logger } from 'winston';
import { UserProfile, UpdateProfileDTO } from "../types/profile.types";

export class UpdateProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly logger: Logger
    ) {}

    public async update(authId: string, dto: UpdateProfileDTO): Promise<UserProfile> {
        try {
            const updated = await this.profileRepository.updateProfile(authId, dto);
            this.logger.info(`Profil mis à jour pour l'utilisateur : ${authId}`);
            return updated;
        } catch (error) {
            this.logger.error(`Error in UpdateProfileService for ${authId}:`, error);
            throw error;
        }
    }
}
