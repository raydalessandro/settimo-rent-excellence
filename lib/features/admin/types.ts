/**
 * Feature Admin - Types
 */

import type { Lead, LeadStatus, LeadSource, Quote, Vehicle } from '@/lib/core/storage';

/**
 * Dashboard stats
 */
export interface DashboardStats {
  leads: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byStatus: Record<LeadStatus, number>;
    bySource: Record<LeadSource, number>;
  };
  quotes: {
    total: number;
    today: number;
    thisWeek: number;
    avgValue: number;
  };
  conversions: {
    leadToQuote: number; // percentuale
    quoteToContact: number;
  };
  topVehicles: {
    mostViewed: VehicleStat[];
    mostConfigured: VehicleStat[];
    mostRequested: VehicleStat[];
  };
}

export interface VehicleStat {
  vehicleId: string;
  vehicleName: string;
  count: number;
}

/**
 * Lead con info veicolo e quote
 */
export interface LeadWithDetails extends Lead {
  vehicle?: Pick<Vehicle, 'id' | 'slug' | 'marca' | 'modello' | 'versione' | 'immagini'>;
  quote?: Pick<Quote, 'id' | 'pricing' | 'params'>;
}

/**
 * Filtri lista leads
 */
export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Filtri lista preventivi
 */
export interface QuoteFilters {
  status?: Quote['status'][];
  dateFrom?: string;
  dateTo?: string;
  vehicleId?: string;
  minValue?: number;
  maxValue?: number;
}

/**
 * Analytics data
 */
export interface AnalyticsData {
  pageViews: PageViewStat[];
  funnelStats: FunnelStat[];
  sourceStats: SourceStat[];
  vehicleStats: VehicleAnalytics[];
  dailyLeads: DailyStat[];
}

export interface PageViewStat {
  path: string;
  views: number;
  uniqueVisitors: number;
}

export interface FunnelStat {
  step: string;
  count: number;
  dropOffRate: number;
}

export interface SourceStat {
  source: LeadSource;
  leads: number;
  conversions: number;
  conversionRate: number;
}

export interface VehicleAnalytics {
  vehicleId: string;
  vehicleName: string;
  views: number;
  configurations: number;
  quotes: number;
  leads: number;
}

export interface DailyStat {
  date: string;
  leads: number;
  quotes: number;
}

/**
 * Export options
 */
export type ExportType = 'leads' | 'quotes' | 'analytics';

export interface ExportOptions {
  type: ExportType;
  filters?: LeadFilters | QuoteFilters;
  dateRange?: {
    from: string;
    to: string;
  };
}

/**
 * Admin navigation items
 */
export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Leads', href: '/admin/leads', icon: 'Users' },
  { label: 'Preventivi', href: '/admin/preventivi', icon: 'FileText' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Impostazioni', href: '/admin/impostazioni', icon: 'Settings' },
];


