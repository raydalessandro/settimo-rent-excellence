/**
 * Feature Vehicle - Public Exports
 */

// Types
export type {
  Vehicle,
  VehicleSpecs,
  VehicleGalleryImage,
  SimilarVehicle,
  VehicleDetailData,
} from './types';

export {
  extractSpecs,
  createGallery,
  toSimilarVehicle,
} from './types';

// API
export {
  getVehicleById,
  getVehicleBySlug,
  getSimilarVehicles,
  getVehiclesByBrand,
  getVehiclesByCategory,
} from './api';

// Hooks
export {
  useVehicle,
  useVehicleBySlug,
  useVehicleSpecs,
  useVehicleGallery,
  useSimilarVehicles,
  useVehiclesByBrand,
  useVehiclesByCategory,
  useVehicleDetail,
} from './hooks';


