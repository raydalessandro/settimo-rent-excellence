/**
 * Quotes Module - API
 * Tutte le operazioni passano dal database centrale
 */

import { useDatabase } from '@/lib/db';
import type { QuoteData } from './types';

export function saveQuote(
  userId: string,
  vehicleId: string,
  data: QuoteData
): string {
  const db = useDatabase.getState();
  const quote = db.addQuote(userId, vehicleId, data);
  return quote.id;
}

export function getUserQuotes(userId: string) {
  const db = useDatabase.getState();
  return db.getQuotesByUser(userId);
}

export function getQuote(quoteId: string) {
  const db = useDatabase.getState();
  return db.getQuote(quoteId);
}

export function deleteQuote(quoteId: string): void {
  const db = useDatabase.getState();
  db.deleteQuote(quoteId);
}

