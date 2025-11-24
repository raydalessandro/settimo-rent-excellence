/**
 * Orders Module - Types
 */

export interface Order {
  id: string;
  userId: string | null;
  quoteId: string | null;
  nome: string;
  email: string;
  telefono: string;
  messaggio?: string;
  createdAt: string;
}

export interface OrderFormData {
  nome: string;
  email: string;
  telefono: string;
  messaggio?: string;
  quoteId?: string;
}

