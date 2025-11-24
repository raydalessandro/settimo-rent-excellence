/**
 * Vehicles Module - Types
 */

export interface Vehicle {
  id: string;
  marca: string;
  modello: string;
  versione: string;
  categoria: 'city' | 'berlina' | 'suv' | 'sportiva' | 'commerciale' | 'moto';
  fuel: 'benzina' | 'diesel' | 'elettrico' | 'ibrido' | 'plug-in';
  immagini: string[];
  canone_base: number;
  anticipo_minimo: number;
  anticipo_zero: boolean;
  km_anno: number[];
  potenza: number;
  cilindrata: number;
  cambio: 'manuale' | 'automatico';
  posti: number;
  porte: number;
  bagagliaio: number;
  emissioni_co2: number;
  consumo_medio: number;
  disponibile: boolean;
  in_evidenza: boolean;
  descrizione?: string;
}

export interface VehicleFilters {
  marca?: string[];
  categoria?: string[];
  fuel?: string[];
  anticipo_zero?: boolean;
  canone_min?: number;
  canone_max?: number;
  disponibile?: boolean;
}

