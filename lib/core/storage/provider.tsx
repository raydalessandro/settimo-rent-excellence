'use client';

/**
 * Core Storage - React Provider
 * Context e hooks per accedere allo StorageProvider in tutta l'app
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { StorageProvider, StorageType } from './types';
import { createMockStorage } from './mock-storage';
import { createLocalStorage } from './local-storage';

// ==================== CONTEXT ====================

interface StorageContextValue {
  storage: StorageProvider;
  isReady: boolean;
  providerName: string;
}

const StorageContext = createContext<StorageContextValue | null>(null);

// ==================== FACTORY ====================

export function createStorageProvider(type: StorageType): StorageProvider {
  switch (type) {
    case 'mock':
      return createMockStorage();
    case 'localStorage':
      return createLocalStorage();
    case 'supabase':
      // TODO: Implementare supabase-storage.ts
      console.warn('Supabase storage not implemented yet, falling back to localStorage');
      return createLocalStorage();
    default:
      return createLocalStorage();
  }
}

// ==================== PROVIDER COMPONENT ====================

interface StorageProviderProps {
  children: ReactNode;
  type?: StorageType;
}

export function StorageProviderComponent({ 
  children, 
  type = 'localStorage' 
}: StorageProviderProps) {
  const [storage] = useState(() => createStorageProvider(type));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    storage.isReady().then(setIsReady);
  }, [storage]);

  const value: StorageContextValue = {
    storage,
    isReady,
    providerName: storage.getProviderName(),
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}

// ==================== HOOKS ====================

/**
 * Hook per accedere allo storage completo
 */
export function useStorage(): StorageProvider {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProviderComponent');
  }
  return context.storage;
}

/**
 * Hook per accedere ai veicoli
 */
export function useVehicleStorage() {
  const storage = useStorage();
  return storage.vehicles;
}

/**
 * Hook per accedere agli utenti
 */
export function useUserStorage() {
  const storage = useStorage();
  return storage.users;
}

/**
 * Hook per accedere ai preferiti
 */
export function useFavoritesStorage() {
  const storage = useStorage();
  return storage.favorites;
}

/**
 * Hook per accedere ai preventivi
 */
export function useQuotesStorage() {
  const storage = useStorage();
  return storage.quotes;
}

/**
 * Hook per accedere ai lead
 */
export function useLeadsStorage() {
  const storage = useStorage();
  return storage.leads;
}

/**
 * Hook per verificare se lo storage è pronto
 */
export function useStorageReady(): boolean {
  const context = useContext(StorageContext);
  return context?.isReady ?? false;
}

/**
 * Hook per ottenere il nome del provider attivo
 */
export function useStorageProviderName(): string {
  const context = useContext(StorageContext);
  return context?.providerName ?? 'unknown';
}


