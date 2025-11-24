/**
 * Vehicles Module - Hooks
 */

import { useQuery } from '@tanstack/react-query';
import {
  getAllVehicles,
  getVehicleById,
  getFeaturedVehicles,
  searchVehicles,
  getVehiclesByBrand,
} from './api';
import type { VehicleFilters } from './types';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: getAllVehicles,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id),
    enabled: !!id,
  });
}

export function useFeaturedVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'featured'],
    queryFn: getFeaturedVehicles,
  });
}

export function useSearchVehicles(filters: VehicleFilters) {
  return useQuery({
    queryKey: ['vehicles', 'search', filters],
    queryFn: () => searchVehicles(filters),
  });
}

export function useVehiclesByBrand(brand: string) {
  return useQuery({
    queryKey: ['vehicles', 'brand', brand],
    queryFn: () => getVehiclesByBrand(brand),
    enabled: !!brand,
  });
}

