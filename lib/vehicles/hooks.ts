'use client';

/**
 * @deprecated Use '@/lib/features/catalog' or '@/lib/features/vehicle' instead
 */

export { 
  useVehicles,
  useFeaturedVehicles,
  useVehicleBrands,
  useVehicleCategories,
} from '@/lib/features/catalog';

export {
  useVehicle,
  useVehicleBySlug,
  useSimilarVehicles,
} from '@/lib/features/vehicle';
