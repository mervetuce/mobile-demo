export interface User {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    roles: string[];
    name?: string;  // Computed from firstName + lastName
    initials?: string; // Computed from first characters of name
}

export interface JwtPayload {
    sub: string;           // username
    jti: string;          // JWT ID
    email: string;        // email address
    uid: string;          // user ID
    roles?: string[];     // user roles
    nbf: number;          // not before timestamp
    exp: number;          // expiration timestamp
    iat: number;          // issued at timestamp
    ip?: string;          // IP address (optional)
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
}

export type RegisterResponse = {
    message: string;
    confirmationUrl?: string;
} | string;

export interface AuthResponse {
    id: string;
    userName: string;
    email: string;
    roles: string[];
    isVerified: boolean;
    jwToken: string;
}