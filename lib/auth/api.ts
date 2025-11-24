/**
 * Auth Module - API (Mock)
 * Simula chiamate API per login/registrazione
 */

import { useDatabase } from '@/lib/db';
import type { LoginCredentials, RegisterData } from './types';

// Mock password storage (in produzione usare hash)
const mockPasswords = new Map<string, string>();

export async function loginUser(credentials: LoginCredentials) {
  // Simula delay API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const db = useDatabase.getState();
  const user = db.getUserByEmail(credentials.email);

  if (!user) {
    throw new Error('Email non trovata');
  }

  // Verifica password (mock)
  const storedPassword = mockPasswords.get(user.id);
  if (!storedPassword || storedPassword !== credentials.password) {
    throw new Error('Password errata');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(data: RegisterData) {
  // Simula delay API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const db = useDatabase.getState();

  // Verifica email esistente
  if (db.getUserByEmail(data.email)) {
    throw new Error('Email già registrata');
  }

  // Verifica password match
  if (data.password !== data.confirmPassword) {
    throw new Error('Le password non corrispondono');
  }

  // Crea utente
  const newUser = db.addUser({
    name: data.name,
    email: data.email,
    role: 'user',
  });

  // Salva password (mock - in produzione usare hash)
  mockPasswords.set(newUser.id, data.password);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
}

