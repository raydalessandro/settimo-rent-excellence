/**
 * Core Config - Environment Variables
 * Wrapper tipizzato per variabili d'ambiente
 */

function getEnvVar(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined') {
    // Client-side: usa solo variabili NEXT_PUBLIC_
    return (process.env as Record<string, string | undefined>)[`NEXT_PUBLIC_${key}`] || defaultValue;
  }
  // Server-side: può accedere a tutte le variabili
  return process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
}

function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, String(defaultValue));
  return value === 'true' || value === '1';
}

/**
 * Variabili d'ambiente tipizzate
 */
export const env = {
  // Node environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // App
  APP_URL: getEnvVar('APP_URL', 'http://localhost:3000'),
  
  // Storage
  STORAGE_TYPE: getEnvVar('STORAGE_TYPE', 'localStorage'),
  
  // API (per futuro Rent4Business)
  API_BASE_URL: getEnvVar('API_BASE_URL', ''),
  API_KEY: getEnvVar('API_KEY', ''),
  
  // Supabase (per futuro)
  SUPABASE_URL: getEnvVar('SUPABASE_URL', ''),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', ''),
  
  // Stripe (per futuro)
  STRIPE_PUBLISHABLE_KEY: getEnvVar('STRIPE_PUBLISHABLE_KEY', ''),
  STRIPE_SECRET_KEY: getEnvVar('STRIPE_SECRET_KEY', ''),
  STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET', ''),
  STRIPE_ENABLED: getEnvBool('STRIPE_ENABLED', false),
  
  // Analytics
  ANALYTICS_ENABLED: getEnvBool('ANALYTICS_ENABLED', true),
  GA_MEASUREMENT_ID: getEnvVar('GA_MEASUREMENT_ID', ''),
  
  // Contatti
  CONTACT_EMAIL: getEnvVar('CONTACT_EMAIL', 'info@rentexcellence.it'),
  CONTACT_PHONE: getEnvVar('CONTACT_PHONE', '+39 02 1234567'),
  WHATSAPP_NUMBER: getEnvVar('WHATSAPP_NUMBER', '+39 333 1234567'),
} as const;

/**
 * Verifica che le variabili richieste siano presenti
 * Chiamare in un middleware o all'avvio del server
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const requiredInProduction: string[] = [
    // Aggiungi qui le variabili richieste in produzione
    // 'API_KEY',
    // 'SUPABASE_URL',
  ];

  if (env.NODE_ENV !== 'production') {
    return { valid: true, missing: [] };
  }

  const missing = requiredInProduction.filter(key => !getEnvVar(key));
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Export type per env
export type Env = typeof env;


