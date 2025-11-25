/**
 * Feature User - Quotes API
 */

import type { Quote, QuotesStorage } from '@/lib/core/storage';

/**
 * Ottiene i preventivi dell'utente
 */
export async function getUserQuotes(
  storage: QuotesStorage,
  userId: string
): Promise<Quote[]> {
  return storage.getByUser(userId);
}

/**
 * Ottiene un preventivo per ID
 */
export async function getQuoteById(
  storage: QuotesStorage,
  quoteId: string
): Promise<Quote | null> {
  return storage.getById(quoteId);
}

/**
 * Elimina un preventivo
 */
export async function deleteQuote(
  storage: QuotesStorage,
  quoteId: string
): Promise<void> {
  return storage.delete(quoteId);
}

/**
 * Aggiorna stato preventivo
 */
export async function updateQuoteStatus(
  storage: QuotesStorage,
  quoteId: string,
  status: Quote['status']
): Promise<Quote> {
  return storage.update(quoteId, { status });
}


