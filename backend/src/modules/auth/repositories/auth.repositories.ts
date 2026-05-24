import type { Logger } from 'winston';
import crypto from 'crypto';
import PostgresDatabase from '../../../infra/database/postgres'; // Import par défaut corrigé
import { AuthUser, User, Credentials, users_status, user_sessions } from '../types/auth.types';
import { BadRequestError } from '../../../shared/errors/appErrors';

/**
 * Repository gérant toutes les opérations de base de données liées à l'authentification.
 */
export class AuthRepository {
    constructor(
        private readonly db: PostgresDatabase,
        private readonly logger: Logger
    ) { }

    // =========================================== METHODES DE CREATION D'UTILISATEUR ===========================================
    /**
     * Crée un utilisateur complet avec ses identifiants et son statut de compte dans une transaction.
     */
    public async createUser(dto: User, credentials: Credentials, accountStatus: users_status): Promise<AuthUser> {
        const client = await this.db.getClient();
        try {
            await client.query('BEGIN');
            const now = new Date();

            // 1. Insertion Auth
            const authSql = `INSERT INTO users (id, first_name, last_name, email, phone, role, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING id, first_name AS "firstName", last_name AS "lastName", email, phone, role, created_at AS "createdAt", updated_at AS "updatedAt"`;

            const params = [
                dto.id,
                dto.firstName,
                dto.lastName,
                dto.email,
                dto.phone,
                dto.role,
                now,
                now
            ]
            const authResult = await client.query(authSql, params);
            const createdAuthUser = authResult.rows[0];

            // 2. Insertion Credentials
            const creSql = `INSERT INTO user_credentials (id, user_id, password_hash, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5)`;
            const paramsCredentials = [
                credentials.id,
                credentials.userId,
                credentials.passwordHash,
                now,
                now
            ];
            await client.query(creSql, paramsCredentials);

            // 3. Insertion Status
            const statusSql = `INSERT INTO user_status (user_id, is_active, verification, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5)`;
            const paramsStatus = [
                accountStatus.userId,
                accountStatus.isActive,
                accountStatus.isVerified ? 'verified' : 'unverified',
                now,
                now
            ];
            await client.query(statusSql, paramsStatus);

            await client.query('COMMIT');

            return {
                ...createdAuthUser,
                credentials: { ...credentials },
                accountStatus: { ...accountStatus },
                sessions: [],
                otpCodes: [],
                roleAssignments: []
            } as AuthUser;

        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error('Error creating user in transaction:', error);
            throw new BadRequestError('Failed to create user account');
        } finally {
            client.release();
        }
    }


    // =========================================== METHODES DE CONNEXION ET GESTION DE SESSIONS ===========================================

    /**
     * Recherche un utilisateur par son email ou son téléphone avec toutes ses relations.
     */
    public async getUserWithCredentialsByIdentifier(identifier: string): Promise<AuthUser | null> {
    try {
        const sql = `
                SELECT
                    u.id, u.first_name AS "firstName", u.last_name AS "lastName", u.email, u.phone, u.role, 
                    u.created_at AS "createdAt", u.updated_at AS "updatedAt",
                    c.id AS "creId", c.password_hash AS "passwordHash",
                    s.is_active AS "isActive", s.verification, s.created_at AS "statusCreatedAt"
                FROM users u
                INNER JOIN user_credentials c ON u.id = c.user_id
                INNER JOIN user_status s ON u.id = s.user_id
                WHERE u.email = $1 OR u.phone = $1
            `;

        const result = await this.db.query(sql, [identifier]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            phone: row.phone,
            role: row.role,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            credentials: {
                id: row.creId,
                userId: row.id,
                passwordHash: row.passwordHash,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
            },
            accountStatus: {
                id: row.statusId,
                userId: row.id,
                isVerified: row.verification === 'verified',
                isActive: row.isActive,
                createdAt: row.statusCreatedAt,
                updatedAt: row.updatedAt
            },
            sessions: [],
            otpCodes: [],
            roleAssignments: []
        } as AuthUser;
    } catch (error) {
        this.logger.error('Error fetching user with credentials:', error);
        throw new BadRequestError('Failed to fetch user credentials');
    }
}


