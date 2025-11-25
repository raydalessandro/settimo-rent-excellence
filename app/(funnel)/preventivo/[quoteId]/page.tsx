'use client';

/**
 * Preventivo Page
 * Riepilogo preventivo con CTA per contatto
 */

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useConfiguratorQuote } from '@/lib/features/configurator';
import { useFunnelStep } from '@/lib/core/attribution';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Phone, 
  MessageCircle, 
  ArrowLeft,
  Calendar,
  Gauge,
  Shield,
  Wrench,
} from 'lucide-react';
import { config } from '@/lib/core/config';

export default function PreventivoPage({
  params,
}: {
  params: Promise<{ quoteId: string }>;
}) {
  const { quoteId } = use(params);
  const router = useRouter();
  const { quote, vehicleData } = useConfiguratorQuote();

  // Track funnel step
  useFunnelStep('quote_generated');

  const whatsappUrl = `https://wa.me/${config.app.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Ciao, ho appena creato un preventivo (ID: ${quoteId}) e vorrei maggiori informazioni.`)}`;

  if (!quote || !vehicleData) {
    return (
      <div className="container py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Preventivo non trovato</h1>
          <p className="text-muted-foreground mb-6">
            Il preventivo richiesto non è disponibile o è scaduto.
          </p>
          <Button onClick={() => router.push('/veicoli')}>
            Torna al Catalogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna indietro
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Il Tuo Preventivo</h1>
              <p className="text-muted-foreground">
                Preventivo #{quote.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Valido fino al {new Date(quote.validUntil).toLocaleDateString('it-IT')}
            </Badge>
          </div>
        </div>

        {/* Vehicle Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{quote.vehicle.marca} {quote.vehicle.modello}</span>
            </CardTitle>
            <CardDescription>{quote.vehicle.versione}</CardDescription>
          </CardHeader>
        </Card>

        {/* Configuration Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configurazione</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Durata</p>
                  <p className="font-medium">{quote.params.durata} mesi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Km/Anno</p>
                  <p className="font-medium">{quote.params.kmAnno.toLocaleString()}</p>
                </div>
              </div>
              {quote.params.manutenzione && (
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Manutenzione</p>
                    <p className="font-medium">Inclusa</p>
                  </div>
                </div>
              )}
              {quote.params.assicurazione && (
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assicurazione</p>
                    <p className="font-medium">Inclusa</p>
                  </div>
                </div>
              )}
            </div>

            {quote.servizi.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Servizi Extra</p>
                <div className="flex flex-wrap gap-2">
                  {quote.servizi.map((s) => (
                    <Badge key={s} variant="secondary">
                      {config.servizi.find(srv => srv.id === s)?.label || s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Dettaglio Costi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Canone Base</span>
                <span>€{quote.pricing.canoneBase}/mese</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Servizi</span>
                <span>€{quote.pricing.serviziExtra}/mese</span>
              </div>
              {quote.pricing.scontoAnticipo > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Sconto Anticipo</span>
                  <span>-€{quote.pricing.scontoAnticipo}/mese</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground">Subtotale</span>
                <span>€{quote.pricing.subtotale}/mese</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA (22%)</span>
                <span>€{quote.pricing.iva}/mese</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Totale Mensile</span>
                <span className="text-primary">€{quote.pricing.totale}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Costo totale per {quote.params.durata} mesi
              </p>
              <p className="text-3xl font-bold text-primary">
                €{(quote.pricing.totale * quote.params.durata).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Pronto a procedere?</CardTitle>
            <CardDescription>
              Un nostro consulente ti contatterà per finalizzare il noleggio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push(`/contatto?quoteId=${quote.id}&vehicleId=${quote.vehicle.id}`)}
              >
                <Phone className="mr-2 h-5 w-5" />
                Richiedi Contatto
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full text-green-600 border-green-600 hover:bg-green-50"
                asChild
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contattaci su WhatsApp
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


