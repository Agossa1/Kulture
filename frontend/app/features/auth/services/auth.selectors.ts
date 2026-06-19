import { RootState } from "@/app/store";


export const selectAuth = (state:RootState) => state.auth;
export const selectCurrentUser = (state:RootState) => state.auth.user;
export const selectIsAuthenticated = (state:RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state:RootState) => state.auth.isLoading;
export const selectError = (state:RootState) => state.auth.error;
export const selectSession = (state:RootState) => state.auth.session;
