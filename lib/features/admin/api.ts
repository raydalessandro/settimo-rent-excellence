/**
 * Feature Admin - API
 */

import type { 
  Lead, 
  LeadStatus, 
  LeadSource, 
  Quote, 
  LeadsStorage, 
  QuotesStorage, 
  VehicleStorage 
} from '@/lib/core/storage';
import type { 
  DashboardStats, 
  LeadWithDetails, 
  LeadFilters,
  QuoteFilters,
  AnalyticsData,
  DailyStat,
  VehicleStat,
} from './types';

// ==================== HELPERS ====================

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo;
}

function isThisMonth(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function isInDateRange(dateStr: string, from?: string, to?: string): boolean {
  const date = new Date(dateStr);
  if (from && date < new Date(from)) return false;
  if (to && date > new Date(to)) return false;
  return true;
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats(
  leadsStorage: LeadsStorage,
  quotesStorage: QuotesStorage,
  vehiclesStorage: VehicleStorage
): Promise<DashboardStats> {
  const leads = await leadsStorage.getAll();
  const vehicles = await vehiclesStorage.getAll();

  // Lead stats
  const leadStats = {
    total: leads.length,
    today: leads.filter(l => isToday(l.createdAt)).length,
    thisWeek: leads.filter(l => isThisWeek(l.createdAt)).length,
    thisMonth: leads.filter(l => isThisMonth(l.createdAt)).length,
    byStatus: {} as Record<LeadStatus, number>,
    bySource: {} as Record<LeadSource, number>,
  };

  // Count by status
  const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'won', 'lost'];
  statuses.forEach(status => {
    leadStats.byStatus[status] = leads.filter(l => l.status === status).length;
  });

  // Count by source
  const sources: LeadSource[] = ['instagram_ads', 'instagram_bio', 'facebook_ads', 'google_ads', 'google_organic', 'direct', 'referral', 'whatsapp', 'unknown'];
  sources.forEach(source => {
    leadStats.bySource[source] = leads.filter(l => l.source === source).length;
  });

  // Quote stats (mock - in realtà verrebbero dal quotesStorage)
  const quoteStats = {
    total: leads.filter(l => l.quoteId).length,
    today: leads.filter(l => l.quoteId && isToday(l.createdAt)).length,
    thisWeek: leads.filter(l => l.quoteId && isThisWeek(l.createdAt)).length,
    avgValue: 450, // Mock
  };

  // Conversion rates
  const conversions = {
    leadToQuote: leads.length > 0 
      ? Math.round((leads.filter(l => l.quoteId).length / leads.length) * 100) 
      : 0,
    quoteToContact: 75, // Mock
  };

  // Top vehicles (mock - in realtà servirebbe analytics tracking)
  const vehicleMap = new Map(vehicles.map(v => [v.id, `${v.marca} ${v.modello}`]));
  
  // Count leads per vehicle
  const vehicleLeadCount = new Map<string, number>();
  leads.forEach(lead => {
    if (lead.vehicleId) {
      vehicleLeadCount.set(lead.vehicleId, (vehicleLeadCount.get(lead.vehicleId) || 0) + 1);
    }
  });

  const mostRequested: VehicleStat[] = Array.from(vehicleLeadCount.entries())
    .map(([vehicleId, count]) => ({
      vehicleId,
      vehicleName: vehicleMap.get(vehicleId) || 'Unknown',
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    leads: leadStats,
    quotes: quoteStats,
    conversions,
    topVehicles: {
      mostViewed: mostRequested, // Mock: stessi dati
      mostConfigured: mostRequested,
      mostRequested,
    },
  };
}

// ==================== LEADS ====================

export async function getLeadsWithDetails(
  leadsStorage: LeadsStorage,
  vehiclesStorage: VehicleStorage,
  filters?: LeadFilters
): Promise<LeadWithDetails[]> {
  let leads = await leadsStorage.getAll();

  // Apply filters
  if (filters) {
    if (filters.status && filters.status.length > 0) {
      leads = leads.filter(l => filters.status!.includes(l.status));
    }
    if (filters.source && filters.source.length > 0) {
      leads = leads.filter(l => filters.source!.includes(l.source));
    }
    if (filters.dateFrom || filters.dateTo) {
      leads = leads.filter(l => isInDateRange(l.createdAt, filters.dateFrom, filters.dateTo));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      leads = leads.filter(l => 
        l.nome.toLowerCase().includes(search) ||
        l.cognome.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        (l.azienda && l.azienda.toLowerCase().includes(search))
      );
    }
  }

  // Enrich with vehicle data
  const enrichedLeads: LeadWithDetails[] = await Promise.all(
    leads.map(async (lead) => {
      let vehicle;
      if (lead.vehicleId) {
        const v = await vehiclesStorage.getById(lead.vehicleId);
        if (v) {
          vehicle = {
            id: v.id,
            slug: v.slug,
            marca: v.marca,
            modello: v.modello,
            versione: v.versione,
            immagini: v.immagini,
          };
        }
      }
      return { ...lead, vehicle };
    })
  );

  return enrichedLeads;
}

export async function updateLeadNotes(
  leadsStorage: LeadsStorage,
  leadId: string,
  notes: string
): Promise<Lead | null> {
  // In a real implementation, we'd update the lead
  // For now, we just return null as the storage doesn't support notes update
  return null;
}

// ==================== QUOTES ====================

export async function getQuotesForAdmin(
  quotesStorage: QuotesStorage,
  filters?: QuoteFilters
): Promise<Quote[]> {
  // In real implementation, get all quotes with filters
  // For now, return empty as we don't have a getAll method for quotes
  return [];
}

// ==================== ANALYTICS ====================

export async function getAnalyticsData(
  leadsStorage: LeadsStorage
): Promise<AnalyticsData> {
  const leads = await leadsStorage.getAll();

  // Generate daily stats for last 30 days
  const dailyLeads: DailyStat[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayLeads = leads.filter(l => l.createdAt.startsWith(dateStr));
    dailyLeads.push({
      date: dateStr,
      leads: dayLeads.length,
      quotes: dayLeads.filter(l => l.quoteId).length,
    });
  }

  // Source stats
  const sources: LeadSource[] = ['instagram_ads', 'facebook_ads', 'google_ads', 'google_organic', 'direct', 'referral'];
  const sourceStats = sources.map(source => {
    const sourceLeads = leads.filter(l => l.source === source);
    const conversions = sourceLeads.filter(l => l.status === 'won').length;
    return {
      source,
      leads: sourceLeads.length,
      conversions,
      conversionRate: sourceLeads.length > 0 ? Math.round((conversions / sourceLeads.length) * 100) : 0,
    };
  }).filter(s => s.leads > 0);

  // Funnel stats (mock)
  const funnelStats = [
    { step: 'Catalogo', count: 1000, dropOffRate: 0 },
    { step: 'Dettaglio Veicolo', count: 450, dropOffRate: 55 },
    { step: 'Configuratore', count: 200, dropOffRate: 56 },
    { step: 'Preventivo', count: 120, dropOffRate: 40 },
    { step: 'Contatto', count: leads.length, dropOffRate: Math.round((1 - leads.length / 120) * 100) },
  ];

  return {
    pageViews: [], // Would need real analytics
    funnelStats,
    sourceStats,
    vehicleStats: [], // Would need real analytics
    dailyLeads,
  };
}

// ==================== EXPORT ====================

export function generateLeadsCSV(leads: LeadWithDetails[]): string {
  const headers = [
    'ID',
    'Data',
    'Nome',
    'Cognome',
    'Email',
    'Telefono',
    'Azienda',
    'P.IVA',
    'Veicolo',
    'Status',
    'Source',
    'Campagna',
    'Messaggio',
  ];

  const rows = leads.map(lead => [
    lead.id,
    new Date(lead.createdAt).toLocaleDateString('it-IT'),
    lead.nome,
    lead.cognome,
    lead.email,
    lead.telefono,
    lead.azienda || '',
    lead.partitaIva || '',
    lead.vehicle ? `${lead.vehicle.marca} ${lead.vehicle.modello}` : '',
    lead.status,
    lead.source,
    lead.utmCampaign || '',
    lead.messaggio || '',
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


