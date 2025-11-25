'use client';

/**
 * Feature Admin - React Hooks
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLeadsStorage, useQuotesStorage, useVehicleStorage } from '@/lib/core/storage';
import { useRequireAuth } from '@/lib/features/auth';
import {
  getDashboardStats,
  getLeadsWithDetails,
  getAnalyticsData,
  generateLeadsCSV,
  downloadCSV,
} from './api';
import type { LeadFilters, LeadWithDetails } from './types';

/**
 * Hook per verificare accesso admin
 */
export function useRequireAdmin() {
  const isAuth = useRequireAuth('/login');
  // In real implementation, check if user.role === 'admin'
  return isAuth;
}

/**
 * Hook per stats dashboard
 */
export function useAdminDashboard() {
  const leadsStorage = useLeadsStorage();
  const quotesStorage = useQuotesStorage();
  const vehiclesStorage = useVehicleStorage();

  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => getDashboardStats(leadsStorage, quotesStorage, vehiclesStorage),
    refetchInterval: 60000, // Refresh ogni minuto
  });
}

/**
 * Hook per lista leads con filtri
 */
export function useAdminLeads(initialFilters?: LeadFilters) {
  const [filters, setFilters] = useState<LeadFilters>(initialFilters || {});
  const leadsStorage = useLeadsStorage();
  const vehiclesStorage = useVehicleStorage();

  const query = useQuery({
    queryKey: ['admin', 'leads', filters],
    queryFn: () => getLeadsWithDetails(leadsStorage, vehiclesStorage, filters),
  });

  const updateFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      (filters.status && filters.status.length > 0) ||
      (filters.source && filters.source.length > 0) ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.search
    );
  }, [filters]);

  return {
    leads: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    refetch: query.refetch,
  };
}

/**
 * Hook per singolo lead
 */
export function useAdminLead(leadId: string | null) {
  const leadsStorage = useLeadsStorage();
  const vehiclesStorage = useVehicleStorage();

  return useQuery({
    queryKey: ['admin', 'lead', leadId],
    queryFn: async () => {
      if (!leadId) return null;
      const leads = await getLeadsWithDetails(leadsStorage, vehiclesStorage);
      return leads.find(l => l.id === leadId) || null;
    },
    enabled: !!leadId,
  });
}

/**
 * Hook per aggiornare status lead
 */
export function useUpdateLeadStatus() {
  const leadsStorage = useLeadsStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      leadId, 
      status, 
      notes 
    }: { 
      leadId: string; 
      status: import('@/lib/core/storage').LeadStatus; 
      notes?: string 
    }) => {
      return leadsStorage.updateStatus(leadId, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

/**
 * Hook per analytics
 */
export function useAdminAnalytics() {
  const leadsStorage = useLeadsStorage();

  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => getAnalyticsData(leadsStorage),
  });
}

/**
 * Hook per export CSV
 */
export function useExportLeads() {
  const leadsStorage = useLeadsStorage();
  const vehiclesStorage = useVehicleStorage();

  return useMutation({
    mutationFn: async (filters?: LeadFilters) => {
      const leads = await getLeadsWithDetails(leadsStorage, vehiclesStorage, filters);
      const csv = generateLeadsCSV(leads);
      const filename = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csv, filename);
      return leads.length;
    },
  });
}

/**
 * Hook per conteggio leads nuovi (per badge)
 */
export function useNewLeadsCount() {
  const leadsStorage = useLeadsStorage();

  return useQuery({
    queryKey: ['admin', 'leads', 'new-count'],
    queryFn: async () => {
      const leads = await leadsStorage.getAll();
      return leads.filter(l => l.status === 'new').length;
    },
    refetchInterval: 30000, // Ogni 30 secondi
  });
}


