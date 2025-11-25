/**
 * Core Attribution - Utilities
 * Helpers per parsing e gestione attribution
 */

import type { LeadSource, FunnelStep } from '@/lib/core/storage';
import type { UTMParams, Attribution, AttributionData } from './types';
import { SOURCE_MAPPING } from './types';

/**
 * Genera un session ID unico
 */
export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Estrae UTM params da URL o URLSearchParams
 */
export function parseUTMFromUrl(input: string | URLSearchParams): UTMParams {
  const params = typeof input === 'string' 
    ? new URLSearchParams(new URL(input, 'http://localhost').search)
    : input;

  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
  };
}

/**
 * Determina la source dai params UTM o referrer
 */
export function detectSource(utmSource: string | null, referrer: string | null): LeadSource {
  // Prima verifica UTM source
  if (utmSource) {
    const normalized = utmSource.toLowerCase().trim();
    if (SOURCE_MAPPING[normalized]) {
      return SOURCE_MAPPING[normalized];
    }
    
    // Controlla se contiene keyword
    if (normalized.includes('instagram')) return 'instagram_ads';
    if (normalized.includes('facebook') || normalized.includes('fb')) return 'facebook_ads';
    if (normalized.includes('google')) return 'google_ads';
    if (normalized.includes('whatsapp')) return 'whatsapp';
  }

  // Poi verifica referrer
  if (referrer) {
    const referrerLower = referrer.toLowerCase();
    
    if (referrerLower.includes('instagram.com')) return 'instagram_bio';
    if (referrerLower.includes('facebook.com') || referrerLower.includes('fb.com')) return 'facebook_ads';
    if (referrerLower.includes('google.')) return 'google_organic';
    if (referrerLower.includes('whatsapp')) return 'whatsapp';
    
    // È un referral se ha un referrer esterno
    if (!referrerLower.includes(window?.location?.hostname || '')) {
      return 'referral';
    }
  }

  return 'direct';
}

/**
 * Crea una attribution iniziale
 */
export function createInitialAttribution(
  utmParams: UTMParams,
  referrer: string | null,
  landingPage: string
): Attribution {
  const now = new Date().toISOString();
  const source = detectSource(utmParams.utm_source, referrer);

  return {
    source,
    utmSource: utmParams.utm_source,
    utmMedium: utmParams.utm_medium,
    utmCampaign: utmParams.utm_campaign,
    utmContent: utmParams.utm_content,
    utmTerm: utmParams.utm_term,
    referrer,
    landingPage,
    sessionId: generateSessionId(),
    firstVisit: now,
    lastVisit: now,
    currentStep: 'homepage',
    stepsVisited: ['homepage'],
  };
}

/**
 * Aggiorna attribution con nuovo step
 */
export function updateAttributionStep(
  attribution: Attribution,
  step: FunnelStep
): Attribution {
  const stepsVisited = attribution.stepsVisited.includes(step)
    ? attribution.stepsVisited
    : [...attribution.stepsVisited, step];

  return {
    ...attribution,
    currentStep: step,
    stepsVisited,
    lastVisit: new Date().toISOString(),
  };
}

/**
 * Estrae AttributionData per invio a API
 */
export function getAttributionData(attribution: Attribution): AttributionData {
  return {
    source: attribution.source,
    utmCampaign: attribution.utmCampaign,
    utmMedium: attribution.utmMedium,
    utmSource: attribution.utmSource,
    utmContent: attribution.utmContent,
  };
}

/**
 * Merge attribution esistente con nuovi UTM params
 * (Utile quando l'utente torna da una nuova campagna)
 */
export function mergeAttribution(
  existing: Attribution,
  newUtmParams: UTMParams,
  referrer: string | null
): Attribution {
  // Se ci sono nuovi UTM params, aggiorna la source
  if (newUtmParams.utm_source || newUtmParams.utm_campaign) {
    const newSource = detectSource(newUtmParams.utm_source, referrer);
    
    return {
      ...existing,
      source: newSource,
      utmSource: newUtmParams.utm_source || existing.utmSource,
      utmMedium: newUtmParams.utm_medium || existing.utmMedium,
      utmCampaign: newUtmParams.utm_campaign || existing.utmCampaign,
      utmContent: newUtmParams.utm_content || existing.utmContent,
      utmTerm: newUtmParams.utm_term || existing.utmTerm,
      lastVisit: new Date().toISOString(),
    };
  }

  // Altrimenti aggiorna solo lastVisit
  return {
    ...existing,
    lastVisit: new Date().toISOString(),
  };
}

/**
 * Verifica se l'attribution è scaduta (sessione > 30 min)
 */
export function isAttributionExpired(attribution: Attribution, maxAgeMinutes: number = 30): boolean {
  const lastVisit = new Date(attribution.lastVisit);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastVisit.getTime()) / 1000 / 60;
  return diffMinutes > maxAgeMinutes;
}

/**
 * Calcola il bucket del canone per analytics
 */
export function getCanoneRange(canone: number): string {
  if (canone < 200) return '0-200';
  if (canone < 300) return '200-300';
  if (canone < 400) return '300-400';
  if (canone < 500) return '400-500';
  if (canone < 700) return '500-700';
  return '700+';
}


