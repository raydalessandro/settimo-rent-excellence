'use client';

/**
 * Thank You Page
 * Pagina di conferma dopo invio lead
 */

import Link from 'next/link';
import { useFunnelStep } from '@/lib/core/attribution';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Home, Car, MessageCircle } from 'lucide-react';
import { config } from '@/lib/core/config';

export default function GraziePage() {
  // Track conversion
  useFunnelStep('conversion');

  const whatsappUrl = `https://wa.me/${config.app.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <div className="container py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Grazie!</h1>
          <p className="text-lg text-muted-foreground">
            La tua richiesta è stata inviata con successo.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="font-semibold mb-2">Cosa succede ora?</h2>
            <p className="text-muted-foreground text-sm">
              Un nostro consulente ti contatterà entro 24 ore lavorative per 
              discutere le tue esigenze e fornirti tutte le informazioni necessarie.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Nel frattempo, puoi:
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Torna alla Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/veicoli">
                <Car className="mr-2 h-4 w-4" />
                Esplora Altri Veicoli
              </Link>
            </Button>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Preferisci una risposta immediata?
            </p>
            <Button
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
              asChild
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Scrivici su WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


