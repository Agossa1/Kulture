import PostgresDatabase from "./postgres";
import { logger } from "../../shared/loggers/logger";
import { Role } from "../../modules/auth/types/auth.types";

async function seed() {
    const db = new PostgresDatabase();
    try {
        await db.connect();
        logger.info('🌱 Démarrage du seeding des rôles...');

        const roles = [
            { role: Role.ADMIN, permissions: { all: true } },
            { role: Role.USER, permissions: { 'read:medicines': true, 'create:orders': true } },
            { role: Role.PHARMACIST, permissions: { 'manage:stock': true, 'validate:prescriptions': true } },
            { role: Role.DELIVERY_PERSONNEL, permissions: { 'update:delivery': true } },
            { role: Role.SUPER_ADMIN, permissions: { all: true } },
        ];

        for (const r of roles) {
            await db.query(
                `INSERT INTO role_permissions (role, permissions) 
                 VALUES ($1, $2) 
                 ON CONFLICT (role) DO NOTHING`,
                [r.role, JSON.stringify(r.permissions)]
            );
        }

        logger.info('✅ Rôles insérés avec succès !');
    } catch (error) {
        logger.error('❌ Erreur pendant le seeding :', error);
    } finally {
        await db.disconnect();
    }
}

seed();
