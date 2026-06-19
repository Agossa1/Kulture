 import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { forgotPassword, verifyOtp, resetPassword, updatePassword } from './password.thunk';


interface PasswordState {
    loading :boolean;
    error: string | null;
    success: boolean;
    message: string | null;
    currentStep: 'idle' | 'forgot_sent' | 'otp_verified' | 'reset_success';
    email: string | null;
    otp: string | null;
}


const initialState : PasswordState = {
    loading:false,
    error:null,
    success:false,
    message:null,
    currentStep: 'idle',
    email: null,
    otp: null
}


export const passwordSlice = createSlice ({
    name:"password",
    initialState,
    reducers:{
        // Action pour reinitialiser l'état (quand l'utilisateur quitte la page)

        resetPasswordState: (state) => {
            state.loading = false;
            state.error = null; 
            state.success = false;
            state.message = null;
            state.currentStep = 'idle';
            state.email = null;
            state.otp = null;
        },

        clearPasswordError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder 
        // ==========================================
            // 1. FORGOT PASSWORD
            // ==========================================
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(forgotPassword.fulfilled, (state, action: any) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Si l'email existe, un code a été envoyé.";
                state.currentStep = 'forgot_sent';
                state.email = action.meta.arg.email;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ==========================================
            // 2. VERIFY OTP
            // ==========================================
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(verifyOtp.fulfilled, (state, action: any) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Code OTP validé avec succès.";
                state.currentStep = 'otp_verified';
                state.otp = action.meta.arg.code;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ==========================================
            // 3. RESET PASSWORD
            // ==========================================
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state, action: any) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Votre mot de passe a été réinitialisé.";
                state.currentStep = 'reset_success';
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ==========================================
            // 4. UPDATE PASSWORD (Connecté)
            // ==========================================
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePassword.fulfilled, (state, action: any) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Mot de passe mis à jour avec succès.";
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

// Export des actions synchrones
export const { resetPasswordState, clearPasswordError } = passwordSlice.actions;

// Export du reducer pour le store
export default passwordSlice.reducer;