import { passwordApi } from './password.api';
import { createAsyncThunk } from '@reduxjs/toolkit';
 // Remplace par le nom de ton fichier service créé à l'étape d'avant
import { 
    ForgotPasswordDto, 
    VerifyOtpDto, 
    ResetPasswordDto, 
    UpdatePasswordDto 
} from './password.types';

/**
 * 1. Demande de réinitialisation de mot de passe (Envoi OTP)
 */
export const forgotPassword = createAsyncThunk(
    'password/forgot',
    async (dto: ForgotPasswordDto, { rejectWithValue }) => {
        try {
            return await passwordApi.forgotPassword(dto);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Erreur lors de la demande de réinitialisation du mot de passe."
            );
        }
    }
);

/**
 * 2. Vérification du code OTP
 */
export const verifyOtp = createAsyncThunk(
    'password/verifyOtp',
    async (dto: VerifyOtpDto, { rejectWithValue }) => {
        try {
            return await passwordApi.verifyOtp(dto);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Le code de vérification est invalide ou expiré."
            );
        }
    }
);

/**
 * 3. Réinitialisation finale du mot de passe
 */
export const resetPassword = createAsyncThunk(
    'password/reset',
    async (dto: ResetPasswordDto, { rejectWithValue }) => {
        try {
            return await passwordApi.resetPassword(dto);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Impossible de réinitialiser le mot de passe."
            );
        }
    }
);

/**
 * 4. Modification du mot de passe (Utilisateur connecté)
 */
export const updatePassword = createAsyncThunk(
    'password/update',
    async (dto: UpdatePasswordDto, { rejectWithValue }) => {
        try {
            return await passwordApi.updatePassword(dto);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Échec de la mise à jour du mot de passe."
            );
        }
    }
);