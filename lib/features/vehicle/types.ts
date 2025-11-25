/**
 * Feature Vehicle - Types
 */

import type { Vehicle } from '@/lib/core/storage';

// Re-export Vehicle type
export type { Vehicle } from '@/lib/core/storage';

/**
 * Vehicle specs grouped
 */
export interface VehicleSpecs {
  performance: {
    potenza: number;
    cilindrata: number;
    cambio: 'manuale' | 'automatico';
  };
  dimensions: {
    posti: number;
    porte: number;
    bagagliaio: number;
  };
  efficiency: {
    fuel: string;
    emissioni_co2: number;
    consumo_medio: number;
  };
}

/**
 * Vehicle gallery image
 */
export interface VehicleGalleryImage {
  src: string;
  alt: string;
  index: number;
}

/**
 * Similar vehicle card
 */
export interface SimilarVehicle {
  id: string;
  slug: string;
  marca: string;
  modello: string;
  versione: string;
  canone_base: number;
  immagine: string;
}

/**
 * Vehicle detail page data
 */
export interface VehicleDetailData {
  vehicle: Vehicle;
  specs: VehicleSpecs;
  gallery: VehicleGalleryImage[];
  similar: SimilarVehicle[];
}

/**
 * Extract specs from vehicle
 */
export function extractSpecs(vehicle: Vehicle): VehicleSpecs {
  return {
    performance: {
      potenza: vehicle.potenza,
      cilindrata: vehicle.cilindrata,
      cambio: vehicle.cambio,
    },
    dimensions: {
      posti: vehicle.posti,
      porte: vehicle.porte,
      bagagliaio: vehicle.bagagliaio,
    },
    efficiency: {
      fuel: vehicle.fuel,
      emissioni_co2: vehicle.emissioni_co2,
      consumo_medio: vehicle.consumo_medio,
    },
  };
}

/**
 * Create gallery from vehicle images
 */
export function createGallery(vehicle: Vehicle): VehicleGalleryImage[] {
  return vehicle.immagini.map((src, index) => ({
    src,
    alt: `${vehicle.marca} ${vehicle.modello} - Immagine ${index + 1}`,
    index,
  }));
}

/**
 * Create similar vehicle card
 */
export function toSimilarVehicle(vehicle: Vehicle): SimilarVehicle {
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    marca: vehicle.marca,
    modello: vehicle.modello,
    versione: vehicle.versione,
    canone_base: vehicle.canone_base,
    immagine: vehicle.immagini[0] || '',
  };
}


