/**
 * @deprecated Use '@/lib/features/configurator' instead
 */

export type { 
  ConfigParams as ConfiguratorParams, 
  ConfiguratorState,
  ConfigStep,
  ConfigQuote as Quote,
} from '@/lib/features/configurator';

export type { QuotePricing } from '@/lib/core/storage';

// Backward compatibility type
export interface ConfiguratorServices {
  servizi: string[];
}
