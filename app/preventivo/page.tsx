'use client';

import { useSearchParams } from 'next/navigation';
import { useQuote } from '@/lib/quotes/hooks';
import { useVehicle } from '@/lib/vehicles/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderForm } from '@/components/orders/order-form';
import { QuotePDF } from '@/components/quotes/quote-pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { SavedQuote } from '@/lib/quotes/types';
import { Download } from 'lucide-react';
import Image from 'next/image';

export default function PreventivoPage() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('quoteId');
  const vehicleId = searchParams.get('vehicleId');
  
  const { data: savedQuote } = useQuote(quoteId || null);
  const { data: vehicle } = useVehicle(vehicleId || '');

  // Usa preventivo salvato o crea uno nuovo dal veicolo
  const quote = savedQuote;

  if (!quote && !vehicle) {
    return (
      <div className="container py-8 px-4 text-center">
        <p className="text-muted-foreground">Preventivo non trovato</p>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Il Tuo Preventivo</h1>
            <p className="text-muted-foreground">
              {quote
                ? `${quote?.vehicle?.marca} ${quote?.vehicle?.modello}`
                : vehicle
                ? `${vehicle.marca} ${vehicle.modello}`
                : ''}
            </p>
          </div>
          {quote && (
            <PDFDownloadLink
              document={<QuotePDF quote={savedQuote!} />}
              fileName={`preventivo-${savedQuote!.id}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? 'Generazione...' : 'Scarica PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>

        {quote && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo Preventivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Canone Mensile</p>
                    <p className="text-2xl font-bold">€{quote?.pricing?.totale}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durata</p>
                    <p className="text-2xl font-bold">{quote?.params?.durata} mesi</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Km/Anno</p>
                    <p className="text-2xl font-bold">{quote?.params?.kmAnno.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Totale</p>
                    <p className="text-2xl font-bold text-primary">€{quote?.pricing?.totale}</p>
                  </div>
                </div>

                {quote?.vehicle?.immagine && quote?.vehicle?.immagine && (
                  <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
                    <Image
                      src={quote?.vehicle?.immagine}
                      alt={`${quote?.vehicle?.marca} ${quote?.vehicle?.modello}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <OrderForm quoteId={savedQuote!.id} />
          </>
        )}
      </div>
    </div>
  );
}




