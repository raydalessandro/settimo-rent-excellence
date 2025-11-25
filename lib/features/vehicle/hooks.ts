'use client';

/**
 * Feature Vehicle - React Hooks
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useVehicleStorage } from '@/lib/core/storage';
import { useTrackVehicleView } from '@/lib/core/analytics';
import { 
  getVehicleById, 
  getVehicleBySlug, 
  getSimilarVehicles,
  getVehiclesByBrand,
  getVehiclesByCategory,
} from './api';
import { extractSpecs, createGallery, type VehicleSpecs, type VehicleGalleryImage } from './types';

/**
 * Hook per ottenere un veicolo per ID
 */
export function useVehicle(id: string | null) {
  const storage = useVehicleStorage();
  const trackView = useTrackVehicleView();

  const query = useQuery({
    queryKey: ['vehicle', 'id', id],
    queryFn: async () => {
      if (!id) return null;
      const vehicle = await getVehicleById(storage, id);
      if (vehicle) {
        trackView(vehicle);
      }
      return vehicle;
    },
    enabled: !!id,
  });

  return query;
}

/**
 * Hook per ottenere un veicolo per slug
 */
export function useVehicleBySlug(slug: string | null) {
  const storage = useVehicleStorage();
  const trackView = useTrackVehicleView();

  const query = useQuery({
    queryKey: ['vehicle', 'slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      const vehicle = await getVehicleBySlug(storage, slug);
      if (vehicle) {
        trackView(vehicle);
      }
      return vehicle;
    },
    enabled: !!slug,
  });

  return query;
}

/**
 * Hook per ottenere specifiche raggruppate
 */
export function useVehicleSpecs(vehicleId: string | null): {
  specs: VehicleSpecs | null;
  isLoading: boolean;
} {
  const { data: vehicle, isLoading } = useVehicle(vehicleId);

  const specs = useMemo(() => {
    if (!vehicle) return null;
    return extractSpecs(vehicle);
  }, [vehicle]);

  return { specs, isLoading };
}

/**
 * Hook per ottenere gallery
 */
export function useVehicleGallery(vehicleId: string | null): {
  gallery: VehicleGalleryImage[];
  isLoading: boolean;
} {
  const { data: vehicle, isLoading } = useVehicle(vehicleId);

  const gallery = useMemo(() => {
    if (!vehicle) return [];
    return createGallery(vehicle);
  }, [vehicle]);

  return { gallery, isLoading };
}

/**
 * Hook per veicoli simili
 */
export function useSimilarVehicles(vehicleId: string | null, limit: number = 4) {
  const storage = useVehicleStorage();
  const { data: vehicle } = useVehicle(vehicleId);

  return useQuery({
    queryKey: ['vehicle', 'similar', vehicleId, limit],
    queryFn: async () => {
      if (!vehicle) return [];
      return getSimilarVehicles(storage, vehicle, limit);
    },
    enabled: !!vehicle,
  });
}

/**
 * Hook per veicoli della stessa marca
 */
export function useVehiclesByBrand(brand: string | null, excludeId?: string, limit: number = 4) {
  const storage = useVehicleStorage();

  return useQuery({
    queryKey: ['vehicles', 'brand', brand, excludeId, limit],
    queryFn: async () => {
      if (!brand) return [];
      return getVehiclesByBrand(storage, brand, excludeId, limit);
    },
    enabled: !!brand,
  });
}

/**
 * Hook per veicoli della stessa categoria
 */
export function useVehiclesByCategory(category: string | null, excludeId?: string, limit: number = 4) {
  const storage = useVehicleStorage();

  return useQuery({
    queryKey: ['vehicles', 'category', category, excludeId, limit],
    queryFn: async () => {
      if (!category) return [];
      return getVehiclesByCategory(storage, category, excludeId, limit);
    },
    enabled: !!category,
  });
}

/**
 * Hook completo per pagina dettaglio veicolo
 */
export function useVehicleDetail(slugOrId: string | null, isSlug: boolean = true) {
  const storage = useVehicleStorage();
  const trackView = useTrackVehicleView();

  // Carica veicolo
  const vehicleQuery = useQuery({
    queryKey: ['vehicle', isSlug ? 'slug' : 'id', slugOrId],
    queryFn: async () => {
      if (!slugOrId) return null;
      const vehicle = isSlug 
        ? await getVehicleBySlug(storage, slugOrId)
        : await getVehicleById(storage, slugOrId);
      if (vehicle) {
        trackView(vehicle);
      }
      return vehicle;
    },
    enabled: !!slugOrId,
  });

  // Carica veicoli simili
  const similarQuery = useQuery({
    queryKey: ['vehicle', 'similar', vehicleQuery.data?.id],
    queryFn: async () => {
      if (!vehicleQuery.data) return [];
      return getSimilarVehicles(storage, vehicleQuery.data, 4);
    },
    enabled: !!vehicleQuery.data,
  });

  // Prepara dati derivati
  const specs = useMemo(() => {
    if (!vehicleQuery.data) return null;
    return extractSpecs(vehicleQuery.data);
  }, [vehicleQuery.data]);

  const gallery = useMemo(() => {
    if (!vehicleQuery.data) return [];
    return createGallery(vehicleQuery.data);
  }, [vehicleQuery.data]);

  return {
    vehicle: vehicleQuery.data,
    isLoading: vehicleQuery.isLoading,
    error: vehicleQuery.error,
    specs,
    gallery,
    similar: similarQuery.data || [],
    isLoadingSimilar: similarQuery.isLoading,
  };
}


