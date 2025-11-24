'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Vehicle } from '@/lib/vehicles/types';
import type { ConfiguratorParams, ConfiguratorServices } from '@/lib/configurator/types';
import { CheckCircle2, Circle } from 'lucide-react';

const paramsSchema = z.object({
  durata: z.number().min(12).max(48),
  anticipo: z.number().min(0).max(100),
  kmAnno: z.number(),
  manutenzione: z.boolean(),
  assicurazione: z.boolean(),
});

interface ConfiguratorStepperProps {
  currentStep: number;
  vehicle: Vehicle;
  onParamsSubmit: (data: ConfiguratorParams) => void;
  onServicesSubmit: (data: ConfiguratorServices) => void;
  quote: any;
  isCalculating: boolean;
  onSaveQuote: () => void;
  onContinueToContact: () => void;
}

export function ConfiguratorStepper({
  currentStep,
  vehicle,
  onParamsSubmit,
  onServicesSubmit,
  quote,
  isCalculating,
  onSaveQuote,
  onContinueToContact,
}: ConfiguratorStepperProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConfiguratorParams>({
    resolver: zodResolver(paramsSchema),
    defaultValues: {
      durata: 36,
      anticipo: 0,
      kmAnno: 15000,
      manutenzione: true,
      assicurazione: true,
    },
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const services = [
    { id: 'gps', label: 'GPS e Telemetria', price: 15 },
    { id: 'sostituzione', label: 'Sostituzione Veicolo', price: 25 },
    { id: 'consegna', label: 'Consegna a Domicilio', price: 30 },
    { id: 'ritiro', label: 'Ritiro a Scadenza', price: 30 },
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const onParamsFormSubmit = (data: ConfiguratorParams) => {
    onParamsSubmit(data);
  };

  const onServicesFormSubmit = () => {
    onServicesSubmit({ servizi: selectedServices });
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span className="text-xs mt-2">
                {step === 1 && 'Parametri'}
                {step === 2 && 'Servizi'}
                {step === 3 && 'Riepilogo'}
                {step === 4 && 'Preventivo'}
              </span>
            </div>
            {step < 4 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Parametri */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Parametri di Noleggio</CardTitle>
            <CardDescription>
              Configura durata, anticipo e percorrenza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onParamsFormSubmit)} className="space-y-6">
              <div>
                <Label>Durata (mesi)</Label>
                <Select
                  value={watch('durata').toString()}
                  onValueChange={(value) => setValue('durata', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 mesi</SelectItem>
                    <SelectItem value="24">24 mesi</SelectItem>
                    <SelectItem value="36">36 mesi</SelectItem>
                    <SelectItem value="48">48 mesi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Anticipo (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  {...register('anticipo', { valueAsNumber: true })}
                />
                {errors.anticipo && (
                  <p className="text-sm text-destructive">{errors.anticipo.message}</p>
                )}
              </div>

              <div>
                <Label>Chilometri all'anno</Label>
                <Select
                  value={watch('kmAnno').toString()}
                  onValueChange={(value) => setValue('kmAnno', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicle.km_anno.map((km) => (
                      <SelectItem key={km} value={km.toString()}>
                        {km.toLocaleString()} km/anno
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manutenzione"
                    checked={watch('manutenzione')}
                    onCheckedChange={(checked) =>
                      setValue('manutenzione', checked === true)
                    }
                  />
                  <Label htmlFor="manutenzione" className="cursor-pointer">
                    Manutenzione Inclusa (+€20/mese)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assicurazione"
                    checked={watch('assicurazione')}
                    onCheckedChange={(checked) =>
                      setValue('assicurazione', checked === true)
                    }
                  />
                  <Label htmlFor="assicurazione" className="cursor-pointer">
                    Assicurazione Inclusa (+€35/mese)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Continua
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Servizi */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Servizi Aggiuntivi</CardTitle>
            <CardDescription>
              Scegli i servizi opzionali per il tuo noleggio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted"
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <div>
                      <Label className="cursor-pointer">{service.label}</Label>
                    </div>
                  </div>
                  <div className="font-semibold">+€{service.price}/mese</div>
                </div>
              ))}
            </div>
            <Button onClick={onServicesFormSubmit} className="w-full mt-6">
              Calcola Preventivo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Riepilogo */}
      {currentStep === 3 && isCalculating && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Calcolo preventivo in corso...</p>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Preventivo */}
      {currentStep === 4 && quote && (
        <Card>
          <CardHeader>
            <CardTitle>Il Tuo Preventivo</CardTitle>
            <CardDescription>
              Riepilogo completo del preventivo personalizzato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Canone Base</p>
                <p className="text-2xl font-bold">€{quote.breakdown.canoneBase}/mese</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Servizi</p>
                <p className="text-2xl font-bold">€{quote.breakdown.servizi}/mese</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IVA (22%)</p>
                <p className="text-2xl font-bold">€{quote.breakdown.iva}/mese</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Totale Mensile</p>
                <p className="text-2xl font-bold text-primary">€{quote.canone}/mese</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Totale per {quote.breakdown.durata} mesi</p>
              <p className="text-3xl font-bold text-primary">€{quote.totale}</p>
            </div>

            <div className="flex gap-4">
              <Button onClick={onSaveQuote} variant="outline" className="flex-1">
                Salva Preventivo
              </Button>
              <Button onClick={onContinueToContact} className="flex-1">
                Richiedi Contatto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

