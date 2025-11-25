/**
 * Core Storage - Types
 * Interfacce astratte per tutti i moduli di storage
 * Permette switch facile tra mock, localStorage e Supabase
 */

// ==================== VEHICLE TYPES ====================

export interface Vehicle {
  id: string;
  slug: string;
  marca: string;
  modello: string;
  versione: string;
  categoria: VehicleCategory;
  fuel: FuelType;
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
  tags?: string[];
  promo?: {
    active: boolean;
    label: string;
    sconto?: number;
  };
}

export type VehicleCategory = 'city' | 'berlina' | 'suv' | 'sportiva' | 'commerciale' | 'moto';
export type FuelType = 'benzina' | 'diesel' | 'elettrico' | 'ibrido' | 'plug-in';

export interface VehicleFilters {
  marca?: string[];
  categoria?: VehicleCategory[];
  fuel?: FuelType[];
  anticipo_zero?: boolean;
  canone_min?: number;
  canone_max?: number;
  disponibile?: boolean;
  in_evidenza?: boolean;
  search?: string;
}

export interface VehicleSearchParams {
  filters?: VehicleFilters;
  sort?: 'canone_asc' | 'canone_desc' | 'marca_asc' | 'potenza_desc';
  page?: number;
  limit?: number;
}

export interface VehicleSearchResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  totalPages: number;
}

// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  name: string;
  cognome?: string;
  phone?: string;
  company?: string;
  partitaIva?: string;
  role: 'user' | 'admin' | 'agent';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  cognome?: string;
  phone?: string;
  company?: string;
  role?: 'user' | 'admin' | 'agent';
}

// ==================== FAVORITES TYPES ====================

export interface Favorite {
  id: string;
  userId: string;
  vehicleId: string;
  createdAt: string;
}

// ==================== QUOTE TYPES ====================

export interface Quote {
  id: string;
  userId: string | null;
  vehicleId: string;
  vehicle: {
    id: string;
    slug: string;
    marca: string;
    modello: string;
    versione: string;
    immagine: string;
  };
  params: QuoteParams;
  servizi: string[];
  pricing: QuotePricing;
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteParams {
  durata: number;
  anticipo: number;
  kmAnno: number;
  manutenzione: boolean;
  assicurazione: boolean;
}

export interface QuotePricing {
  canoneBase: number;
  serviziExtra: number;
  scontoAnticipo: number;
  subtotale: number;
  iva: number;
  totale: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

// ==================== LEAD TYPES ====================

export interface Lead {
  id: string;
  idempotencyKey: string;
  
  // Contatto
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  azienda?: string;
  partitaIva?: string;
  messaggio?: string;
  
  // Consensi
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  
  // Contesto Funnel
  vehicleId: string | null;
  quoteId: string | null;
  funnelStep: FunnelStep;
  
  // Attribution
  source: LeadSource;
  utmCampaign: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  utmContent: string | null;
  
  // Pipeline CRM
  status: LeadStatus;
  notes?: string;
  assignedTo?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  convertedAt?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export type LeadSource = 
  | 'instagram_ads' 
  | 'instagram_bio' 
  | 'facebook_ads'
  | 'google_ads' 
  | 'google_organic'
  | 'direct' 
  | 'referral'
  | 'whatsapp'
  | 'unknown';

export type FunnelStep = 
  | 'homepage'
  | 'catalog'
  | 'vehicle_detail' 
  | 'configurator_start'
  | 'configurator_params'
  | 'configurator_services'
  | 'quote_generated'
  | 'contact_form'
  | 'checkout'
  | 'checkout_fail'
  | 'whatsapp_click'
  | 'conversion';

export interface CreateLeadData {
  idempotencyKey?: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  azienda?: string;
  partitaIva?: string;
  messaggio?: string;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  vehicleId?: string;
  quoteId?: string;
  funnelStep: FunnelStep;
  source: LeadSource;
  utmCampaign?: string;
  utmMedium?: string;
  utmSource?: string;
  utmContent?: string;
}

// ==================== STORAGE INTERFACES ====================

export interface VehicleStorage {
  getAll(): Promise<Vehicle[]>;
  getById(id: string): Promise<Vehicle | null>;
  getBySlug(slug: string): Promise<Vehicle | null>;
  getFeatured(limit?: number): Promise<Vehicle[]>;
  search(params: VehicleSearchParams): Promise<VehicleSearchResult>;
  getBrands(): Promise<string[]>;
  getCategories(): Promise<VehicleCategory[]>;
}

export interface UserStorage {
  create(data: CreateUserData): Promise<User>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  authenticate(email: string, password: string): Promise<User | null>;
}

export interface FavoritesStorage {
  add(userId: string, vehicleId: string): Promise<Favorite>;
  remove(userId: string, vehicleId: string): Promise<void>;
  getByUser(userId: string): Promise<Favorite[]>;
  isFavorite(userId: string, vehicleId: string): Promise<boolean>;
  count(userId: string): Promise<number>;
}

export interface QuotesStorage {
  create(data: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quote>;
  getById(id: string): Promise<Quote | null>;
  getByUser(userId: string): Promise<Quote[]>;
  update(id: string, data: Partial<Quote>): Promise<Quote>;
  delete(id: string): Promise<void>;
}

export interface LeadsStorage {
  create(data: CreateLeadData): Promise<Lead>;
  getById(id: string): Promise<Lead | null>;
  getByIdempotencyKey(key: string): Promise<Lead | null>;
  getByUser(userId: string): Promise<Lead[]>;
  getAll(): Promise<Lead[]>;
  updateStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead>;
}

// ==================== STORAGE PROVIDER ====================

export interface StorageProvider {
  vehicles: VehicleStorage;
  users: UserStorage;
  favorites: FavoritesStorage;
  quotes: QuotesStorage;
  leads: LeadsStorage;
  
  // Utility
  isReady(): Promise<boolean>;
  getProviderName(): string;
  clear(): Promise<void>;
}

// ==================== STORAGE CONFIG ====================

export type StorageType = 'mock' | 'localStorage' | 'supabase';

export interface StorageConfig {
  type: StorageType;
  prefix?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}


