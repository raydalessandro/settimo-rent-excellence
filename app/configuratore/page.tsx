'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVehicle } from '@/lib/vehicles/hooks';
import { useAuthState } from '@/lib/auth/hooks';
import { useSaveQuote } from '@/lib/quotes/hooks';
import { calculateQuote } from '@/lib/configurator/api';
import { ConfiguratorStepper } from '@/components/configurator/configurator-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { ConfiguratorParams, ConfiguratorServices } from '@/lib/configurator/types';

export default function ConfiguratorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vehicleId = searchParams.get('vehicleId') || '';
  const { data: vehicle } = useVehicle(vehicleId);
  const { user, isAuthenticated } = useAuthState();
  const saveQuote = useSaveQuote();

  const [currentStep, setCurrentStep] = useState(1);
  const [params, setParams] = useState<ConfiguratorParams | null>(null);
  const [servizi, setServizi] = useState<ConfiguratorServices | null>(null);
  const [quote, setQuote] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!vehicleId && !vehicle) {
      router.push('/offerte');
    }
  }, [vehicleId, vehicle, router]);

  const handleParamsSubmit = (data: ConfiguratorParams) => {
    setParams(data);
    setCurrentStep(2);
  };

  const handleServicesSubmit = (data: ConfiguratorServices) => {
    setServizi(data);
    setCurrentStep(3);
    calculateQuoteData(data);
  };

  const calculateQuoteData = async (servicesData: ConfiguratorServices) => {
    if (!vehicle || !params) return;

    setIsCalculating(true);
    try {
      const quoteData = await calculateQuote(vehicle, params, servicesData as any);
      setQuote(quoteData);
      setCurrentStep(4);
    } catch (error) {
      toast.error('Errore nel calcolo del preventivo');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveQuote = async () => {
    if (!isAuthenticated) {
      toast.info('Accedi per salvare il preventivo');
      router.push('/login?redirect=/configuratore');
      return;
    }

    if (!quote || !user) return;

    try {
      await saveQuote.mutateAsync({
        userId: user.id,
        vehicleId: vehicle!.id,
        data: quote,
      });
      toast.success('Preventivo salvato con successo!');
      router.push('/i-miei-preventivi');
    } catch (error) {
      toast.error('Errore nel salvataggio del preventivo');
    }
  };

  const handleContinueToContact = () => {
    router.push(`/preventivo?quoteId=${quote?.id || 'new'}&vehicleId=${vehicle?.id}`);
  };

  if (!vehicle) {
    return (
      <div className="container py-8 px-4 text-center">
        <p className="text-muted-foreground">Caricamento veicolo...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Configuratore Preventivo</h1>
        <p className="text-muted-foreground mb-8">
          {vehicle.marca} {vehicle.modello} {vehicle.versione}
        </p>

        <ConfiguratorStepper
          currentStep={currentStep}
          vehicle={vehicle}
          onParamsSubmit={handleParamsSubmit}
          onServicesSubmit={handleServicesSubmit}
          quote={quote}
          isCalculating={isCalculating}
          onSaveQuote={handleSaveQuote}
          onContinueToContact={handleContinueToContact}
        />
      </div>
    </div>
  );
}



