/**
 * Quotes Module - Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saveQuote, getUserQuotes, getQuote, deleteQuote } from './api';
import type { QuoteData } from './types';

export function useUserQuotes(userId: string | null) {
  return useQuery({
    queryKey: ['quotes', userId],
    queryFn: () => (userId ? getUserQuotes(userId) : []),
    enabled: !!userId,
  });
}

export function useQuote(quoteId: string | null) {
  return useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => (quoteId ? getQuote(quoteId) : null),
    enabled: !!quoteId,
  });
}

export function useSaveQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      vehicleId,
      data,
    }: {
      userId: string;
      vehicleId: string;
      data: QuoteData;
    }) => {
      return Promise.resolve(saveQuote(userId, vehicleId, data));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', variables.userId] });
    },
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string) => {
      deleteQuote(quoteId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}

