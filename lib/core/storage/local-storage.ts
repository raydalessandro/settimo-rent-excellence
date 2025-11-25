/**
 * Core Storage - LocalStorage Implementation
 * Implementazione con persistenza in localStorage
 * Ideale per demo, test campagne e funzionamento offline
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
import { notFoundError, alreadyExistsError, storageFullError, handleStorageError } from './errors';

// @ts-ignore - JSON import
import vehiclesData from '@/data/vehicles.json';

// ==================== HELPERS ====================

const STORAGE_PREFIX = 'rent_excellence_';

function getStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSlug(marca: string, modello: string, versione: string): string {
  return `${marca}-${modello}-${versione}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function delay(ms: number = 50): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Safe localStorage access (SSR compatible)
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(getStorageKey(key));
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(value));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw storageFullError();
    }
    throw handleStorageError(error);
  }
}

function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getStorageKey(key));
  } catch {
    // Ignora errori di rimozione
  }
}

// ==================== VEHICLES (Read-only from JSON) ====================

// I veicoli vengono sempre letti dal JSON (arriveranno da API)
const vehicles: Vehicle[] = (vehiclesData.vehicles as Vehicle[]).map(v => ({
  ...v,
  slug: v.slug || generateSlug(v.marca, v.modello, v.versione),
}));

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
    await delay(100);
    
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

interface StoredUser extends User {
  password: string;
}

const userStorage: UserStorage = {
  async create(data: CreateUserData): Promise<User> {
    await delay();
    
    const users = getItem<Record<string, StoredUser>>('users', {});
    
    // Verifica se esiste già
    for (const user of Object.values(users)) {
      if (user.email === data.email) {
        throw alreadyExistsError('Utente', data.email);
      }
    }

    const now = new Date().toISOString();
    const user: StoredUser = {
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

    users[user.id] = user;
    setItem('users', users);
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getById(id: string): Promise<User | null> {
    await delay();
    const users = getItem<Record<string, StoredUser>>('users', {});
    const user = users[id];
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getByEmail(email: string): Promise<User | null> {
    await delay();
    const users = getItem<Record<string, StoredUser>>('users', {});
    for (const user of Object.values(users)) {
      if (user.email === email) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    await delay();
    const users = getItem<Record<string, StoredUser>>('users', {});
    const user = users[id];
    
    if (!user) {
      throw notFoundError('Utente', id);
    }

    const updatedUser: StoredUser = {
      ...user,
      ...data,
      id: user.id,
      updatedAt: new Date().toISOString(),
      password: user.password,
    };

    users[id] = updatedUser;
    setItem('users', users);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async authenticate(email: string, password: string): Promise<User | null> {
    await delay(150);
    const users = getItem<Record<string, StoredUser>>('users', {});
    
    for (const user of Object.values(users)) {
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
    
    const favorites = getItem<Record<string, Favorite>>('favorites', {});
    const key = `${userId}_${vehicleId}`;
    
    if (favorites[key]) {
      return favorites[key];
    }

    const favorite: Favorite = {
      id: generateId('fav'),
      userId,
      vehicleId,
      createdAt: new Date().toISOString(),
    };

    favorites[key] = favorite;
    setItem('favorites', favorites);
    return favorite;
  },

  async remove(userId: string, vehicleId: string): Promise<void> {
    await delay();
    const favorites = getItem<Record<string, Favorite>>('favorites', {});
    const key = `${userId}_${vehicleId}`;
    delete favorites[key];
    setItem('favorites', favorites);
  },

  async getByUser(userId: string): Promise<Favorite[]> {
    await delay();
    const favorites = getItem<Record<string, Favorite>>('favorites', {});
    return Object.values(favorites).filter(f => f.userId === userId);
  },

  async isFavorite(userId: string, vehicleId: string): Promise<boolean> {
    await delay();
    const favorites = getItem<Record<string, Favorite>>('favorites', {});
    const key = `${userId}_${vehicleId}`;
    return !!favorites[key];
  },

  async count(userId: string): Promise<number> {
    await delay();
    const favorites = getItem<Record<string, Favorite>>('favorites', {});
    return Object.values(favorites).filter(f => f.userId === userId).length;
  },
};

// ==================== QUOTES STORAGE ====================

const quotesStorage: QuotesStorage = {
  async create(data: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quote> {
    await delay();
    
    const quotes = getItem<Record<string, Quote>>('quotes', {});
    const now = new Date().toISOString();
    
    const quote: Quote = {
      ...data,
      id: generateId('quote'),
      createdAt: now,
      updatedAt: now,
    };

    quotes[quote.id] = quote;
    setItem('quotes', quotes);
    return quote;
  },

  async getById(id: string): Promise<Quote | null> {
    await delay();
    const quotes = getItem<Record<string, Quote>>('quotes', {});
    return quotes[id] || null;
  },

  async getByUser(userId: string): Promise<Quote[]> {
    await delay();
    const quotes = getItem<Record<string, Quote>>('quotes', {});
    return Object.values(quotes)
      .filter(q => q.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async update(id: string, data: Partial<Quote>): Promise<Quote> {
    await delay();
    
    const quotes = getItem<Record<string, Quote>>('quotes', {});
    const quote = quotes[id];
    
    if (!quote) {
      throw notFoundError('Preventivo', id);
    }

    const updatedQuote: Quote = {
      ...quote,
      ...data,
      id: quote.id,
      updatedAt: new Date().toISOString(),
    };

    quotes[id] = updatedQuote;
    setItem('quotes', quotes);
    return updatedQuote;
  },

  async delete(id: string): Promise<void> {
    await delay();
    const quotes = getItem<Record<string, Quote>>('quotes', {});
    delete quotes[id];
    setItem('quotes', quotes);
  },
};

// ==================== LEADS STORAGE ====================

const leadsStorage: LeadsStorage = {
  async create(data: CreateLeadData): Promise<Lead> {
    await delay();

    const leads = getItem<Record<string, Lead>>('leads', {});

    // Verifica idempotenza
    if (data.idempotencyKey) {
      for (const lead of Object.values(leads)) {
        if (lead.idempotencyKey === data.idempotencyKey) {
          return lead;
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

    leads[lead.id] = lead;
    setItem('leads', leads);
    return lead;
  },

  async getById(id: string): Promise<Lead | null> {
    await delay();
    const leads = getItem<Record<string, Lead>>('leads', {});
    return leads[id] || null;
  },

  async getByIdempotencyKey(key: string): Promise<Lead | null> {
    await delay();
    const leads = getItem<Record<string, Lead>>('leads', {});
    for (const lead of Object.values(leads)) {
      if (lead.idempotencyKey === key) {
        return lead;
      }
    }
    return null;
  },

  async getByUser(userId: string): Promise<Lead[]> {
    await delay();
    const leads = getItem<Record<string, Lead>>('leads', {});
    return Object.values(leads)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getAll(): Promise<Lead[]> {
    await delay();
    const leads = getItem<Record<string, Lead>>('leads', {});
    return Object.values(leads)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async updateStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead> {
    await delay();
    
    const leads = getItem<Record<string, Lead>>('leads', {});
    const lead = leads[id];
    
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

    leads[id] = updatedLead;
    setItem('leads', leads);
    return updatedLead;
  },
};

// ==================== LOCALSTORAGE PROVIDER ====================

export function createLocalStorage(): StorageProvider {
  return {
    vehicles: vehicleStorage,
    users: userStorage,
    favorites: favoritesStorage,
    quotes: quotesStorage,
    leads: leadsStorage,

    async isReady(): Promise<boolean> {
      if (typeof window === 'undefined') return false;
      try {
        const testKey = getStorageKey('_test');
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    },

    getProviderName(): string {
      return 'localStorage';
    },

    async clear(): Promise<void> {
      if (typeof window === 'undefined') return;
      
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    },
  };
}


