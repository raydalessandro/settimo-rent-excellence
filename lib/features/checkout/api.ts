/**
 * Feature Checkout - API
 * Mock implementation - will be replaced with real Stripe integration
 */

import type { Quote, QuotesStorage } from '@/lib/core/storage';
import type { 
  Order, 
  CreateOrderRequest, 
  PaymentIntentResponse, 
  CheckoutResult 
} from './types';

// Mock storage for orders (in memory)
const orders: Map<string, Order> = new Map();

/**
 * Genera ID ordine
 */
function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Crea un ordine
 */
export async function createOrder(
  quotesStorage: QuotesStorage,
  request: CreateOrderRequest
): Promise<CheckoutResult> {
  try {
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Verifica quote
    const quote = await quotesStorage.getById(request.quoteId);
    if (!quote) {
      return {
        success: false,
        error: 'Preventivo non trovato',
      };
    }

    // Crea ordine
    const now = new Date().toISOString();
    const order: Order = {
      id: generateOrderId(),
      quoteId: request.quoteId,
      userId: request.userId,
      status: 'pending',
      paymentIntentId: null,
      amount: quote.pricing.totale * quote.params.durata,
      createdAt: now,
      updatedAt: now,
      confirmedAt: null,
    };

    orders.set(order.id, order);

    return {
      success: true,
      order,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nella creazione ordine',
    };
  }
}

/**
 * Crea Payment Intent (mock Stripe)
 */
export async function createPaymentIntent(
  orderId: string,
  amount: number
): Promise<PaymentIntentResponse> {
  // Simula chiamata Stripe
  await new Promise(resolve => setTimeout(resolve, 500));

  const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 16)}`;

  // Aggiorna ordine
  const order = orders.get(orderId);
  if (order) {
    order.paymentIntentId = paymentIntentId;
    order.status = 'payment_processing';
    order.updatedAt = new Date().toISOString();
    orders.set(orderId, order);
  }

  return {
    id: paymentIntentId,
    clientSecret,
    amount,
    status: 'requires_payment_method',
  };
}

/**
 * Conferma pagamento (mock)
 */
export async function confirmPayment(
  orderId: string,
  paymentIntentId: string
): Promise<CheckoutResult> {
  try {
    // Simula conferma Stripe
    await new Promise(resolve => setTimeout(resolve, 500));

    const order = orders.get(orderId);
    if (!order) {
      return {
        success: false,
        error: 'Ordine non trovato',
      };
    }

    // Simula successo (80%) o fallimento (20%)
    const success = Math.random() > 0.2;

    if (success) {
      order.status = 'confirmed';
      order.confirmedAt = new Date().toISOString();
    } else {
      order.status = 'payment_failed';
    }
    
    order.updatedAt = new Date().toISOString();
    orders.set(orderId, order);

    return success
      ? { success: true, order }
      : { success: false, error: 'Pagamento fallito' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nel pagamento',
    };
  }
}

/**
 * Ottiene ordine per ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return orders.get(orderId) || null;
}

/**
 * Ottiene ordini utente
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return Array.from(orders.values())
    .filter(order => order.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Cancella ordine
 */
export async function cancelOrder(orderId: string): Promise<CheckoutResult> {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));

    const order = orders.get(orderId);
    if (!order) {
      return { success: false, error: 'Ordine non trovato' };
    }

    if (order.status === 'confirmed') {
      return { success: false, error: 'Impossibile cancellare un ordine confermato' };
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    orders.set(orderId, order);

    return { success: true, order };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nella cancellazione',
    };
  }
}


