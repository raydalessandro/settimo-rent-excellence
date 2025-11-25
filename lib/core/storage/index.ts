/**
 * Core Storage - Public Exports
 * Entry point per il modulo storage
 */

// Types
export type {
  // Vehicle
  Vehicle,
  VehicleCategory,
  FuelType,
  VehicleFilters,
  VehicleSearchParams,
  VehicleSearchResult,
  VehicleStorage,
  
  // User
  User,
  CreateUserData,
  UserStorage,
  
  // Favorites
  Favorite,
  FavoritesStorage,
  
  // Quotes
  Quote,
  QuoteParams,
  QuotePricing,
  QuoteStatus,
  QuotesStorage,
  
  // Leads
  Lead,
  LeadStatus,
  LeadSource,
  FunnelStep,
  CreateLeadData,
  LeadsStorage,
  
  // Provider
  StorageProvider,
  StorageType,
  StorageConfig,
} from './types';

// Errors
export {
  StorageError,
  type StorageErrorCode,
  notFoundError,
  alreadyExistsError,
  validationError,
  rateLimitedError,
  networkError,
  unauthorizedError,
  forbiddenError,
  providerError,
  storageFullError,
  isStorageError,
  handleStorageError,
} from './errors';

// Implementations
export { createMockStorage } from './mock-storage';
export { createLocalStorage } from './local-storage';

// React Provider & Hooks
export {
  StorageProviderComponent,
  createStorageProvider,
  useStorage,
  useVehicleStorage,
  useUserStorage,
  useFavoritesStorage,
  useQuotesStorage,
  useLeadsStorage,
  useStorageReady,
  useStorageProviderName,
} from './provider';


