'use client';

/**
 * Contatto Page
 * Form per richiesta contatto / lead
 */

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useStorage } from '@/lib/core/storage';
import { useCreateLead, leadFormSchema, type LeadFormSchema } from '@/lib/features/leads';
import { useFunnelStep } from '@/lib/core/attribution';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { config } from '@/lib/core/config';

export default function ContattoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storage = useStorage();
  
  const quoteId = searchParams.get('quoteId');
  const vehicleId = searchParams.get('vehicleId');

  // Track funnel step
  useFunnelStep('contact_form');

  // Load vehicle info if available
  const { data: vehicle } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => storage.vehicles.getById(vehicleId!),
    enabled: !!vehicleId,
  });

  // Form
  const form = useForm<LeadFormSchema>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      nome: '',
      cognome: '',
      email: '',
      telefono: '',
      azienda: '',
      partitaIva: '',
      messaggio: '',
      privacyAccepted: false,
      marketingAccepted: false,
    },
  });

  // Create lead mutation
  const createLead = useCreateLead({
    vehicleId: vehicleId || undefined,
    quoteId: quoteId || undefined,
    funnelStep: 'contact_form',
  });

  const onSubmit = async (data: LeadFormSchema) => {
    const result = await createLead.mutateAsync(data);
    
    if (result.success) {
      toast.success('Richiesta inviata con successo!', {
        description: 'Ti contatteremo al più presto.',
      });
      router.push('/grazie');
    } else {
      toast.error('Errore nell\'invio', {
        description: result.error || 'Riprova più tardi.',
      });
    }
  };

  const whatsappUrl = `https://wa.me/${config.app.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Ciao, vorrei informazioni sul noleggio auto.')}`;

  return (
    <div className="container py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Richiedi Informazioni</h1>
          <p className="text-muted-foreground">
            Compila il form e un nostro consulente ti contatterà
          </p>
          {vehicle && (
            <p className="mt-2 text-primary font-medium">
              {vehicle.marca} {vehicle.modello} {vehicle.versione}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>I Tuoi Dati</CardTitle>
              <CardDescription>
                Tutti i campi contrassegnati con * sono obbligatori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      {...form.register('nome')}
                      placeholder="Mario"
                    />
                    {form.formState.errors.nome && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.nome.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cognome">Cognome *</Label>
                    <Input
                      id="cognome"
                      {...form.register('cognome')}
                      placeholder="Rossi"
                    />
                    {form.formState.errors.cognome && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.cognome.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="mario.rossi@email.it"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Telefono *</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      {...form.register('telefono')}
                      placeholder="+39 333 1234567"
                    />
                    {form.formState.errors.telefono && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.telefono.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="azienda">Azienda</Label>
                    <Input
                      id="azienda"
                      {...form.register('azienda')}
                      placeholder="Nome Azienda Srl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partitaIva">Partita IVA</Label>
                    <Input
                      id="partitaIva"
                      {...form.register('partitaIva')}
                      placeholder="12345678901"
                    />
                    {form.formState.errors.partitaIva && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.partitaIva.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messaggio">Messaggio</Label>
                  <Textarea
                    id="messaggio"
                    {...form.register('messaggio')}
                    placeholder="Scrivi qui eventuali richieste o domande..."
                    rows={4}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacyAccepted"
                      checked={form.watch('privacyAccepted')}
                      onCheckedChange={(checked) =>
                        form.setValue('privacyAccepted', checked === true)
                      }
                    />
                    <Label htmlFor="privacyAccepted" className="text-sm leading-tight cursor-pointer">
                      Ho letto e accetto la{' '}
                      <a href="/privacy" className="text-primary underline" target="_blank">
                        Privacy Policy
                      </a>{' '}
                      *
                    </Label>
                  </div>
                  {form.formState.errors.privacyAccepted && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.privacyAccepted.message}
                    </p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketingAccepted"
                      checked={form.watch('marketingAccepted')}
                      onCheckedChange={(checked) =>
                        form.setValue('marketingAccepted', checked === true)
                      }
                    />
                    <Label htmlFor="marketingAccepted" className="text-sm leading-tight cursor-pointer">
                      Acconsento a ricevere comunicazioni commerciali
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createLead.isPending}
                >
                  {createLead.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Invia Richiesta
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferisci WhatsApp?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full text-green-600 border-green-600 hover:bg-green-50"
                  asChild
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Scrivici
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contatti Diretti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <a href={`mailto:${config.app.email}`} className="text-primary">
                    {config.app.email}
                  </a>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefono</p>
                  <a href={`tel:${config.app.phone}`} className="text-primary">
                    {config.app.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


