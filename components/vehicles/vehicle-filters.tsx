'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { VehicleFilters } from '@/lib/vehicles/types';
import { useVehicles } from '@/lib/vehicles/hooks';
import { useState, useEffect } from 'react';

interface VehicleFiltersProps {
  filters: VehicleFilters;
  onFiltersChange: (filters: VehicleFilters) => void;
}

export function VehicleFilters({ filters, onFiltersChange }: VehicleFiltersProps) {
  const { vehicles: allVehicles } = useVehicles({ marca: [], categoria: [], fuel: [], anticipo_zero: undefined, canone_min: undefined, canone_max: undefined, search: '' });
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  const brands = Array.from(new Set(allVehicles?.map((v) => v.marca) || [])).sort();
  const categories = Array.from(new Set(allVehicles?.map((v) => v.categoria) || [])).sort();
  const fuels = Array.from(new Set(allVehicles?.map((v) => v.fuel) || [])).sort();

  const updateFilter = <K extends keyof VehicleFilters>(
    key: K,
    value: VehicleFilters[K]
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'marca' | 'categoria' | 'fuel', value: string) => {
    setLocalFilters((prev) => {
      const current = (prev[key] as string[]) || [];
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValue.length > 0 ? newValue : undefined };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marca */}
        <div>
          <Label className="mb-3 block">Marca</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={(localFilters.marca || []).includes(brand)}
                  onCheckedChange={() => toggleArrayFilter('marca', brand)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Categoria */}
        <div>
          <Label className="mb-3 block">Categoria</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={(localFilters.categoria || []).includes(category)}
                  onCheckedChange={() => toggleArrayFilter('categoria', category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer capitalize"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Alimentazione */}
        <div>
          <Label className="mb-3 block">Alimentazione</Label>
          <div className="space-y-2">
            {fuels.map((fuel) => (
              <div key={fuel} className="flex items-center space-x-2">
                <Checkbox
                  id={`fuel-${fuel}`}
                  checked={(localFilters.fuel || []).includes(fuel)}
                  onCheckedChange={() => toggleArrayFilter('fuel', fuel)}
                />
                <Label
                  htmlFor={`fuel-${fuel}`}
                  className="text-sm font-normal cursor-pointer capitalize"
                >
                  {fuel}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Anticipo Zero */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anticipo-zero"
              checked={localFilters.anticipo_zero === true}
              onCheckedChange={(checked) =>
                updateFilter('anticipo_zero', checked ? true : undefined)
              }
            />
            <Label htmlFor="anticipo-zero" className="text-sm font-normal cursor-pointer">
              Solo Anticipo Zero
            </Label>
          </div>
        </div>

        {/* Canone */}
        <div>
          <Label className="mb-2 block">Canone Mensile</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="canone-min" className="text-xs text-muted-foreground">
                Min
              </Label>
              <Input
                id="canone-min"
                type="number"
                placeholder="0"
                value={localFilters.canone_min || ''}
                onChange={(e) =>
                  updateFilter('canone_min', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
            <div>
              <Label htmlFor="canone-max" className="text-xs text-muted-foreground">
                Max
              </Label>
              <Input
                id="canone-max"
                type="number"
                placeholder="1000"
                value={localFilters.canone_max || ''}
                onChange={(e) =>
                  updateFilter('canone_max', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



