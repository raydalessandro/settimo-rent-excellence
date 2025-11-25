'use client';

/**
 * Feature User - Favorites Hooks
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFavoritesStorage, useVehicleStorage } from '@/lib/core/storage';
import { useUser } from '@/lib/features/auth';
import { 
  getFavorites, 
  isFavorite, 
  countFavorites, 
  toggleFavorite,
  addFavorite,
  removeFavorite,
} from './api';
import type { Vehicle } from '@/lib/core/storage';

/**
 * Hook per ottenere i preferiti dell'utente
 */
export function useFavorites() {
  const user = useUser();
  const favoritesStorage = useFavoritesStorage();
  const vehicleStorage = useVehicleStorage();

  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const favorites = await getFavorites(favoritesStorage, user.id);
      
      // Carica i veicoli corrispondenti
      const vehicles = await Promise.all(
        favorites.map(async (fav) => {
          const vehicle = await vehicleStorage.getById(fav.vehicleId);
          return vehicle;
        })
      );
      
      return vehicles.filter((v): v is Vehicle => v !== null);
    },
    enabled: !!user,
  });
}

/**
 * Hook per verificare se un veicolo è nei preferiti
 */
export function useFavoriteStatus(vehicleId: string | null) {
  const user = useUser();
  const storage = useFavoritesStorage();

  return useQuery({
    queryKey: ['favorite', user?.id, vehicleId],
    queryFn: async () => {
      if (!user || !vehicleId) return false;
      return isFavorite(storage, user.id, vehicleId);
    },
    enabled: !!user && !!vehicleId,
  });
}

/**
 * Hook per contare i preferiti
 */
export function useFavoritesCount() {
  const user = useUser();
  const storage = useFavoritesStorage();

  return useQuery({
    queryKey: ['favorites', 'count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      return countFavorites(storage, user.id);
    },
    enabled: !!user,
  });
}

/**
 * Hook per toggle preferito
 */
export function useToggleFavorite() {
  const user = useUser();
  const storage = useFavoritesStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, isCurrentlyFavorite }: { vehicleId: string; isCurrentlyFavorite: boolean }) => {
      if (!user) throw new Error('Utente non autenticato');
      return toggleFavorite(storage, user.id, vehicleId, isCurrentlyFavorite);
    },
    onSuccess: (_, { vehicleId }) => {
      // Invalida le query correlate
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorite', user?.id, vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'count', user?.id] });
    },
  });
}

/**
 * Hook per aggiungere ai preferiti
 */
export function useAddFavorite() {
  const user = useUser();
  const storage = useFavoritesStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleId: string) => {
      if (!user) throw new Error('Utente non autenticato');
      return addFavorite(storage, user.id, vehicleId);
    },
    onSuccess: (_, vehicleId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorite', user?.id, vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'count', user?.id] });
    },
  });
}

/**
 * Hook per rimuovere dai preferiti
 */
export function useRemoveFavorite() {
  const user = useUser();
  const storage = useFavoritesStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleId: string) => {
      if (!user) throw new Error('Utente non autenticato');
      return removeFavorite(storage, user.id, vehicleId);
    },
    onSuccess: (_, vehicleId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorite', user?.id, vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'count', user?.id] });
    },
  });
}


