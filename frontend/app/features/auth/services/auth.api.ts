import { api } from '@/app/lib/api.clients';
import { LoginResponse, RegisterPayload, AuthUser, OtpVerificationPayload, LoginPayload, ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto, UpdatePasswordDto} from './auth.types';
 
/**
 * Mappe les données brutes du backend (souvent en snake_case) 
 * vers l'interface unifiée AuthUser (camelCase) avec des valeurs par défaut sécurisées.
 */
const mapAuthUser = (user: any): AuthUser => ({
    id: user.id,
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    email: user.email,
    phone: user.phone || null,
    role: user.role || 'user',
    createdAt: user.createdAt || user.created_at || new Date().toISOString(),
    status: {
        status: user.status?.status || 'pending',
        verification: user.status?.verification || user.accountStatus?.verification || 'unverified',
        isActive: user.status?.isActive ?? user.accountStatus?.isActive ?? false
    },
    preferences: {
        language: user.preferences?.language || 'fr',
        theme: user.preferences?.theme || 'light',
        notificationEnabled: user.preferences?.notificationEnabled ?? true,
        fcmToken: user.preferences?.fcmToken || null
    },
    activity: {
        lastLoginAt: user.activity?.lastLoginAt || null,
        lastSeenAt: user.activity?.lastSeenAt || null
    }
});

 export const authApi= {
    /**
     * Enregistrer un nouvel utilisateur
     * @param payload - Les données d'inscription (RegisterPayload)
     * @returns L'utilisateur créé et mappé au format AuthUser
     */
    register: async (payload: RegisterPayload): Promise<AuthUser> => {
        try{
            // Le apiClient retourne déjà response.json()
            const response = await api.post<any>('/auth/register', payload);
            const userData = response.data?.user || response.user || response;
            return mapAuthUser(userData);
        }catch(error){
            throw error;
        }
    },

    /**
     * Connecter un utilisateur
     * @param credentials - Identifiant (email/phone) et mot de passe
     * @returns La réponse de connexion contenant l'utilisateur
     */
    login: async (credentials: LoginPayload): Promise<LoginResponse> => {
        try{
            const response = await api.post<any>('/auth/login', credentials);
            
            // On s'adapte à la structure backend : { success, message, data: { user } }
            const authData = response.data || response;
            
            if (!authData.user) {
                throw new Error("Réponse d'authentification incomplète");
            }

            return {
                user: mapAuthUser(authData.user)
            };
        } catch (error){
            throw error;
        }
    },

    /**
     * Vérifier le compte avec le code OTP
     * @param payload - ID utilisateur et code OTP
     */
    verifyAccount: async (payload: OtpVerificationPayload): Promise<void> => {
       try {
        await api.post<any>('/auth/verify', payload);
       } catch (error) {
        throw error;
       }
    },

    /**
     * Déconnecter l'utilisateur
     * Envoie une requête pour révoquer le cookie de session HttpOnly
     */
    logout: async (): Promise<void> => {
        try{
            await api.post<any>('/auth/logout');
        }catch(error){
            throw error;
        }
    }



    
 };