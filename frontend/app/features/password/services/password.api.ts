import { 
    ForgotPasswordDto, 
    VerifyOtpDto, 
    ResetPasswordDto, 
    UpdatePasswordDto 
} from './password.types';

import {api }from "../../../lib/api.clients"

export const passwordApi = {
    // ====================================== PASSWORD ==================================================================

    /**
     * 1. Demande de réinitialisation (Envoi de l'OTP par email)
     */
    forgotPassword: async (payload: ForgotPasswordDto): Promise<void> => {
        try {
            // Correction du chemin: /password au lieu de /auth, et injection du payload
            await api.post('/password/forgot', payload);
        } catch (error) {
            throw error;
        }
    },

    /**
     * 2. Vérification du code OTP reçu par email
     */
    verifyOtp: async (payload: VerifyOtpDto): Promise<void> => {
        try {
            await api.post('/password/verify', payload);
        } catch (error) {
            throw error;
        }
    },

    /**
     * 3. Réinitialisation finale du mot de passe (via email + otp + newPassword)
     */
    resetPassword: async (payload: ResetPasswordDto): Promise<void> => {
        try {
            await api.post('/password/reset', payload);
        } catch (error) {
            throw error;
        }
    },

    /**
     * 4. Modification du mot de passe quand l'utilisateur est connecté
     * (L'userId sera extrait du token JWT côté backend grâce à ton middleware auth)
     */
    updatePassword: async (payload: UpdatePasswordDto): Promise<void> => {
        try {
            await api.post('/password/update', payload);
        } catch (error) {
            throw error;
        }
    }
}