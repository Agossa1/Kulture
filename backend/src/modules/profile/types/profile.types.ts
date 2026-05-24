export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    PHARMACIST = 'pharmacist',
    DOCTOR = 'doctor',
    NURSE = 'nurse',
    SUPER_ADMIN = 'super_admin',
    DELIVERY_PERSON = 'delivery_person'
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;

    // Relations enrichies
    preferences?: UserPreferences;
    accountStatus?: AccountStatus;
    addresses?: UserAddress[];
}

export interface UserPreferences {
    id: string;
    authId: string;
    photoUrl?: string;
    language: string;
    fcmToken?: string;
    theme: string;
    notificationsEnabled: boolean;
    lastLoginAt?: Date;
}

export interface AccountStatus {
    id: string;
    authId: string;
    isActive: boolean;
    isVerified: boolean;
}

export interface UserAddress {
    id: string;
    authId: string;
    addressId: string;
    label?: string;
    isDefault: boolean;
    street?: string;
    postalCode?: string;
}

// DTOs
export interface UpdateProfileDTO {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface UpdatePreferencesDTO {
    photoUrl?: string;
    language?: string;
    fcmToken?: string;
    theme?: string;
    notificationsEnabled?: boolean;
}

export interface AddUserAddressDTO {
    addressId: string;
    label?: string;
    isDefault?: boolean;
}
