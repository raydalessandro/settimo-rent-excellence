/**
 * Core Analytics - Tracker
 * Classe principale per tracking eventi
 */

import type {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayload,
  AnalyticsConfig,
  AnalyticsAdapter,
  PageViewPayload,
  BaseEventPayload,
} from './types';
import type { FunnelStep, LeadSource } from '@/lib/core/storage';

/**
 * Tracker principale
 */
class AnalyticsTracker {
  private config: AnalyticsConfig = {
    enabled: true,
    debug: false,
  };
  
  private adapters: AnalyticsAdapter[] = [];
  private sessionId: string = '';
  private currentAttribution: {
    source?: LeadSource;
    utmCampaign?: string | null;
    utmMedium?: string | null;
    utmSource?: string | null;
  } = {};

  /**
   * Configura il tracker
   */
  configure(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Imposta il session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Imposta attribution corrente
   */
  setAttribution(attribution: {
    source?: LeadSource;
    utmCampaign?: string | null;
    utmMedium?: string | null;
    utmSource?: string | null;
  }): void {
    this.currentAttribution = attribution;
  }

  /**
   * Aggiunge un adapter (GA4, Mixpanel, etc.)
   */
  addAdapter(adapter: AnalyticsAdapter): void {
    this.adapters.push(adapter);
  }

  /**
   * Crea il payload base con contesto
   */
  private createBasePayload(funnelStep: FunnelStep): BaseEventPayload {
    return {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      funnelStep,
      source: this.currentAttribution.source,
      utmCampaign: this.currentAttribution.utmCampaign,
      utmMedium: this.currentAttribution.utmMedium,
      utmSource: this.currentAttribution.utmSource,
    };
  }

  /**
   * Traccia un evento generico
   */
  track<T extends AnalyticsEventPayload>(
    name: AnalyticsEventName,
    payload: Omit<T, keyof BaseEventPayload>,
    funnelStep: FunnelStep = 'homepage'
  ): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      name,
      payload: {
        ...this.createBasePayload(funnelStep),
        ...payload,
      } as T,
    };

    // Debug log
    if (this.config.debug) {
      console.log('[Analytics]', name, event.payload);
    }

    // Invia a tutti gli adapter
    this.adapters.forEach(adapter => {
      try {
        adapter.track(event);
      } catch (error) {
        console.error(`[Analytics] Error in ${adapter.name}:`, error);
      }
    });

    // Invia a dataLayer per GTM (se presente)
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: name,
        ...event.payload,
      });
    }
  }

  /**
   * Traccia una page view
   */
  page(path: string, title: string, funnelStep: FunnelStep): void {
    if (!this.config.enabled) return;

    const payload: PageViewPayload = {
      ...this.createBasePayload(funnelStep),
      path,
      title,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    // Debug log
    if (this.config.debug) {
      console.log('[Analytics] page_view', payload);
    }

    // Invia a tutti gli adapter
    this.adapters.forEach(adapter => {
      try {
        adapter.page(payload);
      } catch (error) {
        console.error(`[Analytics] Error in ${adapter.name}:`, error);
      }
    });

    // Invia a dataLayer per GTM
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: 'page_view',
        ...payload,
      });
    }
  }

  /**
   * Identifica un utente
   */
  identify(userId: string, traits?: Record<string, unknown>): void {
    if (!this.config.enabled) return;

    if (this.config.debug) {
      console.log('[Analytics] identify', userId, traits);
    }

    this.adapters.forEach(adapter => {
      try {
        adapter.identify(userId, traits);
      } catch (error) {
        console.error(`[Analytics] Error in ${adapter.name}:`, error);
      }
    });
  }

  /**
   * Verifica se il tracking è abilitato
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}

// Singleton instance
export const tracker = new AnalyticsTracker();

// Export class per testing
export { AnalyticsTracker };


