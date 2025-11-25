/**
 * Feature Configurator - Public Exports
 */

// Types
export type {
  ConfigStep,
  ConfigStepInfo,
  ConfigParams,
  ConfigService,
  ConfigQuote,
  ConfiguratorState,
  ConfigUrlParams,
  QuoteCalculationResult,
} from './types';

export {
  CONFIG_STEPS,
  DEFAULT_CONFIG_PARAMS,
} from './types';

// Utils
export {
  parseConfigFromUrl,
  calculateCanone,
  calculatePricing,
  generateQuoteId,
  getQuoteValidUntil,
  prepareServices,
  validateKmForVehicle,
  formatPrice,
  formatMonthlyPrice,
} from './utils';

// Store
export { useConfiguratorStore } from './store';

// API
export { calculateQuote, saveQuote } from './api';

// Hooks
export {
  useConfigurator,
  useConfiguratorServices,
  useConfiguratorParams,
  useConfiguratorQuote,
  useSaveConfiguratorQuote,
  useInitConfiguratorWithVehicle,
} from './hooks';


