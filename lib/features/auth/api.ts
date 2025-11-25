/**
 * Feature Auth - API
 */

import type { User, UserStorage, CreateUserData } from '@/lib/core/storage';
import type { LoginCredentials, RegisterData, Session, AuthResult } from './types';

/**
 * Genera token mock
 */
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

/**
 * Genera expiry date (7 giorni)
 */
function generateExpiry(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
}

/**
 * Login
 */
export async function login(
  storage: UserStorage,
  credentials: LoginCredentials
): Promise<AuthResult> {
  try {
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Cerca utente per email
    const user = await storage.getByEmail(credentials.email);
    
    if (!user) {
      return {
        success: false,
        error: 'Email o password non corretti',
      };
    }

    // In un sistema reale, verificheremmo la password
    // Per ora accettiamo qualsiasi password per utenti esistenti
    const authenticated = await storage.authenticate(credentials.email, credentials.password);
    
    if (!authenticated) {
      // Se non autentica, proviamo comunque (mock)
      // In produzione questo sarebbe un errore
    }

    const session: Session = {
      user,
      token: generateToken(),
      expiresAt: generateExpiry(),
    };

    return {
      success: true,
      user,
      session,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore durante il login',
    };
  }
}

/**
 * Registrazione
 */
export async function register(
  storage: UserStorage,
  data: RegisterData
): Promise<AuthResult> {
  try {
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // Verifica password match
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: 'Le password non coincidono',
      };
    }

    // Verifica se email già usata
    const existing = await storage.getByEmail(data.email);
    if (existing) {
      return {
        success: false,
        error: 'Email già registrata',
      };
    }

    // Crea utente
    const createData: CreateUserData = {
      email: data.email,
      name: data.name,
      cognome: data.cognome,
      phone: data.phone,
      company: data.company,
      role: 'user',
    };

    const user = await storage.create(createData);

    const session: Session = {
      user,
      token: generateToken(),
      expiresAt: generateExpiry(),
    };

    return {
      success: true,
      user,
      session,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore durante la registrazione',
    };
  }
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  // In un sistema reale, invalideremmo il token sul server
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Verifica sessione
 */
export function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  
  const now = new Date();
  const expiry = new Date(session.expiresAt);
  
  return now < expiry;
}

/**
 * Refresh session
 */
export async function refreshSession(
  storage: UserStorage,
  session: Session
): Promise<AuthResult> {
  try {
    if (!isSessionValid(session)) {
      return {
        success: false,
        error: 'Sessione scaduta',
      };
    }

    // Ricarica user
    const user = await storage.getById(session.user.id);
    if (!user) {
      return {
        success: false,
        error: 'Utente non trovato',
      };
    }

    const newSession: Session = {
      user,
      token: generateToken(),
      expiresAt: generateExpiry(),
    };

    return {
      success: true,
      user,
      session: newSession,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nel refresh',
    };
  }
}


