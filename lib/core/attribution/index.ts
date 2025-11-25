/**
 * Core Attribution - Public Exports
 */

// Types
export type {
  UTMParams,
  Attribution,
  AttributionData,
  CampaignConfig,
} from './types';

export {
  SOURCE_MAPPING,
  FUNNEL_STEPS_ORDER,
  isStepAfter,
  getStepIndex,
} from './types';

// Utils
export {
  generateSessionId,
  parseUTMFromUrl,
  detectSource,
  createInitialAttribution,
  updateAttributionStep,
  getAttributionData,
  mergeAttribution,
  isAttributionExpired,
  getCanoneRange,
} from './utils';

// Store
export { useAttributionStore } from './store';

// Hooks
export {
  useAttribution,
  useFunnelStep,
  useSource,
  useUTM,
  useAttributionData,
  useCurrentStep,
  useVisitedSteps,
  useUpdateAttributionFromUrl,
  useSetFunnelStep,
  useIsFromCampaign,
  useIsFromSource,
} from './hooks';


