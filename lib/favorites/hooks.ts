/**
 * Favorites Module - Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFavoriteVehicles,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavoritesCount,
} from './api';

export function useFavoriteVehicles(userId: string | null) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavoriteVehicles(userId!),
    enabled: !!userId,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      vehicleId,
      isCurrentlyFavorite,
    }: {
      userId: string;
      vehicleId: string;
      isCurrentlyFavorite: boolean;
    }) => {
      if (isCurrentlyFavorite) {
        removeFavorite(userId, vehicleId);
      } else {
        addFavorite(userId, vehicleId);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'count', variables.userId] });
    },
  });
}

export function useFavoriteStatus(userId: string | null, vehicleId: string) {
  return useQuery({
    queryKey: ['favorites', 'status', userId, vehicleId],
    queryFn: () => (userId ? isFavorite(userId, vehicleId) : false),
    enabled: !!userId && !!vehicleId,
  });
}

export function useFavoritesCount(userId: string | null) {
  return useQuery({
    queryKey: ['favorites', 'count', userId],
    queryFn: () => (userId ? getFavoritesCount(userId) : 0),
    enabled: !!userId,
  });
}

