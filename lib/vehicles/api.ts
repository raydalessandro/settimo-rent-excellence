/**
 * Vehicles Module - API (Mock)
 */

// @ts-ignore - JSON import
import vehiclesData from '@/data/vehicles.json';
import type { Vehicle, VehicleFilters } from './types';

export async function getAllVehicles(): Promise<Vehicle[]> {
  // Simula delay API
  await new Promise((resolve) => setTimeout(resolve, 300));
  return vehiclesData.vehicles as Vehicle[];
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const vehicle = vehiclesData.vehicles.find((v) => v.id === id);
  if (!vehicle) {
    // Debug: verifica se l'ID è codificato
    const decodedId = decodeURIComponent(id);
    const vehicleDecoded = vehiclesData.vehicles.find((v) => v.id === decodedId);
    return (vehicleDecoded as Vehicle) || null;
  }
  return (vehicle as Vehicle) || null;
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return vehiclesData.vehicles
    .filter((v) => v.in_evidenza)
    .slice(0, 8) as Vehicle[];
}

export async function searchVehicles(filters: VehicleFilters): Promise<Vehicle[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let results = vehiclesData.vehicles as Vehicle[];

  if (filters.marca && filters.marca.length > 0) {
    results = results.filter((v) => filters.marca!.includes(v.marca));
  }

  if (filters.categoria && filters.categoria.length > 0) {
    results = results.filter((v) => filters.categoria!.includes(v.categoria));
  }

  if (filters.fuel && filters.fuel.length > 0) {
    results = results.filter((v) => filters.fuel!.includes(v.fuel));
  }

  if (filters.anticipo_zero !== undefined) {
    results = results.filter((v) => v.anticipo_zero === filters.anticipo_zero);
  }

  if (filters.canone_min !== undefined) {
    results = results.filter((v) => v.canone_base >= filters.canone_min!);
  }

  if (filters.canone_max !== undefined) {
    results = results.filter((v) => v.canone_base <= filters.canone_max!);
  }

  if (filters.disponibile !== undefined) {
    results = results.filter((v) => v.disponibile === filters.disponibile);
  }

  return results;
}

export async function getVehiclesByBrand(brand: string): Promise<Vehicle[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return vehiclesData.vehicles.filter((v) => v.marca === brand) as Vehicle[];
}

