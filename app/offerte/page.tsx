'use client';

import { useState } from 'react';
import { useSearchVehicles } from '@/lib/vehicles/hooks';
import { VehicleGrid } from '@/components/vehicles/vehicle-grid';
import { VehicleFilters } from '@/components/vehicles/vehicle-filters';
import { DEFAULT_FILTERS, type CatalogFiltersState } from '@/lib/features/catalog';

export default function OffertePage() {
  const [filters, setFilters] = useState<CatalogFiltersState>({
    ...DEFAULT_FILTERS,
  });
  const { vehicles, isLoading } = useSearchVehicles(filters);

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catalogo Veicoli</h1>
        <p className="text-muted-foreground">
          Scegli tra oltre 200 veicoli disponibili
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <VehicleFilters filters={filters as any} onFiltersChange={setFilters as any} />
        </div>
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <VehicleGrid vehicles={vehicles} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessun veicolo trovato con i filtri selezionati.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





