/**
 * Feature Configurator - API
 */

import type { Vehicle } from '@/lib/core/storage';
import type { ConfigParams, ConfigQuote, QuoteCalculationResult } from './types';
import { calculatePricing, generateQuoteId, getQuoteValidUntil } from './utils';

/**
 * Calcola un preventivo completo
 */
export async function calculateQuote(
  vehicle: Pick<Vehicle, 'id' | 'slug' | 'marca' | 'modello' | 'versione' | 'canone_base' | 'immagini'>,
  params: ConfigParams,
  selectedServices: string[]
): Promise<QuoteCalculationResult> {
  // Simula delay API
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const pricing = calculatePricing(vehicle.canone_base, params, selectedServices);
    
    const quote: ConfigQuote = {
      id: generateQuoteId(),
      vehicle: {
        id: vehicle.id,
        slug: vehicle.slug,
        marca: vehicle.marca,
        modello: vehicle.modello,
        versione: vehicle.versione,
        immagine: vehicle.immagini?.[0] || '',
      },
      params: {
        durata: params.durata,
        anticipo: params.anticipo,
        kmAnno: params.kmAnno,
        manutenzione: params.manutenzione,
        assicurazione: params.assicurazione,
      },
      servizi: selectedServices,
      pricing: {
        canoneBase: pricing.canoneBase,
        serviziExtra: pricing.serviziExtra,
        scontoAnticipo: pricing.scontoAnticipo,
        subtotale: pricing.subtotale,
        iva: pricing.iva,
        totale: pricing.totale,
      },
      validUntil: getQuoteValidUntil(),
      createdAt: new Date().toISOString(),
    };

    return { success: true, quote };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nel calcolo del preventivo',
    };
  }
}

/**
 * Salva un preventivo nello storage
 */
export async function saveQuote(
  storage: { quotes: { create: (data: unknown) => Promise<unknown> } },
  userId: string | null,
  quote: ConfigQuote
): Promise<{ success: boolean; error?: string }> {
  try {
    await storage.quotes.create({
      userId,
      vehicleId: quote.vehicle.id,
      vehicle: quote.vehicle,
      params: quote.params,
      servizi: quote.servizi,
      pricing: quote.pricing,
      status: 'draft',
      validUntil: quote.validUntil,
    });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nel salvataggio',
    };
  }
}


