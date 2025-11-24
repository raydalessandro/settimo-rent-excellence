/**
 * Quotes Module - Types
 */

import type { QuoteData as DBQuoteData } from '@/lib/db';

export interface SavedQuote {
  id: string;
  userId: string;
  vehicleId: string;
  data: DBQuoteData;
  createdAt: string;
}

export type QuoteData = DBQuoteData;
