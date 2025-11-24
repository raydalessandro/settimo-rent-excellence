/**
 * Orders Module - Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, getUserOrders, getAllOrders } from './api';
import type { OrderFormData } from './types';

export function useUserOrders(userId: string | null) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => (userId ? getUserOrders(userId) : []),
    enabled: !!userId,
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: getAllOrders,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      orderData,
    }: {
      userId: string | null;
      orderData: OrderFormData;
    }) => {
      return Promise.resolve(createOrder(userId, orderData));
    },
    onSuccess: (_, variables) => {
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
      }
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] });
    },
  });
}

