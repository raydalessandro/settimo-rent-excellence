/**
 * Feature Checkout - Types
 * Skeleton per futura integrazione Stripe
 */

import type { Quote } from '@/lib/core/storage';

/**
 * Checkout state
 */
export interface CheckoutState {
  step: CheckoutStep;
  quoteId: string | null;
  quote: Quote | null;
  paymentIntentId: string | null;
  clientSecret: string | null;
  isProcessing: boolean;
  error: string | null;
}

export type CheckoutStep = 'review' | 'payment' | 'confirmation';

/**
 * Order status
 */
export type OrderStatus = 
  | 'pending'
  | 'payment_processing'
  | 'payment_failed'
  | 'confirmed'
  | 'cancelled';

/**
 * Order
 */
export interface Order {
  id: string;
  quoteId: string;
  userId: string;
  status: OrderStatus;
  paymentIntentId: string | null;
  amount: number;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  quoteId: string;
  userId: string;
}

/**
 * Payment intent response (mock Stripe)
 */
export interface PaymentIntentResponse {
  id: string;
  clientSecret: string;
  amount: number;
  status: 'requires_payment_method' | 'succeeded' | 'failed';
}

/**
 * Checkout result
 */
export interface CheckoutResult {
  success: boolean;
  order?: Order;
  error?: string;
}


