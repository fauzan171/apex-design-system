/**
 * Purchasing Service
 * Handles all Purchase Request (PR) operations
 * Real API integration
 *
 * OpenAPI endpoints:
 * - /api/v1/purchasing/purchase-requests/*
 * - /api/v1/purchasing/reports/*
 */

import type {
  PurchaseRequest,
  PRItem,
  PRStatusType,
  PRFilters,
  CreatePRRequest,
  UpdatePRRequest,
  SubmitPRRequest,
  ApprovePRRequest,
  RejectPRRequest,
  AddPRItemRequest,
  UpdatePRItemRequest,
  UpdateLeadTimeRequest,
  MarkAsProcessingRequest,
  MarkAsDOIssuedRequest,
  DeliveryOrderFromHO,
  PRAgingReport,
  PRStatusSummary,
} from "@/types/purchasing";
import { apiClient } from "@/lib/apiClient";

// ============================================
// PURCHASING SERVICE
// ============================================

export const purchasingService = {
  /**
   * Get all purchase requests with optional filters
   */
  getPRs: async (filters?: PRFilters): Promise<PurchaseRequest[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status);
    }
    if (filters?.startDate) {
      params.append("start_date", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("end_date", filters.endDate);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.priority) {
      params.append("priority", filters.priority);
    }
    if (filters?.mrId) {
      params.append("mr_id", filters.mrId);
    }

    const response = await apiClient.get<PurchaseRequest[]>(
      `/purchase-requests?${params.toString()}`
    );
    const data = response.data as any;
    // Handle paginated response: {items: [...], total, page} or raw array
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get a single purchase request by ID
   */
  getPRById: async (id: string): Promise<PurchaseRequest | null> => {
    const response = await apiClient.get<PurchaseRequest>(`/purchase-requests/${id}`);
    return response.data || null;
  },

  /**
   * Create a new purchase request
   */
  createPR: async (data: CreatePRRequest): Promise<PurchaseRequest> => {
    const response = await apiClient.post<PurchaseRequest>("/purchase-requests", data);
    if (!response.data) {
      throw new Error("Failed to create purchase request");
    }
    return response.data;
  },

  /**
   * Update a purchase request (only in Draft status)
   */
  updatePR: async (id: string, data: UpdatePRRequest): Promise<PurchaseRequest> => {
    const response = await apiClient.put<PurchaseRequest>(`/purchase-requests/${id}`, data);
    if (!response.data) {
      throw new Error("Failed to update purchase request");
    }
    return response.data;
  },

  /**
   * Delete a purchase request (only in Draft status)
   */
  deletePR: async (id: string): Promise<void> => {
    await apiClient.delete(`/purchase-requests/${id}`);
  },

  /**
   * Submit PR for approval
   */
  submitPR: async (id: string, data?: SubmitPRRequest): Promise<void> => {
    await apiClient.post(`/purchase-requests/${id}/submit`, data || {});
  },

  /**
   * Approve PR
   */
  approvePR: async (id: string, data?: ApprovePRRequest): Promise<void> => {
    await apiClient.post(`/purchase-requests/${id}/approve`, data || {});
  },

  /**
   * Reject PR
   */
  rejectPR: async (id: string, data: RejectPRRequest): Promise<void> => {
    await apiClient.post(`/purchase-requests/${id}/reject`, data);
  },

  /**
   * Mark PR as processing
   */
  markAsProcessing: async (id: string, data?: MarkAsProcessingRequest): Promise<void> => {
    await apiClient.post(`/purchase-requests/${id}/processing`, data || {});
  },

  /**
   * Mark PR as DO issued
   */
  markAsDOIssued: async (id: string, data: MarkAsDOIssuedRequest): Promise<void> => {
    await apiClient.post(`/purchase-requests/${id}/do-issued`, data);
  },

  /**
   * Cancel PR
   */
  cancelPR: async (id: string, reason?: string): Promise<void> => {
    await apiClient.post(`/purchase-requests/${id}/cancel`, { reason });
  },

  /**
   * Update PR status (legacy method for compatibility)
   */
  updatePRStatus: async (id: string, status: PRStatusType, notes?: string): Promise<void> => {
    await apiClient.patch(`/purchase-requests/${id}/status`, { status, notes });
  },

  /**
   * Add item to PR
   */
  addPRItem: async (prId: string, data: AddPRItemRequest): Promise<PRItem> => {
    const response = await apiClient.post<PRItem>(`/purchase-requests/${prId}/items`, data);
    if (!response.data) {
      throw new Error("Failed to add PR item");
    }
    return response.data;
  },

  /**
   * Update PR item
   */
  updatePRItem: async (prId: string, itemId: string, data: UpdatePRItemRequest): Promise<PRItem> => {
    const response = await apiClient.put<PRItem>(`/purchase-requests/${prId}/items/${itemId}`, data);
    if (!response.data) {
      throw new Error("Failed to update PR item");
    }
    return response.data;
  },

  /**
   * Delete PR item
   */
  deletePRItem: async (prId: string, itemId: string): Promise<void> => {
    await apiClient.delete(`/purchase-requests/${prId}/items/${itemId}`);
  },

  /**
   * Update lead time estimate
   */
  updateLeadTime: async (id: string, data: UpdateLeadTimeRequest): Promise<void> => {
    await apiClient.patch(`/purchase-requests/${id}/lead-time`, data);
  },

  /**
   * Add delivery order to PR
   */
  addDO: async (
    prId: string,
    data: {
      doNumber: string;
      doDate: string;
      notes?: string;
      document?: File;
      items: {
        prItemId: string;
        quantity: number;
      }[];
    }
  ): Promise<DeliveryOrderFromHO> => {
    // Handle file upload if present
    if (data.document) {
      const formData = new FormData();
      formData.append("do_number", data.doNumber);
      formData.append("do_date", data.doDate);
      if (data.notes) formData.append("notes", data.notes);
      formData.append("document", data.document);
      data.items.forEach((item, idx) => {
        formData.append(`items[${idx}][pr_item_id]`, item.prItemId);
        formData.append(`items[${idx}][quantity]`, String(item.quantity));
      });

    const response = await apiClient.post<DeliveryOrderFromHO>(
        `/purchase-requests/${prId}/delivery-orders`,
        formData
      );
      if (!response.data) {
        throw new Error("Failed to add delivery order");
      }
      return response.data;
    }

    const response = await apiClient.post<DeliveryOrderFromHO>(
      `/purchase-requests/${prId}/delivery-orders`,
      {
        do_number: data.doNumber,
        do_date: data.doDate,
        notes: data.notes,
        items: data.items.map((item) => ({
          pr_item_id: item.prItemId,
          quantity: item.quantity,
        })),
      }
    );
    if (!response.data) {
      throw new Error("Failed to add delivery order");
    }
    return response.data;
  },

  /**
   * Get PR aging report
   */
  getPRAgingReport: async (): Promise<PRAgingReport[]> => {
    const response = await apiClient.get<PRAgingReport[]>("/purchasing/reports/aging");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get PR status summary
   */
  getPRStatusSummary: async (): Promise<PRStatusSummary[]> => {
    const response = await apiClient.get<PRStatusSummary[]>("/purchasing/reports/status-summary");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Export PR report
   */
  exportPRReport: async (format: "csv" | "pdf"): Promise<void> => {
    // Trigger browser download
    const url = `${import.meta.env.VITE_API_URL || ""}/api/v1/purchasing/reports/export?format=${format}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `PR-Report-${new Date().toISOString().split("T")[0]}.${format}`;
    link.click();
  },

  /**
   * Get PRs pending approval (for managers)
   */
  getPRsPendingApproval: async (): Promise<PurchaseRequest[]> => {
    const response = await apiClient.get<PurchaseRequest[]>("/purchase-requests/pending-approval");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get PRs by status
   */
  getPRsByStatus: async (status: PRStatusType): Promise<PurchaseRequest[]> => {
    const response = await apiClient.get<PurchaseRequest[]>(`/purchase-requests?status=${status}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get PR statistics
   */
  getPRStatistics: async (): Promise<{
    total: number;
    byStatus: Record<PRStatusType, number>;
    avgProcessingTime: number;
    approvalRate: number;
  }> => {
    const response = await apiClient.get<{
      total: number;
      byStatus: Record<PRStatusType, number>;
      avgProcessingTime: number;
      approvalRate: number;
    }>("/purchasing/reports/statistics");
    return response.data || { total: 0, byStatus: {} as Record<PRStatusType, number>, avgProcessingTime: 0, approvalRate: 0 };
  },
};

// Export type for use in components
export type { PurchaseRequest, PRItem, PRFilters, CreatePRRequest, UpdatePRRequest };