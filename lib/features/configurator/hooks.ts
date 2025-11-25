'use client';

/**
 * Feature Configurator - React Hooks
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { Vehicle } from '@/lib/core/storage';
import { useStorage } from '@/lib/core/storage';
import { useFunnelStep } from '@/lib/core/attribution';
import { useTrackConfiguratorProgress, useTrackQuoteGenerated } from '@/lib/core/analytics';
import { useConfiguratorStore } from './store';
import { calculateQuote, saveQuote } from './api';
import { prepareServices, formatPrice, formatMonthlyPrice } from './utils';
import { CONFIG_STEPS, type ConfigStep, type ConfigParams, type ConfigService } from './types';

/**
 * Hook principale del configuratore
 */
export function useConfigurator() {
  const store = useConfiguratorStore();
  const searchParams = useSearchParams();
  const storage = useStorage();
  const trackProgress = useTrackConfiguratorProgress();
  const trackQuote = useTrackQuoteGenerated();

  // Inizializza da URL params al mount
  useEffect(() => {
    if (searchParams) {
      store.initFromUrl(searchParams);
    }
  }, []); // Solo al mount

  // Track funnel step
  const funnelStep = useMemo(() => {
    switch (store.currentStep) {
      case 1: return 'configurator_params';
      case 2: return 'configurator_services';
      case 3:
      case 4: return 'quote_generated';
      default: return 'configurator_start';
    }
  }, [store.currentStep]);
  
  useFunnelStep(funnelStep);

  // Carica veicolo se abbiamo solo l'ID
  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', store.vehicleId],
    queryFn: async () => {
      if (!store.vehicleId) return null;
      return storage.vehicles.getById(store.vehicleId);
    },
    enabled: !!store.vehicleId && !store.vehicleData,
  });

  // Imposta vehicle data quando caricato
  useEffect(() => {
    if (vehicle && !store.vehicleData) {
      store.setVehicle(vehicle);
    }
  }, [vehicle, store.vehicleData]);

  // Mutation per calcolo quote
  const calculateMutation = useMutation({
    mutationFn: async () => {
      if (!store.vehicleData) throw new Error('Veicolo non selezionato');
      
      store.setCalculating(true);
      return calculateQuote(store.vehicleData, store.params, store.selectedServices);
    },
    onSuccess: (result) => {
      if (result.success && result.quote) {
        store.setQuote(result.quote);
        store.setStep(4);
        
        // Track quote generated
        trackQuote({
          quoteId: result.quote.id,
          vehicleId: result.quote.vehicle.id,
          vehicleBrand: result.quote.vehicle.marca,
          vehicleCategory: 'unknown', // TODO: passare categoria
          durata: result.quote.params.durata,
          kmAnno: result.quote.params.kmAnno,
          canone: result.quote.pricing.totale,
          servizi: result.quote.servizi,
          totale: result.quote.pricing.totale * result.quote.params.durata,
        });
      }
    },
    onSettled: () => {
      store.setCalculating(false);
    },
  });

  // Handlers
  const goToStep = useCallback((step: ConfigStep) => {
    store.setStep(step);
    
    if (store.vehicleData) {
      trackProgress(
        store.vehicleData.id,
        store.vehicleData.marca,
        step,
        CONFIG_STEPS[step - 1].name,
        {
          durata: store.params.durata,
          kmAnno: store.params.kmAnno,
          servizi: store.selectedServices,
        }
      );
    }
  }, [store, trackProgress]);

  const handleNext = useCallback(() => {
    if (store.currentStep === 2) {
      // Da step 2 (servizi) -> calcola quote
      calculateMutation.mutate();
    } else {
      store.nextStep();
    }
  }, [store, calculateMutation]);

  const handlePrev = useCallback(() => {
    store.prevStep();
  }, [store]);

  return {
    // State
    currentStep: store.currentStep,
    vehicleData: store.vehicleData,
    params: store.params,
    selectedServices: store.selectedServices,
    quote: store.quote,
    isCalculating: store.isCalculating || calculateMutation.isPending,
    canProceed: store.canProceed(),
    progress: store.getProgress(),
    
    // Actions
    setVehicle: store.setVehicle,
    setParams: store.setParams,
    toggleService: store.toggleService,
    goToStep,
    handleNext,
    handlePrev,
    reset: store.reset,
    
    // Helpers
    stepInfo: CONFIG_STEPS[store.currentStep - 1],
  };
}

/**
 * Hook per i servizi disponibili
 */
export function useConfiguratorServices(): ConfigService[] {
  const selectedServices = useConfiguratorStore(state => state.selectedServices);
  return useMemo(() => prepareServices(selectedServices), [selectedServices]);
}

/**
 * Hook per parametri
 */
export function useConfiguratorParams() {
  const params = useConfiguratorStore(state => state.params);
  const setParams = useConfiguratorStore(state => state.setParams);
  return { params, setParams };
}

/**
 * Hook per quote corrente
 */
export function useConfiguratorQuote() {
  const quote = useConfiguratorStore(state => state.quote);
  const vehicleData = useConfiguratorStore(state => state.vehicleData);
  
  return {
    quote,
    vehicleData,
    hasQuote: !!quote,
    formattedTotal: quote ? formatMonthlyPrice(quote.pricing.totale) : null,
    formattedPeriodTotal: quote ? formatPrice(quote.pricing.totale * quote.params.durata) : null,
  };
}

/**
 * Hook per salvare quote
 */
export function useSaveConfiguratorQuote() {
  const storage = useStorage();
  const quote = useConfiguratorStore(state => state.quote);

  return useMutation({
    mutationFn: async (userId: string | null) => {
      if (!quote) throw new Error('Nessun preventivo da salvare');
      return saveQuote(storage as any, userId, quote);
    },
  });
}

/**
 * Hook per inizializzare da veicolo
 */
export function useInitConfiguratorWithVehicle(vehicle: Vehicle | null) {
  const setVehicle = useConfiguratorStore(state => state.setVehicle);
  const vehicleId = useConfiguratorStore(state => state.vehicleId);

  useEffect(() => {
    if (vehicle && vehicle.id !== vehicleId) {
      setVehicle(vehicle);
    }
  }, [vehicle, vehicleId, setVehicle]);
}



