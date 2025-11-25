'use client';

/**
 * App Providers
 * Wrapper per tutti i provider dell'applicazione
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useState, useEffect } from 'react';
import { StorageProviderComponent } from '@/lib/core/storage';
import { AnalyticsProvider } from '@/lib/core/analytics';
import { useAttributionStore } from '@/lib/core/attribution';
import { config } from '@/lib/core/config';

// Componente per inizializzare attribution
function AttributionInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAttributionStore(state => state.initialize);
  const initialized = useAttributionStore(state => state.initialized);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <StorageProviderComponent type={config.storage.type}>
      <QueryClientProvider client={queryClient}>
        <AttributionInitializer>
          <AnalyticsProvider debug={config.features.debugMode}>
            {children}
            <Toaster />
          </AnalyticsProvider>
        </AttributionInitializer>
      </QueryClientProvider>
    </StorageProviderComponent>
  );
}
