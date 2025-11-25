'use client';

/**
 * @deprecated Use '@/lib/features/catalog' or '@/lib/features/vehicle' instead
 */

// Import from catalog
import { 
  useCatalogSearch, 
  useFeaturedVehicles,
  useBrands,
  useCategories,
} from '@/lib/features/catalog';

// Import from vehicle
import { 
  useVehicle,
  useVehicleBySlug,
  useSimilarVehicles,
} from '@/lib/features/vehicle';

// Re-export with backward compatible names
export { useCatalogSearch as useVehicles };
export { useCatalogSearch as useSearchVehicles };
export { useFeaturedVehicles };
export { useBrands as useVehicleBrands };
export { useCategories as useVehicleCategories };
export { useVehicle };
export { useVehicleBySlug };
export { useSimilarVehicles };
