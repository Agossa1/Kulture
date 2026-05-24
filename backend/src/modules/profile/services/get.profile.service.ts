import { ProfileRepository } from "../repositories/profile.repositories";
import type { Logger } from 'winston';
import { UserProfile } from "../types/profile.types";
import { NotFoundError } from "../../../shared/errors/appErrors";

export class GetProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly logger: Logger
    ) {}

    public async getProfile(authId: string): Promise<UserProfile> {
        try {
            const profile = await this.profileRepository.findById(authId);
            if (!profile) throw new NotFoundError('Profil non trouvé');
            return profile;
        } catch (error) {
            this.logger.error(`Error in GetProfileService for ${authId}:`, error);
            throw error;
        }
    }
}
