import type { Logger } from 'winston';
import PostgresDatabase from '../../../infra/database/postgres';
import {
    UserProfile,
    UserPreferences,
    UserAddress,
    UpdateProfileDTO,
    UpdatePreferencesDTO,
    AddUserAddressDTO
} from '../types/profile.types';
import { BadRequestError, NotFoundError } from '../../../shared/errors/appErrors';

/**
 * Repository gérant les opérations de base de données pour les profils utilisateurs.
 * Couvre les tables : auth, user_preferences, account_status, user_addresses.
 */
export class ProfileRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) {}

    /**
     * Récupère le profil complet d'un utilisateur avec ses préférences,
     * son statut de compte et ses adresses.
     */
    public async findById(authId: string): Promise<UserProfile | null> {
        try {
            const sql = `
                SELECT 
                    a.id, 
                    a.first_name as "firstName", 
                    a.last_name as "lastName",
                    a.email, 
                    a.phone,
                    a.created_at as "createdAt",
                    a.updated_at as "updatedAt"
                FROM auth a
                WHERE a.id = $1
            `;
            const result = await this.db.query(sql, [authId]);
            if (result.rows.length === 0) return null;

            const profile = result.rows[0];

            // Charger les préférences
            const prefSql = `
                SELECT 
                    id, auth_id as "authId",
                    photo_url as "photoUrl", language,
                    fcm_token as "fcmToken", theme,
                    notifications_enabled as "notificationsEnabled",
                    last_login_at as "lastLoginAt"
                FROM user_preferences WHERE auth_id = $1
            `;
            const prefResult = await this.db.query(prefSql, [authId]);
            profile.preferences = prefResult.rows[0] || null;

            // Charger le statut du compte
            const statusSql = `
                SELECT id, auth_id as "authId", is_active as "isActive", is_verified as "isVerified"
                FROM account_status WHERE auth_id = $1
            `;
            const statusResult = await this.db.query(statusSql, [authId]);
            profile.accountStatus = statusResult.rows[0] || null;

            // Charger les adresses
            const addrSql = `
                SELECT 
                    ua.id, ua.auth_id as "authId", ua.address_id as "addressId",
                    ua.label, ua.is_default as "isDefault",
                    a.street, a.postal_code as "postalCode"
                FROM user_addresses ua
                JOIN address a ON ua.address_id = a.id
                WHERE ua.auth_id = $1
                ORDER BY ua.is_default DESC
            `;
            const addrResult = await this.db.query(addrSql, [authId]);
            profile.addresses = addrResult.rows;

            return profile;
        } catch (error) {
            this.logger.error(`Error fetching profile for auth ${authId}:`, error);
            throw new BadRequestError('Failed to fetch profile');
        }
    }

    /**
     * Met à jour les informations de base du profil (nom, téléphone).
     */
    public async updateProfile(authId: string, dto: UpdateProfileDTO): Promise<UserProfile> {
        try {
            const fields = Object.keys(dto).filter(k => (dto as any)[k] !== undefined);
            if (fields.length === 0) {
                return (await this.findById(authId))!;
            }

            const setClause = fields.map((f, i) => {
                const col = f.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
                return `${col} = $${i + 2}`;
            }).join(', ');

            const sql = `UPDATE auth SET ${setClause}, updated_at = NOW() WHERE id = $1`;
            const result = await this.db.query(sql, [authId, ...fields.map(f => (dto as any)[f])]);
            if (result.rowCount === 0) throw new NotFoundError('Profile not found');

            return (await this.findById(authId))!;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error updating profile ${authId}:`, error);
            throw new BadRequestError('Failed to update profile');
        }
    }

    /**
     * Met à jour (ou crée via UPSERT) les préférences d'un utilisateur.
     */
    public async upsertPreferences(authId: string, dto: UpdatePreferencesDTO): Promise<UserPreferences> {
        try {
            const fields = Object.keys(dto).filter(k => (dto as any)[k] !== undefined);
            const setClause = fields.map((f, i) => {
                const col = f.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
                return `${col} = $${i + 2}`;
            }).join(', ');

            const sql = `
                INSERT INTO user_preferences (auth_id, ${fields.map(f => f.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)).join(', ')})
                VALUES ($1, ${fields.map((_, i) => `$${i + 2}`).join(', ')})
                ON CONFLICT (auth_id) DO UPDATE SET ${setClause}, updated_at = NOW()
                RETURNING 
                    id, auth_id as "authId", photo_url as "photoUrl", language,
                    fcm_token as "fcmToken", theme,
                    notifications_enabled as "notificationsEnabled",
                    last_login_at as "lastLoginAt"
            `;
            const result = await this.db.query(sql, [authId, ...fields.map(f => (dto as any)[f])]);
            return result.rows[0];
        } catch (error) {
            this.logger.error(`Error upserting preferences for ${authId}:`, error);
            throw new BadRequestError('Failed to update preferences');
        }
    }

    /**
     * Ajoute une adresse au profil de l'utilisateur.
     * Si isDefault est true, réinitialise les autres adresses par défaut.
     */
    public async addAddress(authId: string, dto: AddUserAddressDTO): Promise<UserAddress> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');

            if (dto.isDefault) {
                // Retirer le flag isDefault des autres adresses
                await client.query(
                    `UPDATE user_addresses SET is_default = FALSE WHERE auth_id = $1`,
                    [authId]
                );
            }

            const sql = `
                INSERT INTO user_addresses (auth_id, address_id, label, is_default)
                VALUES ($1, $2, $3, $4)
                RETURNING id, auth_id as "authId", address_id as "addressId", label, is_default as "isDefault"
            `;
            const result = await client.query(sql, [
                authId, dto.addressId, dto.label || null, dto.isDefault || false
            ]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error(`Error adding address for ${authId}:`, error);
            throw new BadRequestError('Failed to add address');
        } finally {
            client.release();
        }
    }

    /**
     * Supprime une adresse du profil de l'utilisateur.
     */
    public async removeAddress(authId: string, addressLinkId: string): Promise<void> {
        try {
            const sql = `DELETE FROM user_addresses WHERE id = $1 AND auth_id = $2`;
            const result = await this.db.query(sql, [addressLinkId, authId]);
            if (result.rowCount === 0) throw new NotFoundError('Address not found or unauthorized');
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            this.logger.error(`Error removing address for ${authId}:`, error);
            throw new BadRequestError('Failed to remove address');
        }
    }
}
