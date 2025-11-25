/**
 * Core Analytics - Public Exports
 */

// Types
export type {
  AnalyticsEventName,
  AnalyticsEvent,
  AnalyticsEventPayload,
  BaseEventPayload,
  PageViewPayload,
  CatalogSearchPayload,
  VehicleViewPayload,
  ConfiguratorProgressPayload,
  QuoteGeneratedPayload,
  LeadSubmittedPayload,
  ConversionPayload,
  CTAClickPayload,
  ErrorPayload,
  AnalyticsConfig,
  AnalyticsAdapter,
} from './types';

// Tracker
export { tracker, AnalyticsTracker } from './tracker';

// Provider
export { AnalyticsProvider, useAnalytics } from './provider';

// Hooks
export {
  useAnalyticsInit,
  usePageView,
  useTrack,
  useTrackVehicleView,
  useTrackConfiguratorProgress,
  useTrackQuoteGenerated,
  useTrackLeadSubmitted,
  useTrackConversion,
  useTrackCTAClick,
  useTrackWhatsAppClick,
  useTrackCatalogSearch,
} from './hooks';


