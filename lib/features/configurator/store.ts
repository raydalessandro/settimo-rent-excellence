'use client';

/**
 * Feature Configurator - Zustand Store
 * Store persistente per stato configuratore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Vehicle } from '@/lib/core/storage';
import type { ConfiguratorState, ConfigStep, ConfigParams, ConfigQuote, ConfigUrlParams } from './types';
import { DEFAULT_CONFIG_PARAMS } from './types';
import { parseConfigFromUrl, validateKmForVehicle } from './utils';

interface ConfiguratorActions {
  // Vehicle
  setVehicle: (vehicle: Vehicle) => void;
  clearVehicle: () => void;
  
  // Steps
  setStep: (step: ConfigStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Params
  setParams: (params: Partial<ConfigParams>) => void;
  resetParams: () => void;
  
  // Services
  toggleService: (serviceId: string) => void;
  setServices: (serviceIds: string[]) => void;
  clearServices: () => void;
  
  // Quote
  setQuote: (quote: ConfigQuote) => void;
  clearQuote: () => void;
  setCalculating: (isCalculating: boolean) => void;
  
  // URL pre-fill
  initFromUrl: (searchParams: URLSearchParams) => void;
  initFromUrlParams: (params: ConfigUrlParams) => void;
  
  // Entry tracking
  setEntrySource: (source: string | null, campaign: string | null) => void;
  
  // Reset
  reset: () => void;
  
  // Getters
  canProceed: () => boolean;
  getProgress: () => number;
}

type ConfiguratorStore = ConfiguratorState & ConfiguratorActions;

const initialState: ConfiguratorState = {
  currentStep: 1,
  vehicleId: null,
  vehicleSlug: null,
  vehicleData: null,
  params: DEFAULT_CONFIG_PARAMS,
  selectedServices: [],
  quote: null,
  isCalculating: false,
  entrySource: null,
  entryCampaign: null,
};

export const useConfiguratorStore = create<ConfiguratorStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Vehicle
      setVehicle: (vehicle: Vehicle) => {
        // Valida km per il veicolo
        const validKm = validateKmForVehicle(get().params.kmAnno, vehicle);
        
        set({
          vehicleId: vehicle.id,
          vehicleSlug: vehicle.slug,
          vehicleData: {
            id: vehicle.id,
            slug: vehicle.slug,
            marca: vehicle.marca,
            modello: vehicle.modello,
            versione: vehicle.versione,
            canone_base: vehicle.canone_base,
            immagini: vehicle.immagini,
            km_anno: vehicle.km_anno,
          },
          params: {
            ...get().params,
            kmAnno: validKm,
          },
        });
      },

      clearVehicle: () => {
        set({
          vehicleId: null,
          vehicleSlug: null,
          vehicleData: null,
        });
      },

      // Steps
      setStep: (step: ConfigStep) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const current = get().currentStep;
        if (current < 4) {
          set({ currentStep: (current + 1) as ConfigStep });
        }
      },

      prevStep: () => {
        const current = get().currentStep;
        if (current > 1) {
          set({ currentStep: (current - 1) as ConfigStep });
        }
      },

      // Params
      setParams: (params: Partial<ConfigParams>) => {
        set({
          params: { ...get().params, ...params },
          quote: null, // Invalida quote quando cambiano i params
        });
      },

      resetParams: () => {
        set({ params: DEFAULT_CONFIG_PARAMS });
      },

      // Services
      toggleService: (serviceId: string) => {
        const current = get().selectedServices;
        const updated = current.includes(serviceId)
          ? current.filter(id => id !== serviceId)
          : [...current, serviceId];
        set({ 
          selectedServices: updated,
          quote: null, // Invalida quote
        });
      },

      setServices: (serviceIds: string[]) => {
        set({ 
          selectedServices: serviceIds,
          quote: null,
        });
      },

      clearServices: () => {
        set({ 
          selectedServices: [],
          quote: null,
        });
      },

      // Quote
      setQuote: (quote: ConfigQuote) => {
        set({ quote, isCalculating: false });
      },

      clearQuote: () => {
        set({ quote: null });
      },

      setCalculating: (isCalculating: boolean) => {
        set({ isCalculating });
      },

      // URL pre-fill
      initFromUrl: (searchParams: URLSearchParams) => {
        const urlParams = parseConfigFromUrl(searchParams);
        get().initFromUrlParams(urlParams);
      },

      initFromUrlParams: (urlParams: ConfigUrlParams) => {
        const updates: Partial<ConfiguratorState> = {};
        const paramsUpdates: Partial<ConfigParams> = {};

        if (urlParams.vehicleId) updates.vehicleId = urlParams.vehicleId;
        if (urlParams.vehicleSlug) updates.vehicleSlug = urlParams.vehicleSlug;
        if (urlParams.durata) paramsUpdates.durata = urlParams.durata;
        if (urlParams.kmAnno) paramsUpdates.kmAnno = urlParams.kmAnno;
        if (urlParams.anticipo !== undefined) paramsUpdates.anticipo = urlParams.anticipo;
        if (urlParams.manutenzione !== undefined) paramsUpdates.manutenzione = urlParams.manutenzione;
        if (urlParams.assicurazione !== undefined) paramsUpdates.assicurazione = urlParams.assicurazione;
        if (urlParams.servizi) updates.selectedServices = urlParams.servizi;
        if (urlParams.utm_source) updates.entrySource = urlParams.utm_source;
        if (urlParams.utm_campaign) updates.entryCampaign = urlParams.utm_campaign;

        if (Object.keys(paramsUpdates).length > 0) {
          updates.params = { ...get().params, ...paramsUpdates };
        }

        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },

      // Entry tracking
      setEntrySource: (source: string | null, campaign: string | null) => {
        set({ entrySource: source, entryCampaign: campaign });
      },

      // Reset
      reset: () => {
        set(initialState);
      },

      // Getters
      canProceed: () => {
        const { currentStep, vehicleId, params } = get();
        
        switch (currentStep) {
          case 1:
            return !!vehicleId && params.durata > 0 && params.kmAnno > 0;
          case 2:
            return true; // Servizi sono opzionali
          case 3:
            return true;
          case 4:
            return !!get().quote;
          default:
            return false;
        }
      },

      getProgress: () => {
        return (get().currentStep / 4) * 100;
      },
    }),
    {
      name: 'rent_excellence_configurator',
      version: 1,
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        currentStep: state.currentStep,
        vehicleId: state.vehicleId,
        vehicleSlug: state.vehicleSlug,
        vehicleData: state.vehicleData,
        params: state.params,
        selectedServices: state.selectedServices,
        quote: state.quote,
        entrySource: state.entrySource,
        entryCampaign: state.entryCampaign,
        isCalculating: false,
      }) as any,
    }
  )
);




