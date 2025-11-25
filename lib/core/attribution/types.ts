/**
 * Core Attribution - Types
 * Tipi per tracking attribution e UTM params
 */

import type { LeadSource, FunnelStep } from '@/lib/core/storage';

/**
 * UTM Parameters
 */
export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

/**
 * Attribution data completa
 */
export interface Attribution {
  // Source identificata
  source: LeadSource;
  
  // UTM params originali
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  
  // Referrer e landing
  referrer: string | null;
  landingPage: string | null;
  
  // Sessione
  sessionId: string;
  firstVisit: string;
  lastVisit: string;
  
  // Funnel tracking
  currentStep: FunnelStep;
  stepsVisited: FunnelStep[];
}

/**
 * Attribution per invio a API/Lead
 */
export interface AttributionData {
  source: LeadSource;
  utmCampaign: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  utmContent: string | null;
}

/**
 * Configurazione campagna (per entry point /campagna/[slug])
 */
export interface CampaignConfig {
  slug: string;
  name: string;
  source: LeadSource;
  vehicleId?: string;
  vehicleSlug?: string;
  defaultParams?: {
    durata?: number;
    kmAnno?: number;
    anticipo?: number;
  };
  redirectTo: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Mappatura source da UTM
 */
export const SOURCE_MAPPING: Record<string, LeadSource> = {
  // Instagram
  'instagram': 'instagram_ads',
  'ig': 'instagram_ads',
  'instagram_ads': 'instagram_ads',
  'instagram_bio': 'instagram_bio',
  
  // Facebook
  'facebook': 'facebook_ads',
  'fb': 'facebook_ads',
  'facebook_ads': 'facebook_ads',
  
  // Google
  'google': 'google_ads',
  'google_ads': 'google_ads',
  'google_organic': 'google_organic',
  'organic': 'google_organic',
  
  // Altri
  'whatsapp': 'whatsapp',
  'referral': 'referral',
  'direct': 'direct',
} as const;

/**
 * Funnel steps in ordine
 */
export const FUNNEL_STEPS_ORDER: FunnelStep[] = [
  'homepage',
  'catalog',
  'vehicle_detail',
  'configurator_start',
  'configurator_params',
  'configurator_services',
  'quote_generated',
  'contact_form',
  'checkout',
  'conversion',
];

/**
 * Verifica se uno step è dopo un altro
 */
export function isStepAfter(current: FunnelStep, target: FunnelStep): boolean {
  const currentIndex = FUNNEL_STEPS_ORDER.indexOf(current);
  const targetIndex = FUNNEL_STEPS_ORDER.indexOf(target);
  return currentIndex > targetIndex;
}

/**
 * Ottiene l'indice dello step nel funnel
 */
export function getStepIndex(step: FunnelStep): number {
  return FUNNEL_STEPS_ORDER.indexOf(step);
}


