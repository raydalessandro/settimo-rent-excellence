/**
 * Shared Constants
 * Costanti usate in tutta l'applicazione
 */

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  VEICOLI: '/veicoli',
  OFFERTE: '/offerte',
  CONFIGURA: '/configura',
  PREVENTIVO: '/preventivo',
  CONTATTO: '/contatto',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PREFERITI: '/preferiti',
  I_MIEI_PREVENTIVI: '/i-miei-preventivi',
} as const;

/**
 * Query keys per React Query
 */
export const QUERY_KEYS = {
  VEHICLES: 'vehicles',
  VEHICLE: 'vehicle',
  CATALOG: 'catalog',
  BRANDS: 'brands',
  CATEGORIES: 'categories',
  FEATURED: 'featured',
  QUOTES: 'quotes',
  QUOTE: 'quote',
  LEADS: 'leads',
  FAVORITES: 'favorites',
  ORDERS: 'orders',
  PROFILE: 'profile',
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  AUTH: 'rent_excellence_auth',
  ATTRIBUTION: 'rent_excellence_attribution',
  CONFIGURATOR: 'rent_excellence_configurator',
} as const;

/**
 * Breakpoints (matching Tailwind)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Animation durations (ms)
 */
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Z-index scale
 */
export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  toast: 200,
  tooltip: 300,
} as const;


