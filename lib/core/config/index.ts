/**
 * Core Config - Configurazione Centralizzata
 * Tutte le configurazioni dell'applicazione in un unico posto
 */

import type { StorageType } from '@/lib/core/storage';
import { env } from './env';

// ==================== APP CONFIG ====================

export const config = {
  /**
   * Informazioni aziendali
   */
  app: {
    name: 'Rent Excellence',
    company: 'Rent4Business',
    tagline: 'Noleggio Auto a Lungo Termine',
    description: 'Noleggio auto a lungo termine per aziende. Flotta completa di veicoli, preventivi personalizzati e servizi dedicati.',
    email: env.CONTACT_EMAIL,
    phone: env.CONTACT_PHONE,
    whatsapp: env.WHATSAPP_NUMBER,
    address: {
      street: 'Via Example 123',
      city: 'Milano',
      cap: '20100',
      country: 'Italia',
    },
    social: {
      facebook: 'https://facebook.com/rent4business',
      instagram: 'https://instagram.com/rent4business',
      linkedin: 'https://linkedin.com/company/rent4business',
    },
  },

  /**
   * Feature flags
   */
  features: {
    stripeEnabled: env.STRIPE_ENABLED,
    analyticsEnabled: env.ANALYTICS_ENABLED,
    offlineMode: false,
    debugMode: env.NODE_ENV === 'development',
  },

  /**
   * Configurazione storage
   */
  storage: {
    type: env.STORAGE_TYPE as StorageType,
    prefix: 'rent_excellence_',
  },

  /**
   * Configurazione API (per futuro)
   */
  api: {
    baseUrl: env.API_BASE_URL,
    timeout: 10000,
  },

  /**
   * Configurazione funnel/configuratore
   */
  funnel: {
    defaultDurata: 36,
    defaultKmAnno: 15000,
    defaultAnticipo: 0,
    durataOptions: [12, 24, 36, 48] as const,
    kmOptions: [10000, 15000, 20000, 30000] as const,
    anticipoOptions: [0, 10, 20, 30] as const,
  },

  /**
   * Servizi aggiuntivi disponibili
   */
  servizi: [
    { id: 'gps', label: 'GPS e Telemetria', price: 15, description: 'Localizzazione e monitoraggio veicolo' },
    { id: 'sostituzione', label: 'Veicolo Sostitutivo', price: 25, description: 'Auto sostitutiva in caso di guasto' },
    { id: 'consegna', label: 'Consegna a Domicilio', price: 30, description: 'Consegna del veicolo dove preferisci' },
    { id: 'ritiro', label: 'Ritiro a Scadenza', price: 30, description: 'Ritiro del veicolo a fine contratto' },
    { id: 'manutenzione', label: 'Manutenzione Full', price: 20, description: 'Manutenzione ordinaria e straordinaria' },
    { id: 'assicurazione', label: 'Assicurazione RCA', price: 35, description: 'Copertura assicurativa completa' },
  ] as const,

  /**
   * Configurazione quote
   */
  quote: {
    validityDays: 30,
    ivaRate: 0.22,
    durataMultipliers: {
      12: 1.0,
      24: 0.95,
      36: 0.90,
      48: 0.85,
    } as const,
    kmMultipliers: {
      10000: 1.0,
      15000: 1.1,
      20000: 1.2,
      30000: 1.35,
    } as const,
  },

  /**
   * Configurazione SEO
   */
  seo: {
    titleTemplate: '%s | Rent Excellence',
    defaultTitle: 'Rent Excellence - Noleggio Auto a Lungo Termine',
    defaultDescription: 'Noleggio auto a lungo termine per aziende. Oltre 200 veicoli disponibili, preventivi personalizzati e servizi dedicati.',
    keywords: ['noleggio auto', 'long term rental', 'leasing', 'fleet management', 'auto aziendali', 'NLT'],
    ogImage: '/og-image.jpg',
  },

  /**
   * Configurazione Stripe (per futuro)
   */
  stripe: {
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
  },
} as const;

// ==================== HELPERS ====================

/**
 * Ottiene il moltiplicatore per la durata
 */
export function getDurataMultiplier(durata: number): number {
  return config.quote.durataMultipliers[durata as keyof typeof config.quote.durataMultipliers] || 1.0;
}

/**
 * Ottiene il moltiplicatore per i km
 */
export function getKmMultiplier(km: number): number {
  return config.quote.kmMultipliers[km as keyof typeof config.quote.kmMultipliers] || 1.0;
}

/**
 * Ottiene il prezzo di un servizio
 */
export function getServizioPrice(servizioId: string): number {
  const servizio = config.servizi.find(s => s.id === servizioId);
  return servizio?.price || 0;
}

/**
 * Ottiene le informazioni di un servizio
 */
export function getServizio(servizioId: string) {
  return config.servizi.find(s => s.id === servizioId);
}

/**
 * Verifica se una feature è abilitata
 */
export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature];
}

// Export type per config
export type AppConfig = typeof config;


