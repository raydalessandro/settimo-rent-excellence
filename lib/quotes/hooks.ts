'use client';

/**
 * @deprecated Use '@/lib/features/user' instead
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuotesStorage } from '@/lib/core/storage';
import { useUser } from '@/lib/features/auth';

export { 
  useUserQuotes,
  useQuote,
  useDeleteQuote,
} from '@/lib/features/user';

/**
 * Hook per salvare un preventivo
 * Backward compatibility wrapper
 */
export function useSaveQuote() {
  const user = useUser();
  const storage = useQuotesStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userId: string; vehicleId: string; data: any }) => {
      // Crea un nuovo quote nello storage
      const quote = await storage.create({
        userId: data.userId,
        vehicleId: data.vehicleId,
        vehicle: data.data.vehicle || {
          id: data.vehicleId,
          slug: '',
          marca: '',
          modello: '',
          versione: '',
          immagine: '',
        },
        params: data.data.params || {},
        pricing: data.data.pricing || {},
        servizi: data.data.servizi || [],
        status: 'draft',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      return quote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes', 'user', user?.id] });
    },
  });
}
