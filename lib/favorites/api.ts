/**
 * Favorites Module - API
 * Tutte le operazioni passano dal database centrale
 */

import { useDatabase } from '@/lib/db';
import { getVehicleById } from '@/lib/vehicles/api';
import type { Vehicle } from '@/lib/vehicles/types';

export async function getFavoriteVehicles(userId: string): Promise<Vehicle[]> {
  const db = useDatabase.getState();
  const favorites = db.getFavoritesByUser(userId);
  
  const vehicles = await Promise.all(
    favorites.map((fav) => getVehicleById(fav.vehicleId))
  );
  
  return vehicles.filter((v): v is Vehicle => v !== null);
}

export function addFavorite(userId: string, vehicleId: string): void {
  const db = useDatabase.getState();
  db.addFavorite(userId, vehicleId);
}

export function removeFavorite(userId: string, vehicleId: string): void {
  const db = useDatabase.getState();
  db.removeFavorite(userId, vehicleId);
}

export function isFavorite(userId: string, vehicleId: string): boolean {
  const db = useDatabase.getState();
  return db.isFavorite(userId, vehicleId);
}

export function getFavoritesCount(userId: string): number {
  const db = useDatabase.getState();
  return db.getFavoritesByUser(userId).length;
}

