/**
 * Configurator Module - API
 */

import { getVehicleById } from '@/lib/vehicles/api';
import type { Vehicle } from '@/lib/vehicles/types';
import type { ConfiguratorParams, ConfiguratorServices, QuoteResponse } from './types';

export async function calculateQuote(
  vehicleId: string,
  parametri: ConfiguratorParams,
  servizi: ConfiguratorServices
): Promise<QuoteResponse> {
  // Simula delay API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    throw new Error('Veicolo non trovato');
  }

  // Calcolo canone base
  let canoneBase = vehicle.canone_base;

  // Aggiustamenti per durata (sconto per durate più lunghe)
  const durataMultiplier = {
    12: 1.0,
    24: 0.95,
    36: 0.90,
    48: 0.85,
  };
  canoneBase *= durataMultiplier[parametri.durata as keyof typeof durataMultiplier] || 1.0;

  // Aggiustamenti per km/anno
  const kmMultiplier = {
    10000: 1.0,
    15000: 1.1,
    20000: 1.2,
    30000: 1.35,
  };
  canoneBase *= kmMultiplier[parametri.kmAnno as keyof typeof kmMultiplier] || 1.0;

  // Costo servizi
  const serviziCosts: Record<string, number> = {
    gps: 15,
    sostituzione: 25,
    consegna: 30,
    ritiro: 30,
    manutenzione: parametri.manutenzione ? 20 : 0,
    assicurazione: parametri.assicurazione ? 35 : 0,
  };

  const serviziTotal = servizi.servizi.reduce(
    (sum, servizio) => sum + (serviziCosts[servizio] || 0),
    0
  );

  const canone = Math.round(canoneBase + serviziTotal);
  const iva = Math.round(canone * 0.22);
  const totale = canone + iva;

  return {
    vehicle: {
      id: vehicle.id,
      marca: vehicle.marca,
      modello: vehicle.modello,
      versione: vehicle.versione,
      immagini: vehicle.immagini,
    },
    parametri,
    servizi: servizi.servizi,
    canone,
    totale,
    breakdown: {
      canoneBase: Math.round(vehicle.canone_base),
      durata: parametri.durata,
      kmAnno: parametri.kmAnno,
      servizi: serviziTotal,
      iva,
    },
  };
}

