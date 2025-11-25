/**
 * Feature User - Profile API
 */

import type { User, UserStorage } from '@/lib/core/storage';

/**
 * Ottiene il profilo utente
 */
export async function getProfile(
  storage: UserStorage,
  userId: string
): Promise<User | null> {
  return storage.getById(userId);
}

/**
 * Aggiorna il profilo utente
 */
export async function updateProfile(
  storage: UserStorage,
  userId: string,
  data: Partial<User>
): Promise<User> {
  return storage.update(userId, data);
}


