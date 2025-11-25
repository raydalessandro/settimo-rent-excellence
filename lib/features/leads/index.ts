/**
 * Feature Leads - Public Exports
 */

// Types
export type {
  Lead,
  LeadStatus,
  LeadSource,
  FunnelStep,
  CreateLeadData,
  LeadFormData,
  LeadFormContext,
  CreateLeadResult,
} from './types';

export {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS,
} from './types';

// Validation
export {
  leadFormSchema,
  quickLeadFormSchema,
  type LeadFormSchema,
  type QuickLeadFormSchema,
  validatePartitaIva,
  formatPhoneNumber,
} from './validation';

// API
export {
  createLead,
  createQuickLead,
  updateLeadStatus,
  getAllLeads,
  getLeadById,
} from './api';

// Hooks
export {
  useLeadForm,
  useQuickLeadForm,
  useCreateLead,
  useCreateQuickLead,
  useLeads,
  useUpdateLeadStatus,
  useLeadContextFromConfigurator,
} from './hooks';


