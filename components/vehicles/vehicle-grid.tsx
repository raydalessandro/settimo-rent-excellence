'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleImage } from '@/components/ui/vehicle-image';
import type { Vehicle } from '@/lib/vehicles/types';
import { Fuel, Users, Calendar } from 'lucide-react';

interface VehicleGridProps {
  vehicles: Vehicle[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 w-full bg-muted">
            {vehicle.immagini && vehicle.immagini.length > 0 && vehicle.immagini[0] ? (
              <VehicleImage
                src={vehicle.immagini[0]}
                alt={`${vehicle.marca} ${vehicle.modello}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Immagine non disponibile
              </div>
            )}
            {vehicle.anticipo_zero && (
              <Badge className="absolute top-2 right-2" variant="default">
                Anticipo Zero
              </Badge>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-lg">
              {vehicle.marca} {vehicle.modello}
            </CardTitle>
            <CardDescription>{vehicle.versione}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-xs">
                <Fuel className="h-3 w-3 mr-1" />
                {vehicle.fuel}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {vehicle.posti} posti
              </Badge>
              <Badge variant="outline" className="text-xs">
                {vehicle.categoria}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-primary">
              €{vehicle.canone_base}
              <span className="text-sm font-normal text-muted-foreground">/mese</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/veicoli/${vehicle.id}`} className="w-full">
              <Button className="w-full">Dettagli</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

