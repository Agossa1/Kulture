
// 1. Enums basés sur les types personnalisés de votre base de données (PostgreSQL)
export type UserRole = 'user' | 'admin' | 'artist' | 'organizer' | 'super_admin'; 
export type AccountStatus = 'pending' | 'active' | 'suspended';
export type VerificationStatus = 'unverified' | 'verified' | string;
export type ThemeMode = 'light' | 'dark';


// 2. Les données brutes saisies par l'utilisateur dans le formulaire d'inscription
export interface RegisterPayload {
  firstName: string;        
  lastName: string;         
  email: string;            
  password: string;         
  phone?: string;          
}

// 3. La réponse renvoyée par le serveur après une inscription réussie
 
export interface RegisterResponse {
  id: string;               
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;          
  createdAt: string;        
}

// 4. Types atomiques calqués sur l'architecture de vos tables SQL
export interface UserPreferences {
  language: string;
  theme: ThemeMode;
  notificationEnabled: boolean;
  fcmToken?: string | null;
}

export interface UserStatus {
  status: AccountStatus;
  verification: VerificationStatus;
  isActive: boolean;
}

export interface UserActivity {
  lastLoginAt: string | null; // Les dates provenant de l'API arrivent en chaînes ISO
  lastSeenAt: string | null;
}

// 5. L'entité Utilisateur consolidée pour l'application (Jointure des tables clés)
export interface AuthUser {
  id: string; // users.id
  firstName: string; // users.first_name
  lastName: string; // users.last_name
  email: string; // user_accounts.email
  phone?: string | null; // user_accounts.phone
  role: UserRole; // users.role
  createdAt: string; // users.created_at
  status: UserStatus; // issue de user_status
  preferences: UserPreferences; // issue de user_preferences
  activity: UserActivity; // issue de user_activity
}

// 6. Structure de la session d'authentification (Tokens issus de user_sessions)
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // Date d'expiration ISO du token
}

// 7. L'état initial du Slice Redux (Auth State)
export interface AuthState {
  user: AuthUser | null;       // Null si déconnecté, contient le profil complet si connecté
  session: AuthSession | null; // Null si déconnecté, contient les tokens d'accès
  isAuthenticated: boolean;    // Raccourci pratique pour les guards de routes
  isLoading: boolean;          // Pour gérer les spinners durant les requêtes asynchrones (Thunks)
  error: string | null;        // Pour stocker d'éventuels messages d'erreur (Mauvais MDP, etc.)
}

// 8. Types utilitaires pour les Payload des requêtes d'API (Authentification)
export interface LoginPayload {
  identifier: string; // Peut être l'email ou le téléphone selon le loginSchema backend
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  session?: AuthSession; // Optionnel car le backend utilise des cookies HttpOnly (voir login.controller.ts)
}

export interface OtpVerificationPayload {
  userId: string;
  code: string; // Sera haché côté serveur (otp_codes.code_hash)
}


