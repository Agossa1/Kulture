import { ProfileRepository } from "../repositories/profile.repositories";
import type { Logger } from 'winston';
import { UserAddress, AddUserAddressDTO } from "../types/profile.types";

export class AddAddressService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly logger: Logger
    ) {}

    public async add(authId: string, dto: AddUserAddressDTO): Promise<UserAddress> {
        try {
            const address = await this.profileRepository.addAddress(authId, dto);
            this.logger.info(`Adresse ajoutée pour l'utilisateur : ${authId}`);
            return address;
        } catch (error) {
            this.logger.error(`Error in AddAddressService for ${authId}:`, error);
            throw error;
        }
    }
}
