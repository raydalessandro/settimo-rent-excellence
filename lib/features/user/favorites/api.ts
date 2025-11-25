/**
 * Feature User - Favorites API
 */

import type { Favorite, FavoritesStorage, VehicleStorage } from '@/lib/core/storage';

/**
 * Aggiunge un veicolo ai preferiti
 */
export async function addFavorite(
  storage: FavoritesStorage,
  userId: string,
  vehicleId: string
): Promise<Favorite> {
  return storage.add(userId, vehicleId);
}

/**
 * Rimuove un veicolo dai preferiti
 */
export async function removeFavorite(
  storage: FavoritesStorage,
  userId: string,
  vehicleId: string
): Promise<void> {
  return storage.remove(userId, vehicleId);
}

/**
 * Toggle preferito
 */
export async function toggleFavorite(
  storage: FavoritesStorage,
  userId: string,
  vehicleId: string,
  isCurrentlyFavorite: boolean
): Promise<boolean> {
  if (isCurrentlyFavorite) {
    await storage.remove(userId, vehicleId);
    return false;
  } else {
    await storage.add(userId, vehicleId);
    return true;
  }
}

/**
 * Ottiene tutti i preferiti dell'utente
 */
export async function getFavorites(
  storage: FavoritesStorage,
  userId: string
): Promise<Favorite[]> {
  return storage.getByUser(userId);
}

/**
 * Verifica se un veicolo è nei preferiti
 */
export async function isFavorite(
  storage: FavoritesStorage,
  userId: string,
  vehicleId: string
): Promise<boolean> {
  return storage.isFavorite(userId, vehicleId);
}

/**
 * Conta i preferiti dell'utente
 */
export async function countFavorites(
  storage: FavoritesStorage,
  userId: string
): Promise<number> {
  return storage.count(userId);
}


