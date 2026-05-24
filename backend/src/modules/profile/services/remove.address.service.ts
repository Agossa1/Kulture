import { ProfileRepository } from "../repositories/profile.repositories";
import type { Logger } from 'winston';

export class RemoveAddressService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly logger: Logger
    ) {}

    public async remove(authId: string, addressLinkId: string): Promise<void> {
        try {
            await this.profileRepository.removeAddress(authId, addressLinkId);
            this.logger.info(`Adresse ${addressLinkId} supprimée pour l'utilisateur : ${authId}`);
        } catch (error) {
            this.logger.error(`Error in RemoveAddressService for ${authId}:`, error);
            throw error;
        }
    }
}
