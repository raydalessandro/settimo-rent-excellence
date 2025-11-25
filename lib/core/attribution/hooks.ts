'use client';

/**
 * Core Attribution - React Hooks
 * Hooks per accedere e gestire attribution
 */

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { FunnelStep, LeadSource } from '@/lib/core/storage';
import type { Attribution, AttributionData } from './types';
import { useAttributionStore } from './store';
import { getAttributionData } from './utils';

/**
 * Hook principale per attribution
 * Inizializza automaticamente al mount
 */
export function useAttribution() {
  const { 
    attribution, 
    initialized,
    initialize,
    setStep,
    updateFromUrl,
    reset,
  } = useAttributionStore();

  // Inizializza al primo mount
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return {
    attribution,
    initialized,
    setStep,
    updateFromUrl,
    reset,
  };
}

/**
 * Hook per tracciare automaticamente i funnel steps
 * Usa il pathname per determinare lo step
 */
export function useFunnelStep(step: FunnelStep) {
  const { setStep, initialized } = useAttributionStore();
  const pathname = usePathname();

  useEffect(() => {
    if (initialized) {
      setStep(step);
    }
  }, [step, initialized, setStep, pathname]);
}

/**
 * Hook per ottenere la source corrente
 */
export function useSource(): LeadSource {
  const attribution = useAttributionStore(state => state.attribution);
  return attribution?.source || 'direct';
}

/**
 * Hook per ottenere UTM params
 */
export function useUTM() {
  const attribution = useAttributionStore(state => state.attribution);
  
  return {
    source: attribution?.utmSource || null,
    medium: attribution?.utmMedium || null,
    campaign: attribution?.utmCampaign || null,
    content: attribution?.utmContent || null,
    term: attribution?.utmTerm || null,
  };
}

/**
 * Hook per ottenere attribution data per form/API
 */
export function useAttributionData(): AttributionData | null {
  const attribution = useAttributionStore(state => state.attribution);
  
  if (!attribution) return null;
  return getAttributionData(attribution);
}

/**
 * Hook per ottenere lo step corrente
 */
export function useCurrentStep(): FunnelStep {
  const attribution = useAttributionStore(state => state.attribution);
  return attribution?.currentStep || 'homepage';
}

/**
 * Hook per ottenere gli step visitati
 */
export function useVisitedSteps(): FunnelStep[] {
  const attribution = useAttributionStore(state => state.attribution);
  return attribution?.stepsVisited || [];
}

/**
 * Hook per aggiornare attribution da URL params
 * Utile per entry point campagne
 */
export function useUpdateAttributionFromUrl() {
  const searchParams = useSearchParams();
  const { updateFromUrl, initialized } = useAttributionStore();

  useEffect(() => {
    if (initialized && searchParams) {
      updateFromUrl(searchParams.toString());
    }
  }, [searchParams, initialized, updateFromUrl]);
}

/**
 * Hook per creare un callback che imposta lo step
 */
export function useSetFunnelStep() {
  const setStep = useAttributionStore(state => state.setStep);
  
  return useCallback((step: FunnelStep) => {
    setStep(step);
  }, [setStep]);
}

/**
 * Hook per verificare se l'utente viene da una campagna specifica
 */
export function useIsFromCampaign(campaignName: string): boolean {
  const attribution = useAttributionStore(state => state.attribution);
  return attribution?.utmCampaign?.toLowerCase() === campaignName.toLowerCase();
}

/**
 * Hook per verificare se l'utente viene da una source specifica
 */
export function useIsFromSource(source: LeadSource): boolean {
  const attribution = useAttributionStore(state => state.attribution);
  return attribution?.source === source;
}


