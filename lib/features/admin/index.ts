/**
 * Feature Admin - Public Exports
 */

// Types
export type {
  DashboardStats,
  VehicleStat,
  LeadWithDetails,
  LeadFilters,
  QuoteFilters,
  AnalyticsData,
  PageViewStat,
  FunnelStat,
  SourceStat,
  VehicleAnalytics,
  DailyStat,
  ExportType,
  ExportOptions,
  AdminNavItem,
} from './types';

export { ADMIN_NAV_ITEMS } from './types';

// API
export {
  getDashboardStats,
  getLeadsWithDetails,
  updateLeadNotes,
  getQuotesForAdmin,
  getAnalyticsData,
  generateLeadsCSV,
  downloadCSV,
} from './api';

// Hooks
export {
  useRequireAdmin,
  useAdminDashboard,
  useAdminLeads,
  useAdminLead,
  useUpdateLeadStatus,
  useAdminAnalytics,
  useExportLeads,
  useNewLeadsCount,
} from './hooks';


