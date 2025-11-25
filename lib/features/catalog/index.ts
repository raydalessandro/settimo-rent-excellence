/**
 * Feature Catalog - Public Exports
 */

// Types
export type {
  Vehicle,
  VehicleCategory,
  FuelType,
  VehicleFilters,
  VehicleSearchParams,
  VehicleSearchResult,
  SortOption,
  SortOptionConfig,
  CatalogFiltersState,
  PriceRange,
} from './types';

export {
  SORT_OPTIONS,
  DEFAULT_FILTERS,
  PRICE_RANGES,
  CATEGORY_LABELS,
  FUEL_LABELS,
} from './types';

// API
export {
  filtersToSearchParams,
  searchVehicles,
  getBrands,
  getCategories,
  getFeaturedVehicles,
  getVehiclesByBrand,
  countVehicles,
} from './api';

// Hooks
export {
  useCatalogFilters,
  useCatalogSearch,
  useCatalogInfinite,
  useBrands,
  useCategories,
  useFeaturedVehicles,
  useCatalogSort,
  useCatalog,
} from './hooks';


