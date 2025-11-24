'use client';

import { useAuthState } from '@/lib/auth/hooks';
import { useFavoriteVehicles } from '@/lib/favorites/hooks';
import { VehicleGrid } from '@/components/vehicles/vehicle-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function PreferitiPage() {
  const { user, isAuthenticated } = useAuthState();
  const { data: vehicles, isLoading } = useFavoriteVehicles(user?.id || null);

  if (!isAuthenticated) {
    return (
      <div className="container py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Accesso Richiesto</CardTitle>
            <CardDescription>
              Accedi per visualizzare i tuoi veicoli preferiti
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="container py-8 px-4">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nessun preferito</h2>
          <p className="text-muted-foreground mb-6">
            Inizia ad aggiungere veicoli ai tuoi preferiti
          </p>
          <Link href="/offerte">
            <Button>Esplora Catalogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">I Miei Preferiti</h1>
        <p className="text-muted-foreground">
          {vehicles.length} veicolo{vehicles.length !== 1 ? 'i' : ''} salvato{vehicles.length !== 1 ? 'i' : ''}
        </p>
      </div>
      <VehicleGrid vehicles={vehicles} />
    </div>
  );
}

