export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    PHARMACIST = 'pharmacist',
    DOCTOR = 'doctor',
    NURSE = 'nurse',
    SUPER_ADMIN = 'super_admin',
    DELIVERY_PERSONNEL = 'delivery_person',
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface Credentials {
    id: string;
    userId: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface user_sessions {
    id: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    revoked: boolean;
    ipAddress: string;
    userAgent: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface otp_codes {
    id: string;
    userId: string;
    codeHash: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface role_assignments {
    id: string;
    role: Role;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface users_status {
    id: string;
    userId: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface user_activity {
    userId: string;
    lastLoginAt: Date;
    lastLogoutAt: Date;
    lastPasswordChangeAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserPreferences {
    id: string;
    userId: string;
    photoUrl?: string;
    language: string;
    fcmToken?: string;
    theme: string;
    notificationsEnabled: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}


export interface AuthUser extends User {
    credentials: Credentials;
    sessions: user_sessions[];
    otpCodes: otp_codes[];
    roleAssignments: role_assignments[];
    accountStatus: users_status;
    preferences?: UserPreferences;
}

export interface LoginResponse {
    user: Omit<AuthUser, 'credentials'>;
    accessToken: string;
    refreshToken: string;
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}