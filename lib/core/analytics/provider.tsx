'use client';

/**
 * Core Analytics - Provider
 * React context per inizializzare analytics
 */

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { tracker } from './tracker';
import { useAttributionStore } from '@/lib/core/attribution';
import { config } from '@/lib/core/config';

// ==================== CONTEXT ====================

interface AnalyticsContextValue {
  isEnabled: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  isEnabled: false,
});

// ==================== PROVIDER ====================

interface AnalyticsProviderProps {
  children: ReactNode;
  debug?: boolean;
}

export function AnalyticsProvider({ children, debug = false }: AnalyticsProviderProps) {
  const attribution = useAttributionStore(state => state.attribution);
  const initialized = useAttributionStore(state => state.initialized);

  // Configura tracker
  useEffect(() => {
    tracker.configure({
      enabled: config.features.analyticsEnabled,
      debug: debug || config.features.debugMode,
      gaMeasurementId: undefined, // TODO: da config
    });
  }, [debug]);

  // Sincronizza attribution con tracker
  useEffect(() => {
    if (initialized && attribution) {
      tracker.setSessionId(attribution.sessionId);
      tracker.setAttribution({
        source: attribution.source,
        utmCampaign: attribution.utmCampaign,
        utmMedium: attribution.utmMedium,
        utmSource: attribution.utmSource,
      });
    }
  }, [attribution, initialized]);

  const value: AnalyticsContextValue = {
    isEnabled: config.features.analyticsEnabled,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// ==================== HOOKS ====================

export function useAnalytics() {
  return useContext(AnalyticsContext);
}


