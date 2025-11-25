'use client';

import { useAuthState } from '@/lib/auth/hooks';
import { useUserQuotes } from '@/lib/quotes/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { FileText, Download, Calendar } from 'lucide-react';
import { QuotePDF } from '@/components/quotes/quote-pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { SavedQuote } from '@/lib/quotes/types';

export default function MyQuotesPage() {
  const { user, isAuthenticated } = useAuthState();
  const { data: quotes, isLoading } = useUserQuotes();

  if (!isAuthenticated) {
    return (
      <div className="container py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Accesso Richiesto</CardTitle>
            <CardDescription>
              Accedi per visualizzare i tuoi preventivi salvati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button>Accedi</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <div className="container py-8 px-4">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nessun preventivo salvato</h2>
          <p className="text-muted-foreground mb-6">
            Configura un preventivo per salvarlo qui
          </p>
          <Link href="/configuratore">
            <Button>Crea Preventivo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">I Miei Preventivi</h1>
        <p className="text-muted-foreground">
          {quotes.length} preventivo{quotes.length !== 1 ? 'i' : ''} salvato{quotes.length !== 1 ? 'i' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {quotes.map((quote) => (
          <Card key={quote.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>
                    {quote.vehicle.marca} {quote.vehicle.modello}
                  </CardTitle>
                  <CardDescription>{quote.vehicle.versione}</CardDescription>
                </div>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(quote.createdAt), 'dd MMM yyyy', { locale: it })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Canone Mensile</p>
                  <p className="text-xl font-bold">€{quote.pricing.totale}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durata</p>
                  <p className="text-xl font-bold">{quote.params.durata} mesi</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Km/Anno</p>
                  <p className="text-xl font-bold">{quote.params.kmAnno.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Totale</p>
                  <p className="text-xl font-bold text-primary">€{quote.pricing.totale}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <PDFDownloadLink
                  document={<QuotePDF quote={quote} />}
                  fileName={`preventivo-${quote.id}.pdf`}
                  className="inline-block"
                >
                  {({ blob, url, loading, error }) => (
                    <Button variant="outline" disabled={loading}>
                      <Download className="mr-2 h-4 w-4" />
                      {loading ? 'Generazione...' : 'Scarica PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>
                <Link href={`/preventivo?quoteId=${quote.id}`}>
                  <Button variant="outline">Visualizza</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}






