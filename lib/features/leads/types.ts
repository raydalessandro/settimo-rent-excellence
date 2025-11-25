/**
 * Feature Leads - Types
 * Types sono già definiti in core/storage, qui esportiamo e aggiungiamo helpers
 */

// Re-export da storage
export type {
  Lead,
  LeadStatus,
  LeadSource,
  FunnelStep,
  CreateLeadData,
} from '@/lib/core/storage';

/**
 * Form data per creazione lead
 */
export interface LeadFormData {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  azienda?: string;
  partitaIva?: string;
  messaggio?: string;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

/**
 * Lead form con contesto
 */
export interface LeadFormContext {
  vehicleId?: string;
  quoteId?: string;
  funnelStep: import('@/lib/core/storage').FunnelStep;
}

/**
 * Risultato creazione lead
 */
export interface CreateLeadResult {
  success: boolean;
  lead?: import('@/lib/core/storage').Lead;
  error?: string;
}

/**
 * Labels per status
 */
export const LEAD_STATUS_LABELS: Record<import('@/lib/core/storage').LeadStatus, string> = {
  new: 'Nuovo',
  contacted: 'Contattato',
  qualified: 'Qualificato',
  won: 'Chiuso - Vinto',
  lost: 'Chiuso - Perso',
};

/**
 * Colori per status
 */
export const LEAD_STATUS_COLORS: Record<import('@/lib/core/storage').LeadStatus, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-purple-500',
  won: 'bg-green-500',
  lost: 'bg-red-500',
};

/**
 * Labels per source
 */
export const LEAD_SOURCE_LABELS: Record<import('@/lib/core/storage').LeadSource, string> = {
  instagram_ads: 'Instagram Ads',
  instagram_bio: 'Instagram Bio',
  facebook_ads: 'Facebook Ads',
  google_ads: 'Google Ads',
  google_organic: 'Google Organic',
  direct: 'Diretto',
  referral: 'Referral',
  whatsapp: 'WhatsApp',
  unknown: 'Sconosciuto',
};


