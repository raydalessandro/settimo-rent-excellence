'use client';

/**
 * Feature User - Quotes Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuotesStorage } from '@/lib/core/storage';
import { useUser } from '@/lib/features/auth';
import { getUserQuotes, getQuoteById, deleteQuote, updateQuoteStatus } from './api';
import type { Quote } from '@/lib/core/storage';

/**
 * Hook per ottenere i preventivi dell'utente
 */
export function useUserQuotes() {
  const user = useUser();
  const storage = useQuotesStorage();

  return useQuery({
    queryKey: ['quotes', 'user', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return getUserQuotes(storage, user.id);
    },
    enabled: !!user,
  });
}

/**
 * Hook per ottenere un singolo preventivo
 */
export function useQuote(quoteId: string | null) {
  const storage = useQuotesStorage();

  return useQuery({
    queryKey: ['quote', quoteId],
    queryFn: async () => {
      if (!quoteId) return null;
      return getQuoteById(storage, quoteId);
    },
    enabled: !!quoteId,
  });
}

/**
 * Hook per eliminare un preventivo
 */
export function useDeleteQuote() {
  const user = useUser();
  const storage = useQuotesStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string) => {
      return deleteQuote(storage, quoteId);
    },
    onSuccess: (_, quoteId) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', 'user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] });
    },
  });
}

/**
 * Hook per aggiornare stato preventivo
 */
export function useUpdateQuoteStatus() {
  const user = useUser();
  const storage = useQuotesStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quoteId, status }: { quoteId: string; status: Quote['status'] }) => {
      return updateQuoteStatus(storage, quoteId, status);
    },
    onSuccess: (_, { quoteId }) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', 'user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] });
    },
  });
}

/**
 * Hook per contare i preventivi
 */
export function useQuotesCount() {
  const { data: quotes } = useUserQuotes();
  return quotes?.length || 0;
}


