/**
 * Feature Configurator - Types
 */

import type { Vehicle, QuoteParams, QuotePricing } from '@/lib/core/storage';

/**
 * Step del configuratore
 */
export type ConfigStep = 1 | 2 | 3 | 4;

export interface ConfigStepInfo {
  step: ConfigStep;
  name: string;
  title: string;
  description: string;
}

export const CONFIG_STEPS: ConfigStepInfo[] = [
  { step: 1, name: 'params', title: 'Parametri', description: 'Configura durata, anticipo e chilometraggio' },
  { step: 2, name: 'services', title: 'Servizi', description: 'Scegli i servizi aggiuntivi' },
  { step: 3, name: 'summary', title: 'Riepilogo', description: 'Verifica la configurazione' },
  { step: 4, name: 'quote', title: 'Preventivo', description: 'Il tuo preventivo personalizzato' },
];

/**
 * Parametri del configuratore
 */
export interface ConfigParams {
  durata: number;
  anticipo: number;
  kmAnno: number;
  manutenzione: boolean;
  assicurazione: boolean;
}

export const DEFAULT_CONFIG_PARAMS: ConfigParams = {
  durata: 36,
  anticipo: 0,
  kmAnno: 15000,
  manutenzione: true,
  assicurazione: true,
};

/**
 * Servizio aggiuntivo
 */
export interface ConfigService {
  id: string;
  label: string;
  description: string;
  price: number;
  selected: boolean;
}

/**
 * Quote calcolata
 */
export interface ConfigQuote {
  id: string;
  vehicle: {
    id: string;
    slug: string;
    marca: string;
    modello: string;
    versione: string;
    immagine: string;
  };
  params: QuoteParams;
  servizi: string[];
  pricing: QuotePricing;
  validUntil: string;
  createdAt: string;
}

/**
 * Stato del configuratore
 */
export interface ConfiguratorState {
  // Step corrente
  currentStep: ConfigStep;
  
  // Veicolo selezionato
  vehicleId: string | null;
  vehicleSlug: string | null;
  vehicleData: Pick<Vehicle, 'id' | 'slug' | 'marca' | 'modello' | 'versione' | 'canone_base' | 'immagini' | 'km_anno'> | null;
  
  // Parametri
  params: ConfigParams;
  
  // Servizi selezionati
  selectedServices: string[];
  
  // Quote generata
  quote: ConfigQuote | null;
  isCalculating: boolean;
  
  // Entry point (per campagne)
  entrySource: string | null;
  entryCampaign: string | null;
}

/**
 * Params da URL per pre-compilazione
 */
export interface ConfigUrlParams {
  vehicleId?: string;
  vehicleSlug?: string;
  durata?: number;
  kmAnno?: number;
  anticipo?: number;
  manutenzione?: boolean;
  assicurazione?: boolean;
  servizi?: string[];
  utm_source?: string;
  utm_campaign?: string;
}

/**
 * Risultato calcolo quote
 */
export interface QuoteCalculationResult {
  success: boolean;
  quote?: ConfigQuote;
  error?: string;
}


