/**
 * Feature Auth - Types
 */

// Re-export User from storage
export type { User, CreateUserData } from '@/lib/core/storage';

/**
 * Credenziali login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Dati registrazione
 */
export interface RegisterData {
  name: string;
  cognome?: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  company?: string;
  acceptTerms: boolean;
}

/**
 * Session
 */
export interface Session {
  user: import('@/lib/core/storage').User;
  token: string;
  expiresAt: string;
}

/**
 * Auth state
 */
export interface AuthState {
  user: import('@/lib/core/storage').User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth result
 */
export interface AuthResult {
  success: boolean;
  user?: import('@/lib/core/storage').User;
  session?: Session;
  error?: string;
}


