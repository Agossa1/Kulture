import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser, AuthState, AuthSession } from './auth.types';
import { loginUser, registerUser, logoutUser, verifyAccount } from './auth.thunk';


const initialState: AuthState = {
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};



/**
 * Slice pour gérer l'authentification
 * @param state AuthState
 * @param action PayloadAction
 * @returns AuthState
 */

const authSlice = createSlice ({
    name:'auth',
    initialState,
    reducers:{
        /**
     * Efface l'erreur
     * @param state AuthState
     * @returns AuthState
     */
        clearError: (state) => {
            state.error = null;
        },

        /**
     * Définit l'utilisateur authentifié
     * @param state AuthState
     * @param action PayloadAction
     */
        setAuthenticatedUser: (state, action: PayloadAction<{ user: AuthUser; session: AuthSession }>) => {
            state.user = action.payload.user;
            state.session = action.payload.session;
            state.isAuthenticated = true;
        },

        /**
     * Met à jour l'utilisateur
     * @param state AuthState
     * @param action PayloadAction
     * @returns AuthState
     */
     updateUser: (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
     },
    },

    /**
   * Extrareducers pour gérer les actions asynchrones
   * @param builder Builder
   * @returns Builder
   */

    extraReducers:(builder) => {
        builder
        /**
         * Login user
         */

        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            if (action.payload.session) {
                state.session = action.payload.session;
            }
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
        })
        /**
         * Register user
         * @param state Authstate
         * @param action PayloadAction 
         * @returns AuthState
         */

        .addCase(registerUser.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false; // Nécessite validation OTP après
            state.user = action.payload; // register renvoie directement AuthUser
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })

        /**
         * Verify Account
         */
        .addCase(verifyAccount.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(verifyAccount.fulfilled, (state) => {
            state.isLoading = false;
            if (state.user?.status) {
                state.user.status.verification = 'verified';
            }
        })
        .addCase(verifyAccount.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })

        /**
         * Logout
         */
        .addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
        });
    }
});

export const { clearError, setAuthenticatedUser, updateUser } = authSlice.actions;
export default authSlice.reducer;