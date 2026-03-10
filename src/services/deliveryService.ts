/**
 * Delivery Service
 * Handles all Delivery Order (outbound to HO) and BAST operations
 * Real API integration
 *
 * OpenAPI endpoints:
 * - /api/v1/delivery/orders/*
 * - /api/v1/delivery/reports/*
 * - /api/v1/warehouse/bast-outbound/*
 */

import type {
  DeliveryOrder,
  DOItem,
  DOStatusType,
  DOFilters,
  DOFormData,
  UpdateDORequest,
  DOItemFormData,
  BASTOutbound,
  FinishedGoodStock,
} from "@/types/delivery";
import { apiClient } from "@/lib/apiClient";

// ============================================
// DELIVERY SERVICE
// ============================================

export const deliveryService = {
  // ============================================
  // DELIVERY ORDER CRUD
  // ============================================

  getDOs: async (filters?: DOFilters): Promise<DeliveryOrder[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    if (filters?.search) params.append("search", filters.search);
    const response = await apiClient.get<DeliveryOrder[]>(`/delivery/orders?${params.toString()}`);
    const data = response.data as any;
    // Handle paginated response: {items: [...], total, page} or raw array
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getDOById: async (id: string): Promise<DeliveryOrder | null> => {
    const response = await apiClient.get<DeliveryOrder>(`/delivery/orders/${id}`);
    return response.data || null;
  },

  createDO: async (data: DOFormData): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>("/delivery/orders", data);
    if (!response.data) throw new Error("Failed to create delivery order");
    return response.data;
  },

  updateDO: async (id: string, data: UpdateDORequest): Promise<DeliveryOrder> => {
    const response = await apiClient.put<DeliveryOrder>(`/delivery/orders/${id}`, data);
    if (!response.data) throw new Error("Failed to update delivery order");
    return response.data;
  },

  deleteDO: async (id: string): Promise<void> => {
    await apiClient.delete(`/delivery/orders/${id}`);
  },

  // ============================================
  // DELIVERY ORDER STATUS TRANSITIONS
  // ============================================

  releaseDO: async (id: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/delivery/orders/${id}/release`);
    if (!response.data) throw new Error("Failed to release delivery order");
    return response.data;
  },

  startTransit: async (id: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/delivery/orders/${id}/transit`);
    if (!response.data) throw new Error("Failed to start transit");
    return response.data;
  },

  markDelivered: async (id: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/delivery/orders/${id}/deliver`);
    if (!response.data) throw new Error("Failed to mark as delivered");
    return response.data;
  },

  markReceived: async (id: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/delivery/orders/${id}/receive`);
    if (!response.data) throw new Error("Failed to mark as received");
    return response.data;
  },

  cancelDO: async (id: string, reason?: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/delivery/orders/${id}/cancel`, { reason });
    if (!response.data) throw new Error("Failed to cancel delivery order");
    return response.data;
  },

  // ============================================
  // DELIVERY ORDER ITEMS
  // ============================================

  addDOItem: async (doId: string, data: DOItemFormData): Promise<DOItem> => {
    const response = await apiClient.post<DOItem>(`/delivery/orders/${doId}/items`, data);
    if (!response.data) throw new Error("Failed to add item");
    return response.data;
  },

  updateDOItem: async (doId: string, itemId: string, data: { quantity?: number }): Promise<DOItem> => {
    const response = await apiClient.put<DOItem>(`/delivery/orders/${doId}/items/${itemId}`, data);
    if (!response.data) throw new Error("Failed to update item");
    return response.data;
  },

  removeDOItem: async (doId: string, itemId: string): Promise<void> => {
    await apiClient.delete(`/delivery/orders/${doId}/items/${itemId}`);
  },

  // ============================================
  // BAST (BERITA ACARA SERAH TERIMA)
  // ============================================

  uploadBAST: async (doId: string, file: File): Promise<BASTOutbound> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<BASTOutbound>(`/warehouse/bast-outbound/by-do/${doId}`, formData);
    if (!response.data) throw new Error("Failed to upload BAST");
    return response.data;
  },

  getBAST: async (doId: string): Promise<BASTOutbound | null> => {
    const response = await apiClient.get<BASTOutbound>(`/delivery/orders/${doId}/bast`);
    return response.data || null;
  },

  // ============================================
  // FINISHED GOODS STOCK
  // ============================================

  getFinishedGoodStock: async (): Promise<FinishedGoodStock[]> => {
    const response = await apiClient.get<FinishedGoodStock[]>("/warehouse/stock/finished-goods");
    return response.data || [];
  },

  // ============================================
  // REPORTS
  // ============================================

  getDOStatusSummary: async (): Promise<{ status: DOStatusType; count: number }[]> => {
    const response = await apiClient.get<{ status: DOStatusType; count: number }[]>("/delivery/reports/do-status-summary");
    return response.data || [];
  },

  getDeliveryMetrics: async (): Promise<{
    totalDOs: number;
    deliveredDOs: number;
    inTransitDOs: number;
    avgDeliveryTime: number;
    onTimeRate: number;
  }> => {
    const response = await apiClient.get<{
      totalDOs: number;
      deliveredDOs: number;
      inTransitDOs: number;
      avgDeliveryTime: number;
      onTimeRate: number;
    }>("/delivery/reports/metrics");
    return response.data || { totalDOs: 0, deliveredDOs: 0, inTransitDOs: 0, avgDeliveryTime: 0, onTimeRate: 0 };
  },

  exportDOReport: async (format: "csv" | "pdf"): Promise<void> => {
    const url = `${import.meta.env.VITE_API_URL || ""}/api/v1/delivery/reports/export?format=${format}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `DO-Report-${new Date().toISOString().split("T")[0]}.${format}`;
    link.click();
  },

  // ============================================
  // HELPERS
  // ============================================

  getDOsPendingDelivery: async (): Promise<DeliveryOrder[]> => {
    const response = await apiClient.get<DeliveryOrder[]>("/delivery/orders/pending");
    return response.data || [];
  },

  getDOsPendingBAST: async (): Promise<DeliveryOrder[]> => {
    const response = await apiClient.get<DeliveryOrder[]>("/delivery/orders/pending-bast");
    return response.data || [];
  },

  generateDONumber: async (): Promise<string> => {
    const response = await apiClient.get<{ do_number: string }>("/delivery/orders/generate-number");
    return response.data?.do_number || `DO-${Date.now()}`;
  },

  /**
   * Update DO status (for direct status changes)
   */
  updateDOStatus: async (id: string, status: DOStatusType, notes?: string): Promise<DeliveryOrder> => {
    const response = await apiClient.patch<DeliveryOrder>(`/delivery/orders/${id}/status`, { status, notes });
    if (!response.data) throw new Error("Failed to update DO status");
    return response.data;
  },

  /**
   * Print DO document
   */
  printDO: async (id: string): Promise<void> => {
    const url = `${import.meta.env.VITE_API_URL || ""}/api/v1/delivery/orders/${id}/print`;
    window.open(url, "_blank");
  },

  /**
   * Export packing list
   */
  exportPackingList: async (id: string, format: "pdf" | "xlsx" = "pdf"): Promise<void> => {
    const url = `${import.meta.env.VITE_API_URL || ""}/api/v1/delivery/orders/${id}/packing-list?format=${format}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `Packing-List-${id}.${format}`;
    link.click();
  },

  /**
   * Alias for getFinishedGoodStock (for backward compatibility)
   */
  getFinishedGoodsStock: async (): Promise<FinishedGoodStock[]> => {
    const response = await apiClient.get<FinishedGoodStock[]>("/warehouse/stock/finished-goods");
    return response.data || [];
  },
};

// Export types
export type { DeliveryOrder, DOItem, DOFilters, BASTOutbound, FinishedGoodStock };