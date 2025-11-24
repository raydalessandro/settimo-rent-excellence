/**
 * Configurator Module - Types
 */

export interface ConfiguratorStep {
  step: number;
  title: string;
  description: string;
}

export interface ConfiguratorParams {
  durata: number; // mesi: 12, 24, 36, 48
  anticipo: number; // percentuale o importo
  kmAnno: number; // 10000, 15000, 20000, 30000
  manutenzione: boolean;
  assicurazione: boolean;
}

export interface ConfiguratorServices {
  servizi: string[]; // ['gps', 'sostituzione', 'consegna', 'ritiro']
}

export interface ConfiguratorState {
  vehicleId: string | null;
  parametri: ConfiguratorParams | null;
  servizi: ConfiguratorServices | null;
  canone: number;
  totale: number;
}

export interface QuoteResponse {
  vehicle: {
    id: string;
    marca: string;
    modello: string;
    versione: string;
    immagini: string[];
  };
  parametri: ConfiguratorParams;
  servizi: string[];
  canone: number;
  totale: number;
  breakdown: {
    canoneBase: number;
    durata: number;
    kmAnno: number;
    servizi: number;
    iva: number;
  };
}

