import PostgresDatabase from '../../infra/database/postgres';
import type { Logger } from 'winston';
import { ProfileRepository } from './repositories/profile.repositories';

import { GetProfileService } from './services/get.profile.service';
import { UpdateProfileService } from './services/update.profile.service';
import { UpdatePreferencesService } from './services/update.preferences.service';
import { AddAddressService } from './services/add.address.service';
import { RemoveAddressService } from './services/remove.address.service';

import { GetProfileController } from './controllers/get.profile.controller';
import { UpdateProfileController } from './controllers/update.profile.controller';
import { UpdatePreferencesController } from './controllers/update.preferences.controller';
import { AddAddressController } from './controllers/add.address.controller';
import { RemoveAddressController } from './controllers/remove.address.controller';

/**
 * Module Profile.
 * Gère les profils utilisateurs, préférences et adresses associées.
 */
export class ProfileModule {
    public readonly getProfileController: GetProfileController;
    public readonly updateProfileController: UpdateProfileController;
    public readonly updatePreferencesController: UpdatePreferencesController;
    public readonly addAddressController: AddAddressController;
    public readonly removeAddressController: RemoveAddressController;

    constructor(db: PostgresDatabase, logger: Logger) {
        // 1. Repository
        const profileRepository = new ProfileRepository(db, logger);

        // 2. Services
        const getProfileService = new GetProfileService(profileRepository, logger);
        const updateProfileService = new UpdateProfileService(profileRepository, logger);
        const updatePreferencesService = new UpdatePreferencesService(profileRepository, logger);
        const addAddressService = new AddAddressService(profileRepository, logger);
        const removeAddressService = new RemoveAddressService(profileRepository, logger);

        // 3. Contrôleurs
        this.getProfileController = new GetProfileController(getProfileService);
        this.updateProfileController = new UpdateProfileController(updateProfileService);
        this.updatePreferencesController = new UpdatePreferencesController(updatePreferencesService);
        this.addAddressController = new AddAddressController(addAddressService);
        this.removeAddressController = new RemoveAddressController(removeAddressService);
    }
}