    // =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Crée une nouvelle session utilisateur.
     */
public async createSession(dto: user_sessions): Promise<void> {
    try {
        // CORRECTION : "id" a été retiré de la liste des colonnes et des VALUES ($1 à $7 au lieu de $8)
        const sql = `
            INSERT INTO user_sessions (user_id, access_token, refresh_token, revoked, ip_address, user_agent, expires_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        
        // CORRECTION : dto.id a été retiré du tableau des paramètres
        const params = [
             dto.userId,
             dto.accessToken,
             dto.refreshToken,
             dto.revoked ?? false, // Sécurité si la propriété n'est pas définie
             dto.ipAddress ?? null,
             dto.userAgent ?? null,
             dto.expiresAt
        ];
        
        await this.db.query(sql, params);
    } catch (error) {
        this.logger.error('Error creating session:', error);
        throw new BadRequestError('Failed to create session');
    }
}


    // ============================================ METHODES DE VERIFICATION DE COMPTE ET OTP ===========================================
    /**
     * Vérifie le compte utilisateur et supprime le code OTP.
     */
    public async verifyUserAccount(authId: string, code: string): Promise<{ email: string, firstName: string } | null> {
    const client = await this.db.getClient();
    try {
        await client.query('BEGIN');

        // CORRECTION : Utilisation de "code_hash" au lieu de "code"
        // À la ligne 192 de votre auth.repositories.ts (CORRIGÉ)
            const checkOtpSql = `
                SELECT o.id, a.email, a.first_name as "firstName"
                FROM otp_codes o
                INNER JOIN users a ON o.user_id = a.id
                INNER JOIN user_status ast ON o.user_id = ast.user_id
                WHERE o.user_id = $1 
                AND o.code = $2 -- Remplacé o.code_hash par o.code
                AND o.expires_at > NOW() 
                AND ast.verification = 'unverified'
            `;


        const result = await client.query(checkOtpSql, [authId, code]);
        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const { email, firstName } = result.rows[0];

        // 1. Passage du statut à 'verified' et activation du compte ('active')
        await client.query(
            "UPDATE user_status SET verification = 'verified', status = 'active', updated_at = NOW() WHERE user_id = $1", 
            [authId]
        );
        
        // 2. Suppression ou invalidation du code OTP utilisé
        await client.query('DELETE FROM otp_codes WHERE user_id = $1', [authId]);

        await client.query('COMMIT');
        return { email, firstName };
    } catch (error) {
        await client.query('ROLLBACK');
        this.logger.error('Error verifying user account:', error);
        throw error;
    } finally {
        client.release();
    }
}



    // ============================================ METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Sauvegarde un code OTP pour un utilisateur.
     */
    public async createOtp(userId: string, code: string, expiresAt: Date): Promise<void> {
        try {
            const sql = `INSERT INTO otp_codes (id, user_id, code, expires_at) VALUES ($1, $2, $3, $4)`;
            const params = [
                crypto.randomUUID(),
                userId,
                code,
                expiresAt
            ]
            await this.db.query(sql, params);
        } catch (error) {
            this.logger.error('Error saving OTP code:', error);
            throw new BadRequestError('Failed to save verification code');
        }
    }



    // =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Récupère un utilisateur par son adresse email.
     * @email 
     */
    public async getUserByEmail(email: string): Promise<User | null> {
        try {
            const sql = `SELECT id, first_name as "firstName", last_name as "lastName", email, phone, role, created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE LOWER(email) = LOWER($1)`;
            const result = await this.db.query(sql, [email]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            this.logger.error('Error fetching user by email:', error);
            throw new BadRequestError('Failed to fetch user by email');
        }
    }



    /// =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Récupère un utilisateur par son numéro de téléphone.
     * @phone 
     */
    public async getUserByPhone(phone: string): Promise<User | null> {
        try {
            const sql = `SELECT id, first_name as "firstName", last_name as "lastName", email, phone, role, created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE phone = $1`;
            const result = await this.db.query(sql, [phone]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            this.logger.error('Error fetching user by phone:', error);
            throw new BadRequestError('Failed to fetch user by phone');
        }
    }

    /// =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Recupere les sessions par son token de rafraichissement.
     */

    public async getSessionByToken(token: string): Promise<any> {
        try {
            const sql = `SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()`;
            const result = await this.db.query(sql, [token]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            this.logger.error('Error fetching session by token:', error);
            throw new BadRequestError('Failed to fetch session by token');
        }
    }


    // =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Supprime une session specifique(logout).
     */

    public async deleteSession(token: string): Promise<void> {
        try {
            const sql = `DELETE FROM sessions WHERE token = $1`;
            await this.db.query(sql, [token]);
        } catch (error) {
            this.logger.error('Error deleting session by token:', error);
            throw new BadRequestError('Failed to delete session by token');
        }
    }


    // =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Supprime toutes les sessions d'un utilisateur (logout de tous les appareils).
     */

    public async deleteSessionsByAuthId(authId: string): Promise<void> {
        try {
            const sql = `DELETE FROM sessions WHERE user_id = $1`;
            await this.db.query(sql, [authId]);
        } catch (error) {
            this.logger.error('Error deleting sessions by authId:', error);
            throw new BadRequestError('Failed to delete sessions by authId');
        }
    }


    // =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Met à jour la date de dernière connexion dans les préférences.
     */
public async updateLastLogin(userId: string): Promise<void> {
    try {
        // CORRECTION 1 : Ajout de NOW() pour correspondre à last_seen_at
        // CORRECTION 2 : Retrait de updated_at de la clause DO UPDATE SET
        const sql = `
            INSERT INTO user_activity (user_id, last_login_at, last_seen_at)
            VALUES ($1, NOW(), NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET last_login_at = NOW(), last_seen_at = NOW()
        `;
        
        const params = [userId];
        await this.db.query(sql, params);
        
        // Supprimé le return result.rows[0] car la méthode retourne Promise<void>
    } catch (error) {
        this.logger.error('Error updating last login:', error);
        throw error; // Important de propager l'erreur pour le Promise.all
    }
}



    // =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Récupère les préférences d'un utilisateur.
     */
    public async getUserPreferences(authId: string): Promise<any> {
        try {
            const sql = `SELECT * FROM user_preferences WHERE user_id = $1`;
            const result = await this.db.query(sql, [authId]);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error fetching user preferences:', error);
            throw new BadRequestError('Failed to fetch user preferences');
        }
    }


    // =========================================== METHODES DE GESTION DE SESSIONS ET OTP ===========================================
    /**
     * Met à jour les préférences d'un utilisateur.
     */
    public async updateUserPreferences(userId: string, prefs: any): Promise<any> {
        try {
            const sql = `
                INSERT INTO user_preferences (user_id, photo_url, language, theme, fcm_token, notifications_enabled)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (user_id) DO UPDATE SET
                    photo_url = COALESCE(EXCLUDED.photo_url, user_preferences.photo_url),
                    language = COALESCE(EXCLUDED.language, user_preferences.language),
                    theme = COALESCE(EXCLUDED.theme, user_preferences.theme),
                    fcm_token = COALESCE(EXCLUDED.fcm_token, user_preferences.fcm_token),
                    notifications_enabled = COALESCE(EXCLUDED.notifications_enabled, user_preferences.notifications_enabled),
                    updated_at = NOW()
                RETURNING *`;
           const params =[
            userId,
            prefs.photoUrl,
            prefs.language,
            prefs.theme,
            prefs.fcmToken,
            prefs.notificationsEnabled,
           ]
            const result = await this.db.query(sql, params);
            return result.rows[0];
        } catch (error) {
            this.logger.error('Error updating user preferences:', error);
            throw new BadRequestError('Failed to update user preferences');
        }
    }

}