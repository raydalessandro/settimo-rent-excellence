/**
 * Core Analytics - Types
 * Tipi per tracking eventi e analytics
 */

import type { FunnelStep, LeadSource } from '@/lib/core/storage';

/**
 * Nome eventi tracciati
 */
export type AnalyticsEventName = 
  | 'page_view'
  | 'catalog_search'
  | 'vehicle_view'
  | 'configurator_start'
  | 'configurator_progress'
  | 'quote_generated'
  | 'lead_submitted'
  | 'checkout_started'
  | 'conversion'
  | 'whatsapp_click'
  | 'cta_click'
  | 'error';

/**
 * Payload base per tutti gli eventi
 */
export interface BaseEventPayload {
  // Timestamp
  timestamp: string;
  
  // Sessione
  sessionId: string;
  
  // Funnel
  funnelStep: FunnelStep;
  
  // Attribution
  source?: LeadSource;
  utmCampaign?: string | null;
  utmMedium?: string | null;
  utmSource?: string | null;
}

/**
 * Payload per page_view
 */
export interface PageViewPayload extends BaseEventPayload {
  path: string;
  title: string;
  referrer?: string;
}

/**
 * Payload per catalog_search
 */
export interface CatalogSearchPayload extends BaseEventPayload {
  query?: string;
  filters?: Record<string, unknown>;
  resultsCount: number;
}

/**
 * Payload per vehicle_view
 */
export interface VehicleViewPayload extends BaseEventPayload {
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleCategory: string;
  canone: number;
  canoneRange: string;
}

/**
 * Payload per configurator_progress
 */
export interface ConfiguratorProgressPayload extends BaseEventPayload {
  vehicleId: string;
  vehicleBrand: string;
  step: number;
  stepName: string;
  durata?: number;
  kmAnno?: number;
  servizi?: string[];
}

/**
 * Payload per quote_generated
 */
export interface QuoteGeneratedPayload extends BaseEventPayload {
  quoteId: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleCategory: string;
  durata: number;
  kmAnno: number;
  canone: number;
  canoneRange: string;
  servizi: string[];
  totale: number;
}

/**
 * Payload per lead_submitted
 */
export interface LeadSubmittedPayload extends BaseEventPayload {
  leadId: string;
  vehicleId?: string;
  quoteId?: string;
  funnelStepOrigin: FunnelStep;
  hasCompany: boolean;
  marketingAccepted: boolean;
}

/**
 * Payload per conversion
 */
export interface ConversionPayload extends BaseEventPayload {
  conversionType: 'lead' | 'checkout' | 'callback';
  value?: number;
  quoteId?: string;
  leadId?: string;
}

/**
 * Payload per CTA click
 */
export interface CTAClickPayload extends BaseEventPayload {
  ctaId: string;
  ctaText: string;
  ctaLocation: string;
  vehicleId?: string;
}

/**
 * Payload per errori
 */
export interface ErrorPayload extends BaseEventPayload {
  errorCode: string;
  errorMessage: string;
  errorContext?: string;
}

/**
 * Union type di tutti i payload
 */
export type AnalyticsEventPayload = 
  | PageViewPayload
  | CatalogSearchPayload
  | VehicleViewPayload
  | ConfiguratorProgressPayload
  | QuoteGeneratedPayload
  | LeadSubmittedPayload
  | ConversionPayload
  | CTAClickPayload
  | ErrorPayload
  | BaseEventPayload;

/**
 * Evento completo
 */
export interface AnalyticsEvent {
  name: AnalyticsEventName;
  payload: AnalyticsEventPayload;
}

/**
 * Configurazione analytics provider
 */
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  gaMeasurementId?: string;
  // Futuro: mixpanel, segment, etc.
}

/**
 * Interfaccia per analytics adapter
 * (per integrare GA4, Mixpanel, etc.)
 */
export interface AnalyticsAdapter {
  name: string;
  initialize(): Promise<void>;
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(payload: PageViewPayload): void;
}


