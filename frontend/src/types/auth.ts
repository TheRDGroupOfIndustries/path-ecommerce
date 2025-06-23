export interface User {
    id:string,
    email:string,
    name:string,
    avatar:string
}
export interface AuthTokens {
    accessToken:string;
    refreshToken:string;
}
export interface LoginCredentials {
    email:string;
    password:string;
}
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}