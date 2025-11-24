/**
 * Database Centrale - Simula Supabase con Zustand + localStorage
 * Tutti i moduli comunicano ESCLUSIVAMENTE tramite questo database
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==================== TYPES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Favorite {
  userId: string;
  vehicleId: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  userId: string;
  vehicleId: string;
  data: QuoteData;
  createdAt: string;
}

export interface QuoteData {
  vehicle: {
    id: string;
    marca: string;
    modello: string;
    versione: string;
    immagini: string[];
  };
  parametri: {
    durata: number;
    anticipo: number;
    kmAnno: number;
    manutenzione: boolean;
    assicurazione: boolean;
  };
  servizi: string[];
  canone: number;
  totale: number;
}

export interface Order {
  id: string;
  userId: string | null; // null se guest
  quoteId: string | null; // null se non da preventivo
  nome: string;
  email: string;
  telefono: string;
  messaggio?: string;
  createdAt: string;
}

// ==================== DATABASE STATE ====================

interface DatabaseState {
  // Data
  users: User[];
  favorites: Favorite[];
  quotes: Quote[];
  orders: Order[];

  // User operations
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User;
  getUser: (id: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  updateUser: (id: string, updates: Partial<User>) => void;

  // Favorite operations
  addFavorite: (userId: string, vehicleId: string) => void;
  removeFavorite: (userId: string, vehicleId: string) => void;
  getFavoritesByUser: (userId: string) => Favorite[];
  isFavorite: (userId: string, vehicleId: string) => boolean;

  // Quote operations
  addQuote: (userId: string, vehicleId: string, data: QuoteData) => Quote;
  getQuotesByUser: (userId: string) => Quote[];
  getQuote: (id: string) => Quote | undefined;
  deleteQuote: (id: string) => void;

  // Order operations
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  getOrdersByUser: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

// ==================== DATABASE STORE ====================

export const useDatabase = create<DatabaseState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      favorites: [],
      quotes: [],
      orders: [],

      // User operations
      addUser: (userData) => {
        const newUser: User = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...userData,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
        return newUser;
      },

      getUser: (id) => {
        return get().users.find((u) => u.id === id);
      },

      getUserByEmail: (email) => {
        return get().users.find((u) => u.email === email);
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...updates } : u
          ),
        }));
      },

      // Favorite operations
      addFavorite: (userId, vehicleId) => {
        const existing = get().favorites.find(
          (f) => f.userId === userId && f.vehicleId === vehicleId
        );
        if (existing) return;

        const newFavorite: Favorite = {
          userId,
          vehicleId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          favorites: [...state.favorites, newFavorite],
        }));
      },

      removeFavorite: (userId, vehicleId) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.userId === userId && f.vehicleId === vehicleId)
          ),
        }));
      },

      getFavoritesByUser: (userId) => {
        return get().favorites.filter((f) => f.userId === userId);
      },

      isFavorite: (userId, vehicleId) => {
        return get().favorites.some(
          (f) => f.userId === userId && f.vehicleId === vehicleId
        );
      },

      // Quote operations
      addQuote: (userId, vehicleId, data) => {
        const newQuote: Quote = {
          id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          vehicleId,
          data,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          quotes: [...state.quotes, newQuote],
        }));
        return newQuote;
      },

      getQuotesByUser: (userId) => {
        return get()
          .quotes.filter((q) => q.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },

      getQuote: (id) => {
        return get().quotes.find((q) => q.id === id);
      },

      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        }));
      },

      // Order operations
      addOrder: (orderData) => {
        const newOrder: Order = {
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...orderData,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          orders: [...state.orders, newOrder],
        }));
        return newOrder;
      },

      getOrdersByUser: (userId) => {
        return get()
          .orders.filter((o) => o.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },

      getAllOrders: () => {
        return get().orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      },
    }),
    {
      name: 'rent-excellence-db',
      version: 1,
    }
  )
);

