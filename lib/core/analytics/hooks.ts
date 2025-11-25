'use client';

/**
 * Core Analytics - React Hooks
 * Hooks per tracking eventi
 */

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { FunnelStep, LeadSource, Vehicle } from '@/lib/core/storage';
import type {
  AnalyticsEventName,
  VehicleViewPayload,
  ConfiguratorProgressPayload,
  QuoteGeneratedPayload,
  LeadSubmittedPayload,
  ConversionPayload,
  CTAClickPayload,
  CatalogSearchPayload,
} from './types';
import { tracker } from './tracker';
import { useAttributionStore } from '@/lib/core/attribution';
import { getCanoneRange } from '@/lib/core/attribution';

/**
 * Hook per inizializzare analytics con attribution
 */
export function useAnalyticsInit() {
  const attribution = useAttributionStore(state => state.attribution);

  useEffect(() => {
    if (attribution) {
      tracker.setSessionId(attribution.sessionId);
      tracker.setAttribution({
        source: attribution.source,
        utmCampaign: attribution.utmCampaign,
        utmMedium: attribution.utmMedium,
        utmSource: attribution.utmSource,
      });
    }
  }, [attribution]);
}

/**
 * Hook per tracciare page view automaticamente
 */
export function usePageView(funnelStep: FunnelStep, title?: string) {
  const pathname = usePathname();
  const attribution = useAttributionStore(state => state.attribution);

  useEffect(() => {
    if (attribution) {
      tracker.page(
        pathname,
        title || document.title,
        funnelStep
      );
    }
  }, [pathname, funnelStep, title, attribution]);
}

/**
 * Hook per tracciare eventi generici
 */
export function useTrack() {
  const attribution = useAttributionStore(state => state.attribution);
  const currentStep = attribution?.currentStep || 'homepage';

  return useCallback(<T extends Record<string, unknown>>(
    eventName: AnalyticsEventName,
    payload: T,
    step?: FunnelStep
  ) => {
    tracker.track(eventName, payload, step || currentStep);
  }, [currentStep]);
}

/**
 * Hook per tracciare vehicle view
 */
export function useTrackVehicleView() {
  const track = useTrack();

  return useCallback((vehicle: Vehicle) => {
    const payload: Omit<VehicleViewPayload, keyof import('./types').BaseEventPayload> = {
      vehicleId: vehicle.id,
      vehicleBrand: vehicle.marca,
      vehicleModel: vehicle.modello,
      vehicleCategory: vehicle.categoria,
      canone: vehicle.canone_base,
      canoneRange: getCanoneRange(vehicle.canone_base),
    };
    track('vehicle_view', payload, 'vehicle_detail');
  }, [track]);
}

/**
 * Hook per tracciare progresso configuratore
 */
export function useTrackConfiguratorProgress() {
  const track = useTrack();

  return useCallback((
    vehicleId: string,
    vehicleBrand: string,
    step: number,
    stepName: string,
    params?: { durata?: number; kmAnno?: number; servizi?: string[] }
  ) => {
    const payload: Omit<ConfiguratorProgressPayload, keyof import('./types').BaseEventPayload> = {
      vehicleId,
      vehicleBrand,
      step,
      stepName,
      durata: params?.durata,
      kmAnno: params?.kmAnno,
      servizi: params?.servizi,
    };
    
    const funnelStep: FunnelStep = step === 1 
      ? 'configurator_params' 
      : step === 2 
        ? 'configurator_services' 
        : 'quote_generated';
        
    track('configurator_progress', payload, funnelStep);
  }, [track]);
}

/**
 * Hook per tracciare quote generata
 */
export function useTrackQuoteGenerated() {
  const track = useTrack();

  return useCallback((data: {
    quoteId: string;
    vehicleId: string;
    vehicleBrand: string;
    vehicleCategory: string;
    durata: number;
    kmAnno: number;
    canone: number;
    servizi: string[];
    totale: number;
  }) => {
    const payload: Omit<QuoteGeneratedPayload, keyof import('./types').BaseEventPayload> = {
      ...data,
      canoneRange: getCanoneRange(data.canone),
    };
    track('quote_generated', payload, 'quote_generated');
  }, [track]);
}

/**
 * Hook per tracciare lead submitted
 */
export function useTrackLeadSubmitted() {
  const track = useTrack();
  const attribution = useAttributionStore(state => state.attribution);

  return useCallback((data: {
    leadId: string;
    vehicleId?: string;
    quoteId?: string;
    hasCompany: boolean;
    marketingAccepted: boolean;
  }) => {
    const payload: Omit<LeadSubmittedPayload, keyof import('./types').BaseEventPayload> = {
      ...data,
      funnelStepOrigin: attribution?.currentStep || 'contact_form',
    };
    track('lead_submitted', payload, 'contact_form');
  }, [track, attribution?.currentStep]);
}

/**
 * Hook per tracciare conversion
 */
export function useTrackConversion() {
  const track = useTrack();

  return useCallback((data: {
    conversionType: 'lead' | 'checkout' | 'callback';
    value?: number;
    quoteId?: string;
    leadId?: string;
  }) => {
    const payload: Omit<ConversionPayload, keyof import('./types').BaseEventPayload> = data;
    track('conversion', payload, 'conversion');
  }, [track]);
}

/**
 * Hook per tracciare CTA click
 */
export function useTrackCTAClick() {
  const track = useTrack();

  return useCallback((
    ctaId: string,
    ctaText: string,
    ctaLocation: string,
    vehicleId?: string
  ) => {
    const payload: Omit<CTAClickPayload, keyof import('./types').BaseEventPayload> = {
      ctaId,
      ctaText,
      ctaLocation,
      vehicleId,
    };
    track('cta_click', payload);
  }, [track]);
}

/**
 * Hook per tracciare click WhatsApp
 */
export function useTrackWhatsAppClick() {
  const track = useTrack();
  const attribution = useAttributionStore(state => state.attribution);

  return useCallback((vehicleId?: string) => {
    track('whatsapp_click', { vehicleId }, attribution?.currentStep || 'homepage');
  }, [track, attribution?.currentStep]);
}

/**
 * Hook per tracciare ricerca catalogo
 */
export function useTrackCatalogSearch() {
  const track = useTrack();

  return useCallback((
    resultsCount: number,
    query?: string,
    filters?: Record<string, unknown>
  ) => {
    const payload: Omit<CatalogSearchPayload, keyof import('./types').BaseEventPayload> = {
      query,
      filters,
      resultsCount,
    };
    track('catalog_search', payload, 'catalog');
  }, [track]);
}


