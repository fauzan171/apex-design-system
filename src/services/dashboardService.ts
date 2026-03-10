/**
 * Dashboard Service
 * Handles dashboard data aggregation and KPIs
 * Real API integration
 *
 * OpenAPI endpoints:
 * - /api/v1/dashboard/summary
 * - /api/v1/dashboard/production-kpis
 * - /api/v1/dashboard/delivery-kpis
 * - /api/v1/dashboard/inventory-kpis
 * - /api/v1/dashboard/purchasing-kpis
 * - /api/v1/dashboard/projects
 * - /api/v1/dashboard/alerts
 * - /api/v1/dashboard/comparison
 */

import type { DashboardData, DateRange } from "@/types";
import { apiClient } from "@/lib/apiClient";

// ============================================
// DASHBOARD SERVICE
// ============================================

export const dashboardService = {
  /**
   * Get dashboard summary data
   */
  getDashboardData: async (
    dateRange?: DateRange,
    projectId?: string
  ): Promise<DashboardData> => {
    const params = new URLSearchParams();
    if (dateRange) params.append("date_range", dateRange);
    if (projectId && projectId !== "all") params.append("project_id", projectId);

    const response = await apiClient.get<DashboardData>(`/dashboard/summary?${params.toString()}`);
    if (!response.data) {
      // Return default structure if no data
      return {
        production: {
          efficiency: 0,
          efficiencyTrend: 0,
          onTimeRate: 0,
          onTimeTrend: 0,
          qcPassRate: 0,
          qcTrend: 0,
          totalWOs: 0,
          dailyTrend: [],
          statusBreakdown: [],
        },
        delivery: {
          onTimeRate: 0,
          onTimeTrend: 0,
          avgLeadTime: 0,
          leadTimeTrend: 0,
          bastCompletion: 0,
          totalDOs: 0,
          dailyTrend: [],
          statusBreakdown: [],
        },
        inventory: {
          stockValue: 0,
          stockValueFormatted: "Rp 0",
          stockTrend: 0,
          lowStockCount: 0,
          byCategory: [],
          aging: [],
        },
        purchasing: {
          avgProcessingTime: 0,
          processingTrend: 0,
          approvalRate: 0,
          approvalTrend: 0,
          statusBreakdown: [],
          aging: [],
        },
        projects: [],
        alerts: [],
        comparison: [],
        lastUpdated: new Date(),
      };
    }
    return response.data;
  },

  /**
   * Get production KPIs
   */
  getProductionKPIs: async (dateRange?: DateRange): Promise<any> => {
    const params = new URLSearchParams();
    if (dateRange) params.append("date_range", dateRange);
    const response = await apiClient.get(`/dashboard/production-kpis?${params.toString()}`);
    return response.data || {};
  },

  /**
   * Get delivery KPIs
   */
  getDeliveryKPIs: async (dateRange?: DateRange): Promise<any> => {
    const params = new URLSearchParams();
    if (dateRange) params.append("date_range", dateRange);
    const response = await apiClient.get(`/dashboard/delivery-kpis?${params.toString()}`);
    return response.data || {};
  },

  /**
   * Get inventory KPIs
   */
  getInventoryKPIs: async (): Promise<any> => {
    const response = await apiClient.get("/dashboard/inventory-kpis");
    return response.data || {};
  },

  /**
   * Get purchasing KPIs
   */
  getPurchasingKPIs: async (dateRange?: DateRange): Promise<any> => {
    const params = new URLSearchParams();
    if (dateRange) params.append("date_range", dateRange);
    const response = await apiClient.get(`/dashboard/purchasing-kpis?${params.toString()}`);
    return response.data || {};
  },

  /**
   * Get dashboard alerts
   */
  getAlerts: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>("/dashboard/alerts");
    return response.data || [];
  },

  /**
   * Get project list for dropdown
   */
  getProjects: async (): Promise<{ value: string; label: string }[]> => {
    const response = await apiClient.get<{ id: string; name: string }[]>("/dashboard/projects");
    if (!response.data) return [{ value: "all", label: "All Projects" }];

    return [
      { value: "all", label: "All Projects" },
      ...response.data.map((p) => ({ value: p.id, label: p.name })),
    ];
  },
};

// Project and date range options for UI
export const projectOptions = [
  { value: "all", label: "All Projects" },
];

export const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "custom", label: "Custom Range" },
];