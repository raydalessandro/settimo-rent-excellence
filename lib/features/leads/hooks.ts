'use client';

/**
 * Feature Leads - React Hooks
 */

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { FunnelStep } from '@/lib/core/storage';
import { useLeadsStorage } from '@/lib/core/storage';
import { useAttributionData, useCurrentStep } from '@/lib/core/attribution';
import { useTrackLeadSubmitted, useTrackConversion } from '@/lib/core/analytics';
import { leadFormSchema, quickLeadFormSchema, type LeadFormSchema, type QuickLeadFormSchema } from './validation';
import { createLead, createQuickLead, updateLeadStatus, getAllLeads } from './api';
import type { LeadFormContext } from './types';

/**
 * Hook per form lead completo
 */
export function useLeadForm(context?: Partial<LeadFormContext>) {
  const form = useForm<LeadFormSchema>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      nome: '',
      cognome: '',
      email: '',
      telefono: '',
      azienda: '',
      partitaIva: '',
      messaggio: '',
      privacyAccepted: false,
      marketingAccepted: false,
    },
  });

  return form;
}

/**
 * Hook per form lead veloce
 */
export function useQuickLeadForm() {
  const form = useForm<QuickLeadFormSchema>({
    resolver: zodResolver(quickLeadFormSchema),
    defaultValues: {
      nome: '',
      telefono: '',
      privacyAccepted: false,
    },
  });

  return form;
}

/**
 * Hook per creare un lead
 */
export function useCreateLead(context?: Partial<LeadFormContext>) {
  const storage = useLeadsStorage();
  const attribution = useAttributionData();
  const currentStep = useCurrentStep();
  const trackLeadSubmitted = useTrackLeadSubmitted();
  const trackConversion = useTrackConversion();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: LeadFormSchema) => {
      const fullContext: LeadFormContext = {
        vehicleId: context?.vehicleId,
        quoteId: context?.quoteId,
        funnelStep: context?.funnelStep || currentStep,
      };

      return createLead(storage, { ...formData, marketingAccepted: formData.marketingAccepted ?? false }, fullContext, attribution);
    },
    onSuccess: (result) => {
      if (result.success && result.lead) {
        // Track lead submitted
        trackLeadSubmitted({
          leadId: result.lead.id,
          vehicleId: result.lead.vehicleId || undefined,
          quoteId: result.lead.quoteId || undefined,
          hasCompany: !!result.lead.azienda,
          marketingAccepted: result.lead.marketingAccepted,
        });

        // Track conversion
        trackConversion({
          conversionType: 'lead',
          leadId: result.lead.id,
          quoteId: result.lead.quoteId || undefined,
        });

        // Invalida cache leads
        queryClient.invalidateQueries({ queryKey: ['leads'] });
      }
    },
  });
}

/**
 * Hook per creare un lead veloce
 */
export function useCreateQuickLead(context?: Partial<LeadFormContext>) {
  const storage = useLeadsStorage();
  const attribution = useAttributionData();
  const currentStep = useCurrentStep();
  const trackLeadSubmitted = useTrackLeadSubmitted();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { nome: string; telefono: string }) => {
      const fullContext: LeadFormContext = {
        vehicleId: context?.vehicleId,
        quoteId: context?.quoteId,
        funnelStep: context?.funnelStep || currentStep,
      };

      return createQuickLead(storage, data.nome, data.telefono, fullContext, attribution);
    },
    onSuccess: (result) => {
      if (result.success && result.lead) {
        trackLeadSubmitted({
          leadId: result.lead.id,
          vehicleId: result.lead.vehicleId || undefined,
          quoteId: result.lead.quoteId || undefined,
          hasCompany: false,
          marketingAccepted: false,
        });

        queryClient.invalidateQueries({ queryKey: ['leads'] });
      }
    },
  });
}

/**
 * Hook per ottenere tutti i lead
 */
export function useLeads() {
  const storage = useLeadsStorage();

  return useQuery({
    queryKey: ['leads'],
    queryFn: () => getAllLeads(storage),
  });
}

/**
 * Hook per aggiornare stato lead
 */
export function useUpdateLeadStatus() {
  const storage = useLeadsStorage();
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
      return updateLeadStatus(storage, leadId, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

/**
 * Hook per contesto lead da configuratore
 */
export function useLeadContextFromConfigurator() {
  // Importa dinamicamente per evitare circular dependency
  const { useConfiguratorStore } = require('@/lib/features/configurator');
  const vehicleId = useConfiguratorStore((state: { vehicleId: string | null }) => state.vehicleId);
  const quote = useConfiguratorStore((state: { quote: { id: string } | null }) => state.quote);
  const currentStep = useCurrentStep();

  return {
    vehicleId: vehicleId || undefined,
    quoteId: quote?.id,
    funnelStep: currentStep,
  };
}



