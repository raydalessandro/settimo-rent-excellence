/**
 * Feature Vehicle - API
 */

import type { Vehicle, VehicleStorage } from '@/lib/core/storage';
import type { SimilarVehicle } from './types';
import { toSimilarVehicle } from './types';

/**
 * Ottiene un veicolo per ID
 */
export async function getVehicleById(
  storage: VehicleStorage,
  id: string
): Promise<Vehicle | null> {
  return storage.getById(id);
}

/**
 * Ottiene un veicolo per slug
 */
export async function getVehicleBySlug(
  storage: VehicleStorage,
  slug: string
): Promise<Vehicle | null> {
  return storage.getBySlug(slug);
}

/**
 * Ottiene veicoli simili
 * Logica: stessa categoria, stessa fascia di prezzo (±30%)
 */
export async function getSimilarVehicles(
  storage: VehicleStorage,
  vehicle: Vehicle,
  limit: number = 4
): Promise<SimilarVehicle[]> {
  // Cerca veicoli della stessa categoria
  const result = await storage.search({
    filters: {
      categoria: [vehicle.categoria],
      disponibile: true,
    },
    limit: 20,
  });

  // Filtra per fascia di prezzo simile e escludi il veicolo corrente
  const priceMin = vehicle.canone_base * 0.7;
  const priceMax = vehicle.canone_base * 1.3;

  const similar = result.vehicles
    .filter(v => 
      v.id !== vehicle.id &&
      v.canone_base >= priceMin &&
      v.canone_base <= priceMax
    )
    .slice(0, limit)
    .map(toSimilarVehicle);

  // Se non abbiamo abbastanza veicoli simili, aggiungi dalla stessa marca
  if (similar.length < limit) {
    const sameBrand = result.vehicles
      .filter(v => 
        v.id !== vehicle.id &&
        v.marca === vehicle.marca &&
        !similar.find(s => s.id === v.id)
      )
      .slice(0, limit - similar.length)
      .map(toSimilarVehicle);
    
    similar.push(...sameBrand);
  }

  return similar.slice(0, limit);
}

/**
 * Ottiene veicoli della stessa marca
 */
export async function getVehiclesByBrand(
  storage: VehicleStorage,
  brand: string,
  excludeId?: string,
  limit: number = 4
): Promise<SimilarVehicle[]> {
  const result = await storage.search({
    filters: {
      marca: [brand],
      disponibile: true,
    },
    limit: limit + 1, // +1 per eventuale esclusione
  });

  return result.vehicles
    .filter(v => v.id !== excludeId)
    .slice(0, limit)
    .map(toSimilarVehicle);
}

/**
 * Ottiene veicoli della stessa categoria
 */
export async function getVehiclesByCategory(
  storage: VehicleStorage,
  category: string,
  excludeId?: string,
  limit: number = 4
): Promise<SimilarVehicle[]> {
  const result = await storage.search({
    filters: {
      categoria: [category as Vehicle['categoria']],
      disponibile: true,
    },
    limit: limit + 1,
  });

  return result.vehicles
    .filter(v => v.id !== excludeId)
    .slice(0, limit)
    .map(toSimilarVehicle);
}


