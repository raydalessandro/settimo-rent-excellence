/**
 * Feature Catalog - Types
 */

// Re-export vehicle types from storage
export type {
  Vehicle,
  VehicleCategory,
  FuelType,
  VehicleFilters,
  VehicleSearchParams,
  VehicleSearchResult,
} from '@/lib/core/storage';

/**
 * Sort options for catalog
 */
export type SortOption = 
  | 'canone_asc' 
  | 'canone_desc' 
  | 'marca_asc' 
  | 'potenza_desc'
  | 'relevance';

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'relevance', label: 'Rilevanza' },
  { value: 'canone_asc', label: 'Prezzo: dal più basso' },
  { value: 'canone_desc', label: 'Prezzo: dal più alto' },
  { value: 'marca_asc', label: 'Marca: A-Z' },
  { value: 'potenza_desc', label: 'Potenza: dal più alto' },
];

/**
 * Filter state
 */
export interface CatalogFiltersState {
  marca: string[];
  categoria: string[];
  fuel: string[];
  anticipo_zero: boolean | undefined;
  canone_min: number | undefined;
  canone_max: number | undefined;
  search: string;
}

export const DEFAULT_FILTERS: CatalogFiltersState = {
  marca: [],
  categoria: [],
  fuel: [],
  anticipo_zero: undefined,
  canone_min: undefined,
  canone_max: undefined,
  search: '',
};

/**
 * Price ranges for filter
 */
export interface PriceRange {
  label: string;
  min: number;
  max: number | null;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: 'Fino a €300', min: 0, max: 300 },
  { label: '€300 - €500', min: 300, max: 500 },
  { label: '€500 - €700', min: 500, max: 700 },
  { label: 'Oltre €700', min: 700, max: null },
];

/**
 * Category labels
 */
export const CATEGORY_LABELS: Record<string, string> = {
  city: 'City Car',
  berlina: 'Berlina',
  suv: 'SUV',
  sportiva: 'Sportiva',
  commerciale: 'Commerciale',
  moto: 'Moto',
};

/**
 * Fuel labels
 */
export const FUEL_LABELS: Record<string, string> = {
  benzina: 'Benzina',
  diesel: 'Diesel',
  elettrico: 'Elettrico',
  ibrido: 'Ibrido',
  'plug-in': 'Plug-in Hybrid',
};


