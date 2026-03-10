/**
 * Warehouse Service
 * Handles all warehouse operations: Stock, GR, GI, Inspection, DO, BAST
 * Real API integration
 *
 * OpenAPI endpoints:
 * - /api/v1/warehouse/stock/*
 * - /api/v1/warehouse/goods-receipts/*
 * - /api/v1/warehouse/goods-issues/*
 * - /api/v1/warehouse/delivery-orders/*
 * - /api/v1/warehouse/inspections/*
 * - /api/v1/warehouse/bast-inbound/*
 * - /api/v1/warehouse/bast-outbound/*
 * - /api/v1/warehouse/reports/*
 */

import type {
  Stock,
  StockAlert,
  StockFilters,
  GoodsReceipt,
  GRFilters,
  GRFormData,
  UpdateGRRequest,
  CancelGRRequest,
  GoodsIssue,
  GIFilters,
  GIFormData,
  FinishedGoodsReceipt,
  DeliveryOrder,
  DOFilters,
  Inspection,
  BASTInbound,
  BASTOutbound,
} from "@/types/warehouse";
import { apiClient } from "@/lib/apiClient";

// ============================================
// WAREHOUSE SERVICE
// ============================================

export const warehouseService = {
  // ============================================
  // STOCK MANAGEMENT
  // ============================================

  getStocks: async (filters?: StockFilters): Promise<Stock[]> => {
    const params = new URLSearchParams();
    if (filters?.lowStock) params.append("low_stock", "true");
    if (filters?.search) params.append("search", filters.search);
    const response = await apiClient.get<Stock[]>(`/warehouse/stock?${params.toString()}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getStockById: async (productId: string): Promise<Stock | null> => {
    const response = await apiClient.get<Stock>(`/warehouse/stock/${productId}`);
    return response.data || null;
  },

  getLowStockAlerts: async (): Promise<StockAlert[]> => {
    const response = await apiClient.get<StockAlert[]>("/warehouse/stock/alerts/low-stock");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  updateSafetyStock: async (productId: string, safetyStock: number): Promise<Stock> => {
    const response = await apiClient.patch<Stock>(`/warehouse/stock/${productId}/safety-stock`, { safety_stock: safetyStock });
    if (!response.data) throw new Error("Failed to update safety stock");
    return response.data;
  },

  // ============================================
  // GOODS RECEIPT (INBOUND)
  // ============================================

  getGoodsReceipts: async (filters?: GRFilters): Promise<GoodsReceipt[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.prId) params.append("pr_id", filters.prId);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    const response = await apiClient.get<GoodsReceipt[]>(`/warehouse/goods-receipts?${params.toString()}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getGoodsReceiptById: async (id: string): Promise<GoodsReceipt | null> => {
    const response = await apiClient.get<GoodsReceipt>(`/warehouse/goods-receipts/${id}`);
    return response.data || null;
  },

  createGoodsReceipt: async (data: GRFormData): Promise<GoodsReceipt> => {
    const response = await apiClient.post<GoodsReceipt>("/warehouse/goods-receipts", data);
    if (!response.data) throw new Error("Failed to create goods receipt");
    return response.data;
  },

  updateGoodsReceipt: async (id: string, data: UpdateGRRequest): Promise<GoodsReceipt> => {
    const response = await apiClient.put<GoodsReceipt>(`/warehouse/goods-receipts/${id}`, data);
    if (!response.data) throw new Error("Failed to update goods receipt");
    return response.data;
  },

  submitGoodsReceipt: async (id: string): Promise<GoodsReceipt> => {
    const response = await apiClient.post<GoodsReceipt>(`/warehouse/goods-receipts/${id}/submit`);
    if (!response.data) throw new Error("Failed to submit goods receipt");
    return response.data;
  },

  startInspection: async (grId: string): Promise<Inspection> => {
    const response = await apiClient.post<Inspection>(`/warehouse/goods-receipts/${grId}/start-inspection`);
    if (!response.data) throw new Error("Failed to start inspection");
    return response.data;
  },

  completeInspection: async (grId: string, result: "approved" | "rejected"): Promise<GoodsReceipt> => {
    const response = await apiClient.post<GoodsReceipt>(`/warehouse/goods-receipts/${grId}/complete`, { result });
    if (!response.data) throw new Error("Failed to complete inspection");
    return response.data;
  },

  completeGR: async (id: string): Promise<GoodsReceipt> => {
    const response = await apiClient.post<GoodsReceipt>(`/warehouse/goods-receipts/${id}/complete`);
    if (!response.data) throw new Error("Failed to complete goods receipt");
    return response.data;
  },

  cancelGR: async (id: string, data: CancelGRRequest): Promise<GoodsReceipt> => {
    const response = await apiClient.post<GoodsReceipt>(`/warehouse/goods-receipts/${id}/cancel`, data);
    if (!response.data) throw new Error("Failed to cancel goods receipt");
    return response.data;
  },

  generateBASTInbound: async (grId: string): Promise<BASTInbound> => {
    const response = await apiClient.post<BASTInbound>(`/warehouse/bast-inbound/by-gr/${grId}`);
    if (!response.data) throw new Error("Failed to generate BAST");
    return response.data;
  },

  // ============================================
  // GOODS ISSUE (OUTBOUND FOR WO)
  // ============================================

  getGoodsIssues: async (filters?: GIFilters): Promise<GoodsIssue[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.woId) params.append("wo_id", filters.woId);
    const response = await apiClient.get<GoodsIssue[]>(`/warehouse/goods-issues?${params.toString()}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getGoodsIssueById: async (id: string): Promise<GoodsIssue | null> => {
    const response = await apiClient.get<GoodsIssue>(`/warehouse/goods-issues/${id}`);
    return response.data || null;
  },

  createGoodsIssue: async (data: GIFormData): Promise<GoodsIssue> => {
    const response = await apiClient.post<GoodsIssue>("/warehouse/goods-issues", data);
    if (!response.data) throw new Error("Failed to create goods issue");
    return response.data;
  },

  submitGoodsIssue: async (id: string): Promise<GoodsIssue> => {
    const response = await apiClient.post<GoodsIssue>(`/warehouse/goods-issues/${id}/submit`);
    if (!response.data) throw new Error("Failed to submit goods issue");
    return response.data;
  },

  approveGoodsIssue: async (id: string): Promise<GoodsIssue> => {
    const response = await apiClient.post<GoodsIssue>(`/warehouse/goods-issues/${id}/approve`);
    if (!response.data) throw new Error("Failed to approve goods issue");
    return response.data;
  },

  rejectGoodsIssue: async (id: string, reason?: string): Promise<GoodsIssue> => {
    const response = await apiClient.post<GoodsIssue>(`/warehouse/goods-issues/${id}/reject`, { reason });
    if (!response.data) throw new Error("Failed to reject goods issue");
    return response.data;
  },

  issueGoods: async (id: string): Promise<GoodsIssue> => {
    const response = await apiClient.post<GoodsIssue>(`/warehouse/goods-issues/${id}/confirm`);
    if (!response.data) throw new Error("Failed to issue goods");
    return response.data;
  },

  cancelGoodsIssue: async (id: string): Promise<GoodsIssue> => {
    const response = await apiClient.post<GoodsIssue>(`/warehouse/goods-issues/${id}/cancel`);
    if (!response.data) throw new Error("Failed to cancel goods issue");
    return response.data;
  },

  // ============================================
  // FINISHED GOODS RECEIPT
  // ============================================

  getFinishedGoodsReceipts: async (): Promise<FinishedGoodsReceipt[]> => {
    const response = await apiClient.get<FinishedGoodsReceipt[]>("/warehouse/finished-goods-receipts");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  createFinishedGoodsReceipt: async (woId: string, quantity: number): Promise<FinishedGoodsReceipt> => {
    const response = await apiClient.post<FinishedGoodsReceipt>("/warehouse/finished-goods-receipts", { wo_id: woId, quantity });
    if (!response.data) throw new Error("Failed to create finished goods receipt");
    return response.data;
  },

  // ============================================
  // WAREHOUSE DELIVERY ORDER
  // ============================================

  getWarehouseDOs: async (filters?: DOFilters): Promise<DeliveryOrder[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    const response = await apiClient.get<DeliveryOrder[]>(`/warehouse/delivery-orders?${params.toString()}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getWarehouseDOById: async (id: string): Promise<DeliveryOrder | null> => {
    const response = await apiClient.get<DeliveryOrder>(`/warehouse/delivery-orders/${id}`);
    return response.data || null;
  },

  createWarehouseDO: async (data: { do_number: string; do_date: string; items: { productId: string; quantity: number }[] }): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>("/warehouse/delivery-orders", data);
    if (!response.data) throw new Error("Failed to create delivery order");
    return response.data;
  },

  updateWarehouseDO: async (id: string, data: Partial<{ do_number: string; do_date: string }>): Promise<DeliveryOrder> => {
    const response = await apiClient.put<DeliveryOrder>(`/warehouse/delivery-orders/${id}`, data);
    if (!response.data) throw new Error("Failed to update delivery order");
    return response.data;
  },

  releaseWarehouseDO: async (id: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/warehouse/delivery-orders/${id}/release`);
    if (!response.data) throw new Error("Failed to release delivery order");
    return response.data;
  },

  confirmWarehouseDO: async (id: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/warehouse/delivery-orders/${id}/status`, { status: "confirmed" });
    if (!response.data) throw new Error("Failed to confirm delivery order");
    return response.data;
  },

  cancelWarehouseDO: async (id: string): Promise<DeliveryOrder> => {
    const response = await apiClient.post<DeliveryOrder>(`/warehouse/delivery-orders/${id}/cancel`);
    if (!response.data) throw new Error("Failed to cancel delivery order");
    return response.data;
  },

  uploadBASTOutbound: async (doId: string, file: File): Promise<BASTOutbound> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<BASTOutbound>(`/warehouse/bast-outbound/by-do/${doId}`, formData);
    if (!response.data) throw new Error("Failed to upload BAST");
    return response.data;
  },

  // ============================================
  // INSPECTION
  // ============================================

  getInspections: async (): Promise<Inspection[]> => {
    const response = await apiClient.get<Inspection[]>("/warehouse/inspections");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getInspectionById: async (id: string): Promise<Inspection | null> => {
    const response = await apiClient.get<Inspection>(`/warehouse/inspections/${id}`);
    return response.data || null;
  },

  submitInspection: async (id: string): Promise<Inspection> => {
    const response = await apiClient.post<Inspection>(`/warehouse/inspections/${id}/submit`);
    if (!response.data) throw new Error("Failed to submit inspection");
    return response.data;
  },

  approveInspection: async (id: string): Promise<Inspection> => {
    const response = await apiClient.post<Inspection>(`/warehouse/inspections/${id}/approve`);
    if (!response.data) throw new Error("Failed to approve inspection");
    return response.data;
  },

  rejectInspection: async (id: string): Promise<Inspection> => {
    const response = await apiClient.post<Inspection>(`/warehouse/inspections/${id}/reject`);
    if (!response.data) throw new Error("Failed to reject inspection");
    return response.data;
  },

  uploadInspectionPhoto: async (inspectionId: string, file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<{ id: string; url: string }>(`/warehouse/inspections/${inspectionId}/photos`, formData);
    if (!response.data) throw new Error("Failed to upload photo");
    return response.data;
  },

  // ============================================
  // HELPERS
  // ============================================

  getAvailableStockForDO: async (): Promise<Stock[]> => {
    const response = await apiClient.get<Stock[]>("/warehouse/delivery-orders/available-stock");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getAvailableWOs: async (): Promise<{ id: string; woNumber: string; productName: string }[]> => {
    const response = await apiClient.get<{ id: string; woNumber: string; productName: string }[]>("/warehouse/goods-issues/available-wos");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  // ============================================
  // STATISTICS
  // ============================================

  getWarehouseStats: async (): Promise<{
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    byCategory: { category: string; count: number; value: number }[];
  }> => {
    const response = await apiClient.get<{
      totalItems: number;
      totalValue: number;
      lowStockCount: number;
      byCategory: { category: string; count: number; value: number }[];
    }>("/warehouse/reports/dashboard");
    return response.data || { totalItems: 0, totalValue: 0, lowStockCount: 0, byCategory: [] };
  },
};