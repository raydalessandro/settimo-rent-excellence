'use client';

import { use } from 'react';
import { useVehicle } from '@/lib/vehicles/hooks';
import { useAuthState } from '@/lib/auth/hooks';
import { useFavoriteStatus, useToggleFavorite } from '@/lib/favorites/hooks';
import { useRouter } from 'next/navigation';
import { VehicleImage } from '@/components/ui/vehicle-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Fuel, Users, Calendar, Zap, Car, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: vehicle, isLoading } = useVehicle(id);
  const { user, isAuthenticated } = useAuthState();
  const { data: isFavorite = false } = useFavoriteStatus(user?.id || null, id);
  const toggleFavorite = useToggleFavorite();
  const router = useRouter();

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.info('Accedi per salvare i preferiti');
      router.push('/login');
      return;
    }

    toggleFavorite.mutate({
      userId: user!.id,
      vehicleId: id,
      isCurrentlyFavorite: isFavorite,
    });

    toast.success(isFavorite ? 'Rimosso dai preferiti' : 'Aggiunto ai preferiti');
  };

  const handleConfigure = () => {
    router.push(`/configuratore?vehicleId=${id}`);
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container py-8 px-4 text-center">
        <p className="text-muted-foreground">Veicolo non trovato</p>
        <Link href="/offerte">
          <Button className="mt-4">Torna al Catalogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <Link href="/offerte">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna al Catalogo
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Immagini */}
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {vehicle.immagini && vehicle.immagini.length > 0 ? (
                vehicle.immagini.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-96 w-full rounded-lg overflow-hidden bg-muted">
                      <VehicleImage
                        src={img}
                        alt={`${vehicle.marca} ${vehicle.modello} - Immagine ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="relative h-96 w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Immagine non disponibile</p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Dettagli */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {vehicle.marca} {vehicle.modello}
            </h1>
            <p className="text-xl text-muted-foreground">{vehicle.versione}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <Fuel className="h-4 w-4 mr-1" />
              {vehicle.fuel}
            </Badge>
            <Badge variant="outline">
              <Users className="h-4 w-4 mr-1" />
              {vehicle.posti} posti
            </Badge>
            <Badge variant="outline">{vehicle.categoria}</Badge>
            {vehicle.anticipo_zero && (
              <Badge variant="default">Anticipo Zero</Badge>
            )}
          </div>

          <div className="text-4xl font-bold text-primary">
            €{vehicle.canone_base}
            <span className="text-lg font-normal text-muted-foreground">/mese</span>
          </div>

          {vehicle.descrizione && (
            <p className="text-muted-foreground">{vehicle.descrizione}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Potenza</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicle.potenza} CV</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cilindrata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vehicle.cilindrata > 0 ? `${vehicle.cilindrata} cc` : 'Elettrico'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cambio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{vehicle.cambio}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bagagliaio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicle.bagagliaio} L</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button
              variant={isFavorite ? 'default' : 'outline'}
              onClick={handleToggleFavorite}
              disabled={toggleFavorite.isPending}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
              />
              {isFavorite ? 'Nei Preferiti' : 'Aggiungi ai Preferiti'}
            </Button>
            <Button onClick={handleConfigure} className="flex-1">
              Configura Preventivo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

