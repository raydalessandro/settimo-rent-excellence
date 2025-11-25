'use client';

/**
 * Feature Checkout - React Hooks
 * Skeleton per futura integrazione Stripe
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useQuotesStorage } from '@/lib/core/storage';
import { useUser } from '@/lib/features/auth';
import { useTrackConversion } from '@/lib/core/analytics';
import { 
  createOrder, 
  createPaymentIntent, 
  confirmPayment,
  getOrder,
  getUserOrders,
  cancelOrder,
} from './api';
import type { CheckoutState, CheckoutStep, Order } from './types';

/**
 * Hook per checkout flow
 */
export function useCheckout(quoteId: string | null) {
  const user = useUser();
  const router = useRouter();
  const quotesStorage = useQuotesStorage();
  const queryClient = useQueryClient();
  const trackConversion = useTrackConversion();

  const [state, setState] = useState<CheckoutState>({
    step: 'review',
    quoteId,
    quote: null,
    paymentIntentId: null,
    clientSecret: null,
    isProcessing: false,
    error: null,
  });

  // Carica quote
  const quoteQuery = useQuery({
    queryKey: ['quote', quoteId],
    queryFn: () => quotesStorage.getById(quoteId!),
    enabled: !!quoteId,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!user || !quoteId) throw new Error('Dati mancanti');
      return createOrder(quotesStorage, { quoteId, userId: user.id });
    },
    onSuccess: async (result) => {
      if (result.success && result.order) {
        // Crea payment intent
        const pi = await createPaymentIntent(result.order.id, result.order.amount);
        setState(prev => ({
          ...prev,
          step: 'payment',
          paymentIntentId: pi.id,
          clientSecret: pi.clientSecret,
        }));
      } else {
        setState(prev => ({ ...prev, error: result.error || 'Errore' }));
      }
    },
  });

  // Confirm payment mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      if (!state.paymentIntentId) throw new Error('Payment intent mancante');
      return confirmPayment(orderId, state.paymentIntentId);
    },
    onSuccess: (result) => {
      if (result.success && result.order) {
        // Track conversion
        trackConversion({
          conversionType: 'checkout',
          value: result.order.amount,
          quoteId: result.order.quoteId,
        });
        
        setState(prev => ({ ...prev, step: 'confirmation' }));
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      } else {
        setState(prev => ({ ...prev, error: result.error || 'Pagamento fallito' }));
      }
    },
  });

  // Actions
  const startCheckout = useCallback(() => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    createOrderMutation.mutate();
  }, [createOrderMutation]);

  const setStep = useCallback((step: CheckoutStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    step: state.step,
    quote: quoteQuery.data,
    isLoadingQuote: quoteQuery.isLoading,
    clientSecret: state.clientSecret,
    isProcessing: createOrderMutation.isPending || confirmPaymentMutation.isPending,
    error: state.error,
    
    // Actions
    startCheckout,
    confirmPayment: confirmPaymentMutation.mutate,
    setStep,
    clearError,
  };
}

/**
 * Hook per ottenere un ordine
 */
export function useOrder(orderId: string | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  });
}

/**
 * Hook per ottenere ordini utente
 */
export function useUserOrders() {
  const user = useUser();

  return useQuery({
    queryKey: ['orders', 'user', user?.id],
    queryFn: () => getUserOrders(user!.id),
    enabled: !!user,
  });
}

/**
 * Hook per cancellare ordine
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();
  const user = useUser();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'user', user?.id] });
    },
  });
}


