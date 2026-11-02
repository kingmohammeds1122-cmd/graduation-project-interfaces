/**
 * تعريفات أنواع المستخدم والمصادقة (User & Auth Types)
 * متوافقة مع FastAPI و JWT Tokens.
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatarUrl?: string;
  organization?: string;
  createdAt?: string;
  isMock?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  tokenType?: string;
  user: User;
  expiresIn?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}
