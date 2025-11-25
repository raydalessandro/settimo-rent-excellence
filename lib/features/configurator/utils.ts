/**
 * Feature Configurator - Utilities
 */

import type { Vehicle } from '@/lib/core/storage';
import type { ConfigParams, ConfigUrlParams, ConfigService } from './types';
import { config, getDurataMultiplier, getKmMultiplier, getServizioPrice } from '@/lib/core/config';

/**
 * Parsing params da URL
 */
export function parseConfigFromUrl(searchParams: URLSearchParams): ConfigUrlParams {
  const result: ConfigUrlParams = {};

  const vehicleId = searchParams.get('vehicleId');
  if (vehicleId) result.vehicleId = vehicleId;

  const vehicleSlug = searchParams.get('vehicle');
  if (vehicleSlug) result.vehicleSlug = vehicleSlug;

  const durata = searchParams.get('durata');
  if (durata && config.funnel.durataOptions.includes(Number(durata) as 12 | 24 | 36 | 48)) {
    result.durata = Number(durata);
  }

  const kmAnno = searchParams.get('kmAnno') || searchParams.get('km');
  if (kmAnno && config.funnel.kmOptions.includes(Number(kmAnno) as 10000 | 15000 | 20000 | 30000)) {
    result.kmAnno = Number(kmAnno);
  }

  const anticipo = searchParams.get('anticipo');
  if (anticipo) {
    const anticipoNum = Number(anticipo);
    if (anticipoNum >= 0 && anticipoNum <= 100) {
      result.anticipo = anticipoNum;
    }
  }

  const manutenzione = searchParams.get('manutenzione');
  if (manutenzione) result.manutenzione = manutenzione === 'true' || manutenzione === '1';

  const assicurazione = searchParams.get('assicurazione');
  if (assicurazione) result.assicurazione = assicurazione === 'true' || assicurazione === '1';

  const servizi = searchParams.get('servizi');
  if (servizi) result.servizi = servizi.split(',').filter(Boolean);

  const utmSource = searchParams.get('utm_source');
  if (utmSource) result.utm_source = utmSource;

  const utmCampaign = searchParams.get('utm_campaign');
  if (utmCampaign) result.utm_campaign = utmCampaign;

  return result;
}

/**
 * Calcola il canone mensile
 */
export function calculateCanone(
  canoneBase: number,
  params: ConfigParams,
  selectedServices: string[]
): number {
  // Applica moltiplicatori durata e km
  let canone = canoneBase * getDurataMultiplier(params.durata) * getKmMultiplier(params.kmAnno);

  // Aggiungi manutenzione se selezionata
  if (params.manutenzione) {
    canone += getServizioPrice('manutenzione');
  }

  // Aggiungi assicurazione se selezionata
  if (params.assicurazione) {
    canone += getServizioPrice('assicurazione');
  }

  // Aggiungi servizi extra
  for (const serviceId of selectedServices) {
    canone += getServizioPrice(serviceId);
  }

  // Applica sconto anticipo (se > 0)
  if (params.anticipo > 0) {
    const scontoPercentuale = params.anticipo * 0.002; // 0.2% per ogni punto percentuale
    canone *= (1 - scontoPercentuale);
  }

  return Math.round(canone);
}

/**
 * Calcola il pricing completo
 */
export function calculatePricing(
  canoneBase: number,
  params: ConfigParams,
  selectedServices: string[]
): {
  canoneBase: number;
  serviziExtra: number;
  scontoAnticipo: number;
  subtotale: number;
  iva: number;
  totale: number;
  totalePeriodo: number;
} {
  // Canone base con moltiplicatori
  const canoneConMoltiplicatori = canoneBase * getDurataMultiplier(params.durata) * getKmMultiplier(params.kmAnno);

  // Costi servizi inclusi
  let serviziInclusi = 0;
  if (params.manutenzione) serviziInclusi += getServizioPrice('manutenzione');
  if (params.assicurazione) serviziInclusi += getServizioPrice('assicurazione');

  // Costi servizi extra
  let serviziExtra = 0;
  for (const serviceId of selectedServices) {
    serviziExtra += getServizioPrice(serviceId);
  }

  // Subtotale prima dello sconto
  const subtotaleLordo = canoneConMoltiplicatori + serviziInclusi + serviziExtra;

  // Calcola sconto anticipo
  const scontoAnticipo = params.anticipo > 0 
    ? Math.round(subtotaleLordo * params.anticipo * 0.002) 
    : 0;

  // Subtotale netto
  const subtotale = Math.round(subtotaleLordo - scontoAnticipo);

  // IVA
  const iva = Math.round(subtotale * config.quote.ivaRate);

  // Totale mensile
  const totale = subtotale + iva;

  // Totale per l'intero periodo
  const totalePeriodo = totale * params.durata;

  return {
    canoneBase: Math.round(canoneConMoltiplicatori),
    serviziExtra: serviziInclusi + serviziExtra,
    scontoAnticipo,
    subtotale,
    iva,
    totale,
    totalePeriodo,
  };
}

/**
 * Genera ID univoco per quote
 */
export function generateQuoteId(): string {
  return `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calcola data di scadenza quote
 */
export function getQuoteValidUntil(): string {
  const date = new Date();
  date.setDate(date.getDate() + config.quote.validityDays);
  return date.toISOString();
}

/**
 * Prepara lista servizi con stato
 */
export function prepareServices(selectedIds: string[]): ConfigService[] {
  return config.servizi
    .filter(s => !['manutenzione', 'assicurazione'].includes(s.id)) // Questi sono nei params
    .map(s => ({
      id: s.id,
      label: s.label,
      description: s.description,
      price: s.price,
      selected: selectedIds.includes(s.id),
    }));
}

/**
 * Valida che i km siano disponibili per il veicolo
 */
export function validateKmForVehicle(kmAnno: number, vehicle: Vehicle): number {
  if (vehicle.km_anno.includes(kmAnno)) {
    return kmAnno;
  }
  // Ritorna il primo disponibile
  return vehicle.km_anno[0] || 15000;
}

/**
 * Formatta prezzo per display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatta prezzo mensile
 */
export function formatMonthlyPrice(price: number): string {
  return `${formatPrice(price)}/mese`;
}


