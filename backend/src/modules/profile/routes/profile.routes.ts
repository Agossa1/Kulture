import { Router } from 'express';
import PostgresDatabase from '../../../infra/database/postgres';
import { logger } from '../../../shared/loggers/logger';
import { ProfileModule } from '../profile.module';

import { authMiddleware } from '../../../shared/middlewares/auth.middleware';

/**
 * Configure les routes pour le module Profile.
 * @param db Instance de la base de données
 */
export const configureProfileRoutes = (db: PostgresDatabase) => {
    const router = Router();
    const profileModule = new ProfileModule(db, logger);

    // Toutes les routes du profil nécessitent une authentification
    router.use(authMiddleware);

    // Récupération et mise à jour du profil de base
    router.get('/:authId', profileModule.getProfileController.getProfile);
    router.patch('/:authId', profileModule.updateProfileController.update);

    // Préférences
    router.patch('/:authId/preferences', profileModule.updatePreferencesController.update);

    // Adresses de l'utilisateur
    router.post('/:authId/addresses', profileModule.addAddressController.add);
    router.delete('/:authId/addresses/:addressId', profileModule.removeAddressController.remove);

    return router;
};
