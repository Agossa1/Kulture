export interface ForgotPasswordDto {
    email: string; // Harmonisé avec ton service qui attend explicitement un email
}

export interface VerifyOtpDto {
    email: string;
    code: string;
}

export interface ResetPasswordDto {
    email: string;
    otp: string;
    newPassword: string;
}

export interface UpdatePasswordDto {
    userId: string;
    oldPassword: string;
    newPassword: string;
}