/**
 * Orders Module - API
 * Tutte le operazioni passano dal database centrale
 */

import { useDatabase } from '@/lib/db';
import type { OrderFormData } from './types';

export function createOrder(
  userId: string | null,
  orderData: OrderFormData
): string {
  const db = useDatabase.getState();
  const order = db.addOrder({
    userId,
    quoteId: orderData.quoteId || null,
    nome: orderData.nome,
    email: orderData.email,
    telefono: orderData.telefono,
    messaggio: orderData.messaggio,
  });
  return order.id;
}

export function getUserOrders(userId: string) {
  const db = useDatabase.getState();
  return db.getOrdersByUser(userId);
}

export function getAllOrders() {
  const db = useDatabase.getState();
  return db.getAllOrders();
}

