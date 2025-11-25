/**
 * Core Storage - Mock Implementation
 * Implementazione in memoria per sviluppo veloce
 * I dati si perdono al refresh della pagina
 */

import type {
  StorageProvider,
  Vehicle,
  VehicleStorage,
  VehicleSearchParams,
  VehicleSearchResult,
  VehicleCategory,
  User,
  UserStorage,
  CreateUserData,
  Favorite,
  FavoritesStorage,
  Quote,
  QuotesStorage,
  Lead,
  LeadsStorage,
  CreateLeadData,
  LeadStatus,
} from './types';
import { notFoundError, alreadyExistsError } from './errors';

// Import dati veicoli
// @ts-ignore - JSON import
import vehiclesData from '@/data/vehicles.json';

// ==================== HELPERS ====================

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSlug(marca: string, modello: string, versione: string): string {
  return `${marca}-${modello}-${versione}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function delay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== MOCK DATA STORES ====================

// Prepara veicoli con slug
const vehicles: Vehicle[] = (vehiclesData.vehicles as Vehicle[]).map(v => ({
  ...v,
  slug: v.slug || generateSlug(v.marca, v.modello, v.versione),
}));

const users: Map<string, User & { password: string }> = new Map();
const favorites: Map<string, Favorite> = new Map();
const quotes: Map<string, Quote> = new Map();
const leads: Map<string, Lead> = new Map();

// ==================== DEMO DATA ====================

// Aggiungi utente admin demo
const adminUser: User & { password: string } = {
  id: 'user_admin',
  email: 'admin@settimo-rent.it',
  name: 'Admin',
  cognome: 'Sistema',
  phone: '+39 011 1234567',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  password: 'admin123',
};
users.set(adminUser.id, adminUser);

// Aggiungi leads demo
const demoLeads: Lead[] = [
  {
    id: 'lead_demo_1',
    idempotencyKey: 'idem_demo_1',
    nome: 'Marco',
    cognome: 'Rossi',
    email: 'marco.rossi@email.it',
    telefono: '+39 333 1234567',
    azienda: 'Rossi & Co. Srl',
    partitaIva: '01234567890',
    messaggio: 'Sono interessato al noleggio a lungo termine per la mia azienda. Vorrei maggiori informazioni.',
    privacyAccepted: true,
    marketingAccepted: true,
    vehicleId: vehicles[0]?.id || null,
    quoteId: null,
    funnelStep: 'contact',
    source: 'google_ads',
    utmCampaign: 'nlt_business_2024',
    utmMedium: 'cpc',
    utmSource: 'google',
    utmContent: 'ad_variant_a',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min fa
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'lead_demo_2',
    idempotencyKey: 'idem_demo_2',
    nome: 'Laura',
    cognome: 'Bianchi',
    email: 'laura.bianchi@gmail.com',
    telefono: '+39 339 9876543',
    azienda: null,
    partitaIva: null,
    messaggio: 'Vorrei un preventivo per uso personale',
    privacyAccepted: true,
    marketingAccepted: false,
    vehicleId: vehicles[1]?.id || null,
    quoteId: 'quote_demo_1',
    funnelStep: 'quote',
    source: 'instagram_ads',
    utmCampaign: 'promo_estate_2024',
    utmMedium: 'social',
    utmSource: 'instagram',
    utmContent: 'carousel_suv',
    status: 'contacted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 giorno fa
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    notes: 'Chiamata effettuata, molto interessata. Richiamata per lunedì.',
  },
  {
    id: 'lead_demo_3',
    idempotencyKey: 'idem_demo_3',
    nome: 'Giuseppe',
    cognome: 'Verdi',
    email: 'g.verdi@pec.it',
    telefono: '+39 347 1112233',
    azienda: 'Studio Verdi',
    partitaIva: '09876543210',
    messaggio: null,
    privacyAccepted: true,
    marketingAccepted: true,
    vehicleId: vehicles[2]?.id || null,
    quoteId: 'quote_demo_2',
    funnelStep: 'quote',
    source: 'facebook_ads',
    utmCampaign: 'nlt_professionisti',
    utmMedium: 'social',
    utmSource: 'facebook',
    utmContent: null,
    status: 'qualified',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 giorni fa
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Budget confermato. In attesa documenti.',
  },
  {
    id: 'lead_demo_4',
    idempotencyKey: 'idem_demo_4',
    nome: 'Anna',
    cognome: 'Ferrari',
    email: 'anna.ferrari@company.com',
    telefono: '+39 320 4445566',
    azienda: 'Ferrari Logistics SpA',
    partitaIva: '11223344556',
    messaggio: 'Siamo interessati a una flotta di 5 veicoli per i nostri commerciali.',
    privacyAccepted: true,
    marketingAccepted: true,
    vehicleId: vehicles[0]?.id || null,
    quoteId: 'quote_demo_3',
    funnelStep: 'quote',
    source: 'google_organic',
    utmCampaign: null,
    utmMedium: 'organic',
    utmSource: 'google',
    utmContent: null,
    status: 'won',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 giorni fa
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    convertedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notes: 'Contratto firmato per 5 veicoli! 🎉',
  },
  {
    id: 'lead_demo_5',
    idempotencyKey: 'idem_demo_5',
    nome: 'Paolo',
    cognome: 'Neri',
    email: 'p.neri@test.it',
    telefono: '+39 366 7778899',
    azienda: null,
    partitaIva: null,
    messaggio: 'Solo curiosità',
    privacyAccepted: true,
    marketingAccepted: false,
    vehicleId: null,
    quoteId: null,
    funnelStep: 'contact',
    source: 'direct',
    utmCampaign: null,
    utmMedium: null,
    utmSource: null,
    utmContent: null,
    status: 'lost',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 giorni fa
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    notes: 'Non interessato al momento, budget non sufficiente.',
  },
];

// Inizializza leads demo
demoLeads.forEach(lead => leads.set(lead.id, lead));

// ==================== VEHICLE STORAGE ====================

const vehicleStorage: VehicleStorage = {
  async getAll(): Promise<Vehicle[]> {
    await delay();
    return [...vehicles];
  },

  async getById(id: string): Promise<Vehicle | null> {
    await delay();
    return vehicles.find(v => v.id === id) || null;
  },

  async getBySlug(slug: string): Promise<Vehicle | null> {
    await delay();
    return vehicles.find(v => v.slug === slug) || null;
  },

  async getFeatured(limit: number = 8): Promise<Vehicle[]> {
    await delay();
    return vehicles
      .filter(v => v.in_evidenza && v.disponibile)
      .slice(0, limit);
  },

  async search(params: VehicleSearchParams): Promise<VehicleSearchResult> {
    await delay(150);
    
    let results = [...vehicles];
    const { filters, sort, page = 1, limit = 12 } = params;

    // Applica filtri
    if (filters) {
      if (filters.marca && filters.marca.length > 0) {
        results = results.filter(v => filters.marca!.includes(v.marca));
      }
      if (filters.categoria && filters.categoria.length > 0) {
        results = results.filter(v => filters.categoria!.includes(v.categoria));
      }
      if (filters.fuel && filters.fuel.length > 0) {
        results = results.filter(v => filters.fuel!.includes(v.fuel));
      }
      if (filters.anticipo_zero !== undefined) {
        results = results.filter(v => v.anticipo_zero === filters.anticipo_zero);
      }
      if (filters.canone_min !== undefined) {
        results = results.filter(v => v.canone_base >= filters.canone_min!);
      }
      if (filters.canone_max !== undefined) {
        results = results.filter(v => v.canone_base <= filters.canone_max!);
      }
      if (filters.disponibile !== undefined) {
        results = results.filter(v => v.disponibile === filters.disponibile);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        results = results.filter(v => 
          v.marca.toLowerCase().includes(search) ||
          v.modello.toLowerCase().includes(search) ||
          v.versione.toLowerCase().includes(search)
        );
      }
    }

    // Applica ordinamento
    if (sort) {
      switch (sort) {
        case 'canone_asc':
          results.sort((a, b) => a.canone_base - b.canone_base);
          break;
        case 'canone_desc':
          results.sort((a, b) => b.canone_base - a.canone_base);
          break;
        case 'marca_asc':
          results.sort((a, b) => a.marca.localeCompare(b.marca));
          break;
        case 'potenza_desc':
          results.sort((a, b) => b.potenza - a.potenza);
          break;
      }
    }

    // Paginazione
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedResults = results.slice(start, start + limit);

    return {
      vehicles: paginatedResults,
      total,
      page,
      totalPages,
    };
  },

  async getBrands(): Promise<string[]> {
    await delay();
    const brands = new Set(vehicles.map(v => v.marca));
    return Array.from(brands).sort();
  },

  async getCategories(): Promise<VehicleCategory[]> {
    await delay();
    const categories = new Set(vehicles.map(v => v.categoria));
    return Array.from(categories) as VehicleCategory[];
  },
};

// ==================== USER STORAGE ====================

const userStorage: UserStorage = {
  async create(data: CreateUserData): Promise<User> {
    await delay();
    
    // Verifica se esiste già
    for (const user of users.values()) {
      if (user.email === data.email) {
        throw alreadyExistsError('Utente', data.email);
      }
    }

    const now = new Date().toISOString();
    const user: User & { password: string } = {
      id: generateId('user'),
      email: data.email,
      name: data.name,
      cognome: data.cognome,
      phone: data.phone,
      company: data.company,
      role: data.role || 'user',
      createdAt: now,
      updatedAt: now,
      password: 'password123', // Mock password
    };

    users.set(user.id, user);
    
    // Ritorna senza password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getById(id: string): Promise<User | null> {
    await delay();
    const user = users.get(id);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getByEmail(email: string): Promise<User | null> {
    await delay();
    for (const user of users.values()) {
      if (user.email === email) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    await delay();
    const user = users.get(id);
    if (!user) {
      throw notFoundError('Utente', id);
    }

    const updatedUser = {
      ...user,
      ...data,
      id: user.id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    users.set(id, updatedUser);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async authenticate(email: string, password: string): Promise<User | null> {
    await delay(200); // Simula verifica password
    
    for (const user of users.values()) {
      if (user.email === email && user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  },
};

// ==================== FAVORITES STORAGE ====================

const favoritesStorage: FavoritesStorage = {
  async add(userId: string, vehicleId: string): Promise<Favorite> {
    await delay();
    
    const key = `${userId}_${vehicleId}`;
    if (favorites.has(key)) {
      return favorites.get(key)!;
    }

    const favorite: Favorite = {
      id: generateId('fav'),
      userId,
      vehicleId,
      createdAt: new Date().toISOString(),
    };

    favorites.set(key, favorite);
    return favorite;
  },

  async remove(userId: string, vehicleId: string): Promise<void> {
    await delay();
    const key = `${userId}_${vehicleId}`;
    favorites.delete(key);
  },

  async getByUser(userId: string): Promise<Favorite[]> {
    await delay();
    return Array.from(favorites.values()).filter(f => f.userId === userId);
  },

  async isFavorite(userId: string, vehicleId: string): Promise<boolean> {
    await delay();
    const key = `${userId}_${vehicleId}`;
    return favorites.has(key);
  },

  async count(userId: string): Promise<number> {
    await delay();
    return Array.from(favorites.values()).filter(f => f.userId === userId).length;
  },
};

// ==================== QUOTES STORAGE ====================

const quotesStorage: QuotesStorage = {
  async create(data: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quote> {
    await delay();
    
    const now = new Date().toISOString();
    const quote: Quote = {
      ...data,
      id: generateId('quote'),
      createdAt: now,
      updatedAt: now,
    };

    quotes.set(quote.id, quote);
    return quote;
  },

  async getById(id: string): Promise<Quote | null> {
    await delay();
    return quotes.get(id) || null;
  },

  async getByUser(userId: string): Promise<Quote[]> {
    await delay();
    return Array.from(quotes.values())
      .filter(q => q.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async update(id: string, data: Partial<Quote>): Promise<Quote> {
    await delay();
    
    const quote = quotes.get(id);
    if (!quote) {
      throw notFoundError('Preventivo', id);
    }

    const updatedQuote: Quote = {
      ...quote,
      ...data,
      id: quote.id, // Prevent ID change
      updatedAt: new Date().toISOString(),
    };

    quotes.set(id, updatedQuote);
    return updatedQuote;
  },

  async delete(id: string): Promise<void> {
    await delay();
    quotes.delete(id);
  },
};

// ==================== LEADS STORAGE ====================

const leadsStorage: LeadsStorage = {
  async create(data: CreateLeadData): Promise<Lead> {
    await delay();

    // Verifica idempotenza
    if (data.idempotencyKey) {
      for (const lead of leads.values()) {
        if (lead.idempotencyKey === data.idempotencyKey) {
          return lead; // Ritorna lead esistente
        }
      }
    }

    const now = new Date().toISOString();
    const lead: Lead = {
      id: generateId('lead'),
      idempotencyKey: data.idempotencyKey || generateId('idem'),
      nome: data.nome,
      cognome: data.cognome,
      email: data.email,
      telefono: data.telefono,
      azienda: data.azienda,
      partitaIva: data.partitaIva,
      messaggio: data.messaggio,
      privacyAccepted: data.privacyAccepted,
      marketingAccepted: data.marketingAccepted,
      vehicleId: data.vehicleId || null,
      quoteId: data.quoteId || null,
      funnelStep: data.funnelStep,
      source: data.source,
      utmCampaign: data.utmCampaign || null,
      utmMedium: data.utmMedium || null,
      utmSource: data.utmSource || null,
      utmContent: data.utmContent || null,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    leads.set(lead.id, lead);
    return lead;
  },

  async getById(id: string): Promise<Lead | null> {
    await delay();
    return leads.get(id) || null;
  },

  async getByIdempotencyKey(key: string): Promise<Lead | null> {
    await delay();
    for (const lead of leads.values()) {
      if (lead.idempotencyKey === key) {
        return lead;
      }
    }
    return null;
  },

  async getByUser(userId: string): Promise<Lead[]> {
    await delay();
    // In un sistema reale, i lead sarebbero associati agli utenti
    // Per ora ritorniamo tutti i lead (mock)
    return Array.from(leads.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getAll(): Promise<Lead[]> {
    await delay();
    return Array.from(leads.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async updateStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead> {
    await delay();
    
    const lead = leads.get(id);
    if (!lead) {
      throw notFoundError('Lead', id);
    }

    const updatedLead: Lead = {
      ...lead,
      status,
      notes: notes || lead.notes,
      updatedAt: new Date().toISOString(),
      convertedAt: status === 'won' ? new Date().toISOString() : lead.convertedAt,
    };

    leads.set(id, updatedLead);
    return updatedLead;
  },
};

// ==================== MOCK STORAGE PROVIDER ====================

export function createMockStorage(): StorageProvider {
  return {
    vehicles: vehicleStorage,
    users: userStorage,
    favorites: favoritesStorage,
    quotes: quotesStorage,
    leads: leadsStorage,

    async isReady(): Promise<boolean> {
      return true;
    },

    getProviderName(): string {
      return 'mock';
    },

    async clear(): Promise<void> {
      users.clear();
      favorites.clear();
      quotes.clear();
      leads.clear();
    },
  };
}

