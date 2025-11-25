/**
 * @deprecated Use '@/lib/features/catalog' or '@/lib/features/vehicle' instead
 */

export { 
  searchVehicles,
  getBrands,
  getCategories,
  getFeaturedVehicles,
  getVehiclesByBrand as getCatalogVehiclesByBrand,
  countVehicles,
} from '@/lib/features/catalog';

export {
  getVehicleById,
  getVehicleBySlug,
  getSimilarVehicles,
  getVehiclesByBrand,
  getVehiclesByCategory,
} from '@/lib/features/vehicle';
