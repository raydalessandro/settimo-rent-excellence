'use client';

/**
 * Campagna Entry Point
 * Pagina di entry per campagne marketing
 * Imposta attribution e redirect al configuratore
 */

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useStorage } from '@/lib/core/storage';
import { useAttributionStore } from '@/lib/core/attribution';
import { useConfiguratorStore } from '@/lib/features/configurator';
import { Loader2 } from 'lucide-react';

// Configurazioni campagne (in futuro da API/CMS)
const CAMPAIGNS: Record<string, {
  vehicleSlug?: string;
  vehicleId?: string;
  defaultParams?: {
    durata?: number;
    kmAnno?: number;
  };
  redirectPath?: string;
}> = {
  'promo-500': {
    vehicleSlug: 'fiat-500-hybrid-lounge',
    defaultParams: { durata: 36, kmAnno: 15000 },
  },
  'promo-estate': {
    redirectPath: '/veicoli',
  },
  // Aggiungi altre campagne qui
};

export default function CampagnaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const storage = useStorage();
  
  const [error, setError] = useState<string | null>(null);
  
  const updateFromUrl = useAttributionStore(state => state.updateFromUrl);
  const initFromUrlParams = useConfiguratorStore(state => state.initFromUrlParams);

  // Trova configurazione campagna
  const campaign = CAMPAIGNS[slug];

  // Carica veicolo se specificato
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', campaign?.vehicleSlug || campaign?.vehicleId],
    queryFn: async () => {
      if (campaign?.vehicleSlug) {
        return storage.vehicles.getBySlug(campaign.vehicleSlug);
      }
      if (campaign?.vehicleId) {
        return storage.vehicles.getById(campaign.vehicleId);
      }
      return null;
    },
    enabled: !!(campaign?.vehicleSlug || campaign?.vehicleId),
  });

  useEffect(() => {
    // Aggiorna attribution con UTM params dalla URL
    if (searchParams) {
      updateFromUrl(searchParams.toString());
    }

    // Se non esiste la campagna, redirect a home
    if (!campaign) {
      setError('Campagna non trovata');
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    // Se la campagna ha un redirect diretto
    if (campaign.redirectPath) {
      router.push(campaign.redirectPath);
      return;
    }
  }, [campaign, searchParams, updateFromUrl, router]);

  useEffect(() => {
    // Quando abbiamo il veicolo, inizializza configuratore e redirect
    if (vehicle && campaign) {
      // Pre-compila configuratore con params della campagna
      initFromUrlParams({
        vehicleId: vehicle.id,
        vehicleSlug: vehicle.slug,
        durata: campaign.defaultParams?.durata,
        kmAnno: campaign.defaultParams?.kmAnno,
        utm_source: searchParams.get('utm_source') || undefined,
        utm_campaign: searchParams.get('utm_campaign') || slug,
      });

      // Redirect al configuratore
      router.push(`/configura/${vehicle.slug}`);
    }
  }, [vehicle, campaign, slug, searchParams, initFromUrlParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm">Reindirizzamento in corso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          {isLoading ? 'Caricamento offerta...' : 'Preparazione configuratore...'}
        </p>
      </div>
    </div>
  );
}


