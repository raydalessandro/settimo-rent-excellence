'use client';

/**
 * Feature User - Profile Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStorage } from '@/lib/core/storage';
import { useUser } from '@/lib/features/auth';
import { useAuthStore } from '@/lib/features/auth/store';
import { getProfile, updateProfile } from './api';
import type { User } from '@/lib/core/storage';

/**
 * Hook per ottenere il profilo utente
 */
export function useProfile() {
  const user = useUser();
  const storage = useUserStorage();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      return getProfile(storage, user.id);
    },
    enabled: !!user,
  });
}

/**
 * Hook per aggiornare il profilo
 */
export function useUpdateProfile() {
  const user = useUser();
  const storage = useUserStorage();
  const queryClient = useQueryClient();
  const setUser = useAuthStore(state => state.setUser);

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      if (!user) throw new Error('Utente non autenticato');
      return updateProfile(storage, user.id, data);
    },
    onSuccess: (updatedUser) => {
      // Aggiorna cache
      queryClient.setQueryData(['profile', user?.id], updatedUser);
      // Aggiorna store auth
      setUser(updatedUser);
    },
  });
}


