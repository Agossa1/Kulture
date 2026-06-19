
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./auth.api";
import { RegisterPayload, LoginPayload, OtpVerificationPayload, ForgotPasswordDto } from "./auth.types";



/***
 * Enregistre un nouvel utilisateur
 * @Param data, RegisterPayload)
 * @return Promise
 * @throws Error
 */



export const registerUser = createAsyncThunk(
    'auth/register',
    async (data:RegisterPayload, {rejectWithValue}) =>{
        try {
            return await authApi.register(data)
        } catch (error:any) {
            return rejectWithValue(error.response?.data?.message || error.message || "Erreur lors de l'inscription ")
        }
    }
    
)



/**
 * Thunk pour la connexion de l'utilisateur
 * @param data - Les identifiants de connexion (LoginPayload)
 * @returns La réponse de connexion contenant l'utilisateur mappé
 */
export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: LoginPayload, { rejectWithValue }) => {
        try {
            return await authApi.login(data);
        } catch (error: any) {
            // On récupère le message d'erreur traduit par notre logger/apiClient
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                "Identifiants invalides"
            );
        }
    }
);



/**
 * Thunk pour la vérification du compte utilisateur via code OTP
 * @param data - Le userId et le code de vérification
 */
export const verifyAccount = createAsyncThunk(
    'auth/verifyAccount',
    async (data: OtpVerificationPayload, { rejectWithValue }) => {
        try{
            return await authApi.verifyAccount(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || "Erreur lors de la vérification du compte")
        }
    }
)


export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            return await authApi.logout();
        } catch (error:any){
            return rejectWithValue(error.response?.data?.message || error.message || "Erreur lors de la déconnexion")
        }
    }
)


 