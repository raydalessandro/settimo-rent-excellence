'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeaturedVehicles } from '@/lib/vehicles/hooks';
import { VehicleGrid } from '@/components/vehicles/vehicle-grid';
import { Search, Car, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Noleggio Auto a Lungo Termine
            <br />
            <span className="text-primary">per la Tua Azienda</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Soluzioni personalizzate, flotta completa e servizi dedicati. 
            Scegli l'auto perfetta per la tua azienda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/offerte">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Esplora Catalogo
              </Button>
            </Link>
            <Link href="/configuratore">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Configura Preventivo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Car className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Flotta Completa</CardTitle>
                <CardDescription>
                  Oltre 200 veicoli tra city car, berline, SUV, commerciali e moto
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Servizi Dedicati</CardTitle>
                <CardDescription>
                  Manutenzione, assicurazione, GPS e supporto 24/7 inclusi
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Preventivi Rapidi</CardTitle>
                <CardDescription>
                  Configurazione online e preventivo in pochi minuti
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Veicoli in Evidenza</h2>
            <p className="text-muted-foreground">
              Scopri le nostre proposte più popolari
            </p>
          </div>
          <FeaturedVehiclesSection />
        </div>
      </section>
    </div>
  );
}

function FeaturedVehiclesSection() {
  const { data: vehicles, isLoading } = useFeaturedVehicles();

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-muted" />
          <CardHeader>
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </CardHeader>
        </Card>
      ))}
    </div>;
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nessun veicolo in evidenza al momento.</p>
      </div>
    );
  }

  return <VehicleGrid vehicles={vehicles} />;
}
