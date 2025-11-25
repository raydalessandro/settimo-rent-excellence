/**
 * Feature Catalog - API
 */

import type { 
  Vehicle, 
  VehicleCategory, 
  VehicleSearchParams, 
  VehicleSearchResult,
  VehicleStorage 
} from '@/lib/core/storage';
import type { CatalogFiltersState, SortOption } from './types';

/**
 * Converte i filtri del catalog in params per lo storage
 */
export function filtersToSearchParams(
  filters: CatalogFiltersState,
  sort: SortOption,
  page: number,
  limit: number
): VehicleSearchParams {
  return {
    filters: {
      marca: filters.marca.length > 0 ? filters.marca : undefined,
      categoria: filters.categoria.length > 0 ? filters.categoria as VehicleCategory[] : undefined,
      fuel: filters.fuel.length > 0 ? filters.fuel as Vehicle['fuel'][] : undefined,
      anticipo_zero: filters.anticipo_zero,
      canone_min: filters.canone_min,
      canone_max: filters.canone_max,
      search: filters.search || undefined,
      disponibile: true,
    },
    sort: sort !== 'relevance' ? sort : undefined,
    page,
    limit,
  };
}

/**
 * Cerca veicoli
 */
export async function searchVehicles(
  storage: VehicleStorage,
  filters: CatalogFiltersState,
  sort: SortOption = 'relevance',
  page: number = 1,
  limit: number = 12
): Promise<VehicleSearchResult> {
  const params = filtersToSearchParams(filters, sort, page, limit);
  return storage.search(params);
}

/**
 * Ottiene tutti i brand disponibili
 */
export async function getBrands(storage: VehicleStorage): Promise<string[]> {
  return storage.getBrands();
}

/**
 * Ottiene tutte le categorie disponibili
 */
export async function getCategories(storage: VehicleStorage): Promise<VehicleCategory[]> {
  return storage.getCategories();
}

/**
 * Ottiene veicoli in evidenza
 */
export async function getFeaturedVehicles(
  storage: VehicleStorage,
  limit: number = 8
): Promise<Vehicle[]> {
  return storage.getFeatured(limit);
}

/**
 * Ottiene veicoli per marca
 */
export async function getVehiclesByBrand(
  storage: VehicleStorage,
  brand: string
): Promise<Vehicle[]> {
  const result = await storage.search({
    filters: { marca: [brand], disponibile: true },
    limit: 100,
  });
  return result.vehicles;
}

/**
 * Conta veicoli per filtri
 */
export async function countVehicles(
  storage: VehicleStorage,
  filters: CatalogFiltersState
): Promise<number> {
  const result = await searchVehicles(storage, filters, 'relevance', 1, 1);
  return result.total;
}


