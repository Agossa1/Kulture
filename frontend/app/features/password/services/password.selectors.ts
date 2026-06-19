// Importe le type RootState depuis ton fichier store.ts global
import { RootState } from '../../../store/index'; 

/**
 * Sélecteur de base pour récupérer l'ensemble de la branche password
 */
export const selectPasswordState = (state: RootState) => state.password;

/**
 * Sélecteur pour l'état de chargement (ex: afficher un spinner)
 */
export const selectPasswordLoading = (state: RootState) => state.password.loading;

/**
 * Sélecteur pour l'erreur actuelle
 */
export const selectPasswordError = (state: RootState) => state.password.error;

/**
 * Sélecteur pour savoir si la dernière action a réussi
 */
export const selectPasswordSuccess = (state: RootState) => state.password.success;

/**
 * Sélecteur pour le message de retour de l'API (Succès ou info)
 */
export const selectPasswordMessage = (state: RootState) => state.password.message;

/**
 * Sélecteur crucial pour piloter l'affichage de tes formulaires (Stepper)
 * Renvoie: 'idle' | 'forgot_sent' | 'otp_verified' | 'reset_success'
 */
export const selectPasswordCurrentStep = (state: RootState) => state.password.currentStep;

export const selectPasswordEmail = (state: RootState) => state.password.email;
export const selectPasswordOtp = (state: RootState) => state.password.otp;