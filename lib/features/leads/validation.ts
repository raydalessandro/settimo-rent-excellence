/**
 * Feature Leads - Validation
 * Schema Zod per validazione form
 */

import { z } from 'zod';

/**
 * Schema per validazione lead form
 */
export const leadFormSchema = z.object({
  nome: z
    .string()
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(50, 'Il nome non può superare 50 caratteri'),
  
  cognome: z
    .string()
    .min(2, 'Il cognome deve avere almeno 2 caratteri')
    .max(50, 'Il cognome non può superare 50 caratteri'),
  
  email: z
    .string()
    .email('Inserisci un indirizzo email valido'),
  
  telefono: z
    .string()
    .min(9, 'Il numero di telefono deve avere almeno 9 cifre')
    .max(15, 'Il numero di telefono non può superare 15 cifre')
    .regex(/^[+]?[\d\s-]+$/, 'Inserisci un numero di telefono valido'),
  
  azienda: z
    .string()
    .max(100, 'Il nome azienda non può superare 100 caratteri')
    .optional(),
  
  partitaIva: z
    .string()
    .regex(/^[0-9]{11}$/, 'La partita IVA deve essere composta da 11 cifre')
    .optional()
    .or(z.literal('')),
  
  messaggio: z
    .string()
    .max(1000, 'Il messaggio non può superare 1000 caratteri')
    .optional(),
  
  privacyAccepted: z
    .boolean()
    .refine(val => val === true, 'Devi accettare la privacy policy'),
  
  marketingAccepted: z.boolean().optional(),
});

export type LeadFormSchema = z.infer<typeof leadFormSchema>;

/**
 * Schema per lead veloce (solo nome + telefono)
 */
export const quickLeadFormSchema = z.object({
  nome: z
    .string()
    .min(2, 'Il nome deve avere almeno 2 caratteri'),
  
  telefono: z
    .string()
    .min(9, 'Inserisci un numero di telefono valido')
    .regex(/^[+]?[\d\s-]+$/, 'Inserisci un numero di telefono valido'),
  
  privacyAccepted: z
    .boolean()
    .refine(val => val === true, 'Devi accettare la privacy policy'),
});

export type QuickLeadFormSchema = z.infer<typeof quickLeadFormSchema>;

/**
 * Valida partita IVA italiana
 */
export function validatePartitaIva(piva: string): boolean {
  if (!piva || piva.length !== 11) return false;
  
  const digits = piva.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 11; i++) {
    if (i % 2 === 0) {
      sum += digits[i];
    } else {
      const doubled = digits[i] * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  
  return sum % 10 === 0;
}

/**
 * Formatta numero di telefono
 */
export function formatPhoneNumber(phone: string): string {
  // Rimuove tutto tranne numeri e +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Se inizia con 0039 o +39, standardizza
  if (cleaned.startsWith('0039')) {
    return '+39' + cleaned.slice(4);
  }
  if (cleaned.startsWith('39') && !cleaned.startsWith('+')) {
    return '+39' + cleaned.slice(2);
  }
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    return '+39' + cleaned;
  }
  
  return cleaned;
}



