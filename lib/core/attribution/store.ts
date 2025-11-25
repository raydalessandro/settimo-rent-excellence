'use client';

/**
 * Core Attribution - Zustand Store
 * Store persistente per attribution data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FunnelStep } from '@/lib/core/storage';
import type { Attribution, UTMParams } from './types';
import { 
  parseUTMFromUrl, 
  createInitialAttribution, 
  updateAttributionStep,
  mergeAttribution,
  isAttributionExpired,
} from './utils';

interface AttributionState {
  attribution: Attribution | null;
  initialized: boolean;
  
  // Actions
  initialize: () => void;
  setStep: (step: FunnelStep) => void;
  updateFromUrl: (url?: string) => void;
  reset: () => void;
  
  // Getters
  getAttribution: () => Attribution | null;
  getCurrentStep: () => FunnelStep;
  getSource: () => string;
}

export const useAttributionStore = create<AttributionState>()(
  persist(
    (set, get) => ({
      attribution: null,
      initialized: false,

      initialize: () => {
        if (typeof window === 'undefined') return;
        
        const { attribution, initialized } = get();
        
        // Se già inizializzato, controlla se la sessione è scaduta
        if (initialized && attribution) {
          if (isAttributionExpired(attribution)) {
            // Sessione scaduta, crea nuova attribution
            const utmParams = parseUTMFromUrl(window.location.search);
            const newAttribution = createInitialAttribution(
              utmParams,
              document.referrer || null,
              window.location.pathname
            );
            set({ attribution: newAttribution });
          } else {
            // Sessione valida, aggiorna con eventuali nuovi UTM
            const utmParams = parseUTMFromUrl(window.location.search);
            if (utmParams.utm_source || utmParams.utm_campaign) {
              const merged = mergeAttribution(
                attribution,
                utmParams,
                document.referrer || null
              );
              set({ attribution: merged });
            }
          }
          return;
        }

        // Prima inizializzazione
        const utmParams = parseUTMFromUrl(window.location.search);
        const newAttribution = createInitialAttribution(
          utmParams,
          document.referrer || null,
          window.location.pathname
        );
        
        set({ 
          attribution: newAttribution,
          initialized: true,
        });
      },

      setStep: (step: FunnelStep) => {
        const { attribution } = get();
        if (!attribution) return;
        
        const updated = updateAttributionStep(attribution, step);
        set({ attribution: updated });
      },

      updateFromUrl: (url?: string) => {
        if (typeof window === 'undefined') return;
        
        const { attribution } = get();
        const searchParams = url || window.location.search;
        const utmParams = parseUTMFromUrl(searchParams);
        
        if (!utmParams.utm_source && !utmParams.utm_campaign) return;
        
        if (attribution) {
          const merged = mergeAttribution(
            attribution,
            utmParams,
            document.referrer || null
          );
          set({ attribution: merged });
        } else {
          const newAttribution = createInitialAttribution(
            utmParams,
            document.referrer || null,
            window.location.pathname
          );
          set({ 
            attribution: newAttribution,
            initialized: true,
          });
        }
      },

      reset: () => {
        set({ 
          attribution: null,
          initialized: false,
        });
      },

      getAttribution: () => {
        return get().attribution;
      },

      getCurrentStep: () => {
        return get().attribution?.currentStep || 'homepage';
      },

      getSource: () => {
        return get().attribution?.source || 'direct';
      },
    }),
    {
      name: 'rent_excellence_attribution',
      version: 1,
      partialize: (state) => ({
        attribution: state.attribution,
        initialized: state.initialized,
      }),
    }
  )
);


