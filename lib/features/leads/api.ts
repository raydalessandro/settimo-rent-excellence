/**
 * Feature Leads - API
 */

import type { Lead, CreateLeadData, LeadStatus, LeadsStorage } from '@/lib/core/storage';
import type { LeadFormData, LeadFormContext, CreateLeadResult } from './types';
import type { AttributionData } from '@/lib/core/attribution';
import { formatPhoneNumber } from './validation';

/**
 * Genera idempotency key
 */
function generateIdempotencyKey(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Crea un lead completo
 */
export async function createLead(
  storage: LeadsStorage,
  formData: LeadFormData,
  context: LeadFormContext,
  attribution: AttributionData | null
): Promise<CreateLeadResult> {
  try {
    const createData: CreateLeadData = {
      idempotencyKey: generateIdempotencyKey(),
      nome: formData.nome.trim(),
      cognome: formData.cognome.trim(),
      email: formData.email.toLowerCase().trim(),
      telefono: formatPhoneNumber(formData.telefono),
      azienda: formData.azienda?.trim(),
      partitaIva: formData.partitaIva?.trim(),
      messaggio: formData.messaggio?.trim(),
      privacyAccepted: formData.privacyAccepted,
      marketingAccepted: formData.marketingAccepted,
      vehicleId: context.vehicleId,
      quoteId: context.quoteId,
      funnelStep: context.funnelStep,
      source: attribution?.source || 'direct',
      utmCampaign: attribution?.utmCampaign || undefined,
      utmMedium: attribution?.utmMedium || undefined,
      utmSource: attribution?.utmSource || undefined,
      utmContent: attribution?.utmContent || undefined,
    };

    const lead = await storage.create(createData);
    return { success: true, lead };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nella creazione del lead',
    };
  }
}

/**
 * Crea un lead veloce (solo nome + telefono)
 */
export async function createQuickLead(
  storage: LeadsStorage,
  nome: string,
  telefono: string,
  context: LeadFormContext,
  attribution: AttributionData | null
): Promise<CreateLeadResult> {
  try {
    // Estrai nome e cognome se possibile
    const nameParts = nome.trim().split(' ');
    const firstName = nameParts[0] || nome;
    const lastName = nameParts.slice(1).join(' ') || '';

    const createData: CreateLeadData = {
      idempotencyKey: generateIdempotencyKey(),
      nome: firstName,
      cognome: lastName,
      email: '', // Verrà richiesto dopo
      telefono: formatPhoneNumber(telefono),
      privacyAccepted: true,
      marketingAccepted: false,
      vehicleId: context.vehicleId,
      quoteId: context.quoteId,
      funnelStep: context.funnelStep,
      source: attribution?.source || 'direct',
      utmCampaign: attribution?.utmCampaign || undefined,
      utmMedium: attribution?.utmMedium || undefined,
      utmSource: attribution?.utmSource || undefined,
      utmContent: attribution?.utmContent || undefined,
    };

    const lead = await storage.create(createData);
    return { success: true, lead };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nella creazione del lead',
    };
  }
}

/**
 * Aggiorna stato lead
 */
export async function updateLeadStatus(
  storage: LeadsStorage,
  leadId: string,
  status: LeadStatus,
  notes?: string
): Promise<{ success: boolean; lead?: Lead; error?: string }> {
  try {
    const lead = await storage.updateStatus(leadId, status, notes);
    return { success: true, lead };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore nell\'aggiornamento',
    };
  }
}

/**
 * Recupera tutti i lead
 */
export async function getAllLeads(storage: LeadsStorage): Promise<Lead[]> {
  return storage.getAll();
}

/**
 * Recupera lead per ID
 */
export async function getLeadById(storage: LeadsStorage, id: string): Promise<Lead | null> {
  return storage.getById(id);
}


