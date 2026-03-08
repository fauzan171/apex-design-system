/**
 * Purchasing Service
 * Handles all Purchase Request (PR) operations
 * Automatically switches between mock data and real API based on environment
 */

import type {
  PurchaseRequest,
  PRItem,
  PRStatusType,
  PRPriorityType,
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
import { PRStatus, PRPriority } from "@/types/purchasing";
import { apiClient } from "@/lib/apiClient";

// Check if using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Import mock data and service only when needed
let mockPurchasingService: typeof import("@/data/mockPurchasingData").purchasingService | null = null;

const getMockService = async () => {
  if (!mockPurchasingService) {
    const module = await import("@/data/mockPurchasingData");
    mockPurchasingService = module.purchasingService;
  }
  return mockPurchasingService;
};

// ============================================
// PURCHASING SERVICE
// ============================================

export const purchasingService = {
  /**
   * Get all purchase requests with optional filters
   */
  getPRs: async (filters?: PRFilters): Promise<PurchaseRequest[]> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPRs({
        status: filters?.status,
        dateFrom: filters?.startDate || filters?.dateFrom,
        dateTo: filters?.endDate || filters?.dateTo,
        search: filters?.search,
      });
    }

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
    return response.data || [];
  },

  /**
   * Get a single purchase request by ID
   */
  getPRById: async (id: string): Promise<PurchaseRequest | null> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPRById(id);
    }

    const response = await apiClient.get<PurchaseRequest>(`/purchase-requests/${id}`);
    return response.data || null;
  },

  /**
   * Create a new purchase request
   */
  createPR: async (data: CreatePRRequest): Promise<PurchaseRequest> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      // Convert to mock format
      return mock.createPR({
        requestDate: new Date().toISOString().split("T")[0],
        requiredDate: data.required_date,
        notes: data.notes,
        sourcePlanId: data.mr_id,
        sourcePlanNumber: data.mr_id,
        items: data.items.map((item) => ({
          materialId: item.materialId,
          materialCode: item.materialId,
          materialName: item.materialId,
          quantity: item.quantityRequested,
          unit: "Unit",
          notes: item.notes,
        })),
      });
    }

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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.updatePR(id, {
        requestDate: new Date().toISOString().split("T")[0],
        requiredDate: data.required_date,
        notes: data.notes,
        items: data.items?.map((item) => ({
          id: item.id,
          materialId: item.materialId || "",
          materialCode: item.materialId || "",
          materialName: item.materialId || "",
          quantity: item.quantityRequested || 0,
          unit: "Unit",
          notes: item.notes,
        })),
      });
    }

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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.deletePR(id);
    }

    await apiClient.delete(`/purchase-requests/${id}`);
  },

  /**
   * Submit PR for approval
   */
  submitPR: async (id: string, data?: SubmitPRRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.submitPR(id);
    }

    await apiClient.post(`/purchase-requests/${id}/submit`, data || {});
  },

  /**
   * Approve PR
   */
  approvePR: async (id: string, data?: ApprovePRRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.approvePR(id, data?.notes);
    }

    await apiClient.post(`/purchase-requests/${id}/approve`, data || {});
  },

  /**
   * Reject PR
   */
  rejectPR: async (id: string, data: RejectPRRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.rejectPR(id, data.reason);
    }

    await apiClient.post(`/purchase-requests/${id}/reject`, data);
  },

  /**
   * Mark PR as processing
   */
  markAsProcessing: async (id: string, data?: MarkAsProcessingRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      // Mock doesn't have this method directly, simulate status update
      const mock = await getMockService();
      return mock.updatePRStatus(id, PRStatus.PROCESSING, "Marked as processing");
    }

    await apiClient.post(`/purchase-requests/${id}/processing`, data || {});
  },

  /**
   * Mark PR as DO issued
   */
  markAsDOIssued: async (id: string, data: MarkAsDOIssuedRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.updatePRStatus(id, PRStatus.DO_ISSUED, `DO ${data.do_number} issued`);
    }

    await apiClient.post(`/purchase-requests/${id}/do-issued`, data);
  },

  /**
   * Cancel PR
   */
  cancelPR: async (id: string, reason?: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.updatePRStatus(id, PRStatus.CANCELLED, reason);
    }

    await apiClient.post(`/purchase-requests/${id}/cancel`, { reason });
  },

  /**
   * Add item to PR
   */
  addPRItem: async (prId: string, data: AddPRItemRequest): Promise<PRItem> => {
    if (USE_MOCK_DATA) {
      // Mock doesn't have this directly, need to update PR
      throw new Error("Add PR item not implemented in mock");
    }

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
    if (USE_MOCK_DATA) {
      throw new Error("Update PR item not implemented in mock");
    }

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
    if (USE_MOCK_DATA) {
      throw new Error("Delete PR item not implemented in mock");
    }

    await apiClient.delete(`/purchase-requests/${prId}/items/${itemId}`);
  },

  /**
   * Update lead time estimate
   */
  updateLeadTime: async (id: string, data: UpdateLeadTimeRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.updateLeadTime(id, String(data.lead_time_estimate));
    }

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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.addDO(prId, data);
    }

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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPRAgingReport();
    }

    const response = await apiClient.get<PRAgingReport[]>("/reports/pr-aging");
    return response.data || [];
  },

  /**
   * Get PR status summary
   */
  getPRStatusSummary: async (): Promise<PRStatusSummary[]> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPRStatusSummary();
    }

    const response = await apiClient.get<PRStatusSummary[]>("/reports/pr-status-summary");
    return response.data || [];
  },

  /**
   * Export PR report
   */
  exportPRReport: async (format: "csv" | "pdf"): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.exportPRReport(format);
    }

    // Trigger browser download
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:8787"}/reports/pr/export?format=${format}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `PR-Report-${new Date().toISOString().split("T")[0]}.${format}`;
    link.click();
  },

  /**
   * Get PRs pending approval (for managers)
   */
  getPRsPendingApproval: async (): Promise<PurchaseRequest[]> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      const prs = await mock.getPRs({ status: PRStatus.SUBMITTED });
      return prs;
    }

    const response = await apiClient.get<PurchaseRequest[]>("/purchase-requests/pending-approval");
    return response.data || [];
  },

  /**
   * Get PRs by status
   */
  getPRsByStatus: async (status: PRStatusType): Promise<PurchaseRequest[]> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPRs({ status });
    }

    const response = await apiClient.get<PurchaseRequest[]>(`/purchase-requests?status=${status}`);
    return response.data || [];
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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      const summary = await mock.getPRStatusSummary();
      const total = summary.reduce((acc, s) => acc + s.count, 0);
      const byStatus = summary.reduce(
        (acc, s) => {
          acc[s.status as PRStatusType] = s.count;
          return acc;
        },
        {} as Record<PRStatusType, number>
      );
      return {
        total,
        byStatus,
        avgProcessingTime: 3.5,
        approvalRate: 85,
      };
    }

    const response = await apiClient.get<{
      total: number;
      byStatus: Record<PRStatusType, number>;
      avgProcessingTime: number;
      approvalRate: number;
    }>("/reports/pr-statistics");
    return response.data || { total: 0, byStatus: {} as Record<PRStatusType, number>, avgProcessingTime: 0, approvalRate: 0 };
  },
};

// Export type for use in components
export type { PurchaseRequest, PRItem, PRFilters, CreatePRRequest, UpdatePRRequest };