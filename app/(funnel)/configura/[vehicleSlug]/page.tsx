'use client';

/**
 * Configuratore Page
 * Configuratore multi-step per preventivo
 */

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useStorage } from '@/lib/core/storage';
import { useConfigurator, useConfiguratorServices, CONFIG_STEPS } from '@/lib/features/configurator';
import { useFunnelStep } from '@/lib/core/attribution';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { config } from '@/lib/core/config';

export default function ConfiguraPage({
  params,
}: {
  params: Promise<{ vehicleSlug: string }>;
}) {
  const { vehicleSlug } = use(params);
  const router = useRouter();
  const storage = useStorage();

  // Track funnel step
  useFunnelStep('configurator_start');

  // Carica veicolo da slug
  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['vehicle', 'slug', vehicleSlug],
    queryFn: () => storage.vehicles.getBySlug(vehicleSlug),
    enabled: !!vehicleSlug,
  });

  // Configurator hook
  const {
    currentStep,
    vehicleData,
    params: configParams,
    selectedServices,
    quote,
    isCalculating,
    canProceed,
    setVehicle,
    setParams,
    toggleService,
    handleNext,
    handlePrev,
    stepInfo,
  } = useConfigurator();

  // Set vehicle when loaded
  useEffect(() => {
    if (vehicle && !vehicleData) {
      setVehicle(vehicle);
    }
  }, [vehicle, vehicleData, setVehicle]);

  // Redirect if no vehicle
  useEffect(() => {
    if (!isLoadingVehicle && !vehicle) {
      router.push('/veicoli');
    }
  }, [isLoadingVehicle, vehicle, router]);

  const services = useConfiguratorServices();

  if (isLoadingVehicle || !vehicleData) {
    return (
      <div className="container py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Vehicle Info */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {vehicleData.marca} {vehicleData.modello}
          </h1>
          <p className="text-muted-foreground">{vehicleData.versione}</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {CONFIG_STEPS.map((step, index) => (
            <div key={step.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep > step.step
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.step
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.step ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.step}</span>
                  )}
                </div>
                <span className="text-xs mt-2 hidden sm:block">{step.title}</span>
              </div>
              {index < CONFIG_STEPS.length - 1 && (
                <div
                  className={`w-12 sm:w-16 h-1 mx-2 transition-colors ${
                    currentStep > step.step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{stepInfo.title}</CardTitle>
            <CardDescription>{stepInfo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Parametri */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Durata del noleggio</Label>
                  <Select
                    value={String(configParams.durata)}
                    onValueChange={(v) => setParams({ durata: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.funnel.durataOptions.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {d} mesi
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chilometri all&apos;anno</Label>
                  <Select
                    value={String(configParams.kmAnno)}
                    onValueChange={(v) => setParams({ kmAnno: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleData.km_anno.map((km) => (
                        <SelectItem key={km} value={String(km)}>
                          {km.toLocaleString()} km/anno
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Anticipo (%)</Label>
                  <Select
                    value={String(configParams.anticipo)}
                    onValueChange={(v) => setParams({ anticipo: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.funnel.anticipoOptions.map((a) => (
                        <SelectItem key={a} value={String(a)}>
                          {a === 0 ? 'Nessun anticipo' : `${a}%`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="manutenzione"
                      checked={configParams.manutenzione}
                      onCheckedChange={(checked) =>
                        setParams({ manutenzione: checked === true })
                      }
                    />
                    <Label htmlFor="manutenzione" className="cursor-pointer flex-1">
                      <span>Manutenzione inclusa</span>
                      <span className="text-muted-foreground ml-2">+€20/mese</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="assicurazione"
                      checked={configParams.assicurazione}
                      onCheckedChange={(checked) =>
                        setParams({ assicurazione: checked === true })
                      }
                    />
                    <Label htmlFor="assicurazione" className="cursor-pointer flex-1">
                      <span>Assicurazione RCA</span>
                      <span className="text-muted-foreground ml-2">+€35/mese</span>
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Servizi */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      service.selected
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox checked={service.selected} />
                        <div>
                          <Label className="cursor-pointer font-medium">
                            {service.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        +€{service.price}/mese
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Calcolo in corso */}
            {currentStep === 3 && isCalculating && (
              <div className="py-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Calcolo del preventivo in corso...</p>
              </div>
            )}

            {/* Step 4: Preventivo */}
            {currentStep === 4 && quote && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Canone Base</p>
                    <p className="text-2xl font-bold">€{quote.pricing.canoneBase}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Servizi</p>
                    <p className="text-2xl font-bold">€{quote.pricing.serviziExtra}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">IVA (22%)</p>
                    <p className="text-2xl font-bold">€{quote.pricing.iva}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary">Totale Mensile</p>
                    <p className="text-2xl font-bold text-primary">
                      €{quote.pricing.totale}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-2 border-primary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Totale per {quote.params.durata} mesi
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    €{(quote.pricing.totale * quote.params.durata).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/preventivo/${quote.id}`)}
                  >
                    Salva Preventivo
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => router.push(`/contatto?quoteId=${quote.id}&vehicleId=${vehicleData.id}`)}
                  >
                    Richiedi Contatto
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Indietro
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed || isCalculating}
                >
                  {isCalculating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  {currentStep === 2 ? 'Calcola Preventivo' : 'Continua'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


