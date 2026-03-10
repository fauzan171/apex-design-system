/**
 * Planning Service
 * Handles all Production Plan operations
 * Real API integration
 *
 * OpenAPI endpoints:
 * - /api/v1/planning/production-plans/*
 * - /api/v1/planning/material-requirements/*
 * - /api/v1/planning/reports/*
 */

import type {
  ProductionPlan,
  ProductionPlanItem,
  ProductionPlanStatusType,
  ProductionPlanFilters,
  ProductionPlanFormData,
  ProductionPlanItemFormData,
  UpdateProductionPlanRequest,
  SubmitPlanRequest,
  ApprovePlanRequest,
  RejectPlanRequest,
  CancelPlanRequest,
  MaterialRequirement,
  MRItem,
  Product,
  BoMMaterial,
} from "@/types/planning";
import { apiClient } from "@/lib/apiClient";

// ============================================
// PLANNING SERVICE
// ============================================

export const planningService = {
  // ============================================
  // PRODUCTION PLANS
  // ============================================

  /**
   * Get all production plans with optional filters
   */
  getPlans: async (filters?: ProductionPlanFilters): Promise<ProductionPlan[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<ProductionPlan[]>(`/production-plans?${params.toString()}`);
    const data = response.data as any;
    // Handle paginated response: {items: [...], total, page} or raw array
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get a single production plan by ID
   */
  getPlanById: async (id: string): Promise<ProductionPlan | null> => {
    const response = await apiClient.get<ProductionPlan>(`/production-plans/${id}`);
    return response.data || null;
  },

  /**
   * Create a new production plan
   */
  createPlan: async (data: ProductionPlanFormData): Promise<ProductionPlan> => {
    const response = await apiClient.post<ProductionPlan>("/production-plans", data);
    if (!response.data) throw new Error("Failed to create production plan");
    return response.data;
  },

  /**
   * Update a production plan
   */
  updatePlan: async (id: string, data: UpdateProductionPlanRequest): Promise<ProductionPlan> => {
    const response = await apiClient.put<ProductionPlan>(`/production-plans/${id}`, data);
    if (!response.data) throw new Error("Failed to update production plan");
    return response.data;
  },

  /**
   * Submit plan for approval
   */
  submitPlan: async (id: string, data?: SubmitPlanRequest): Promise<void> => {
    await apiClient.post(`/production-plans/${id}/submit`, data || {});
  },

  /**
   * Approve plan
   */
  approvePlan: async (id: string, data?: ApprovePlanRequest): Promise<void> => {
    await apiClient.post(`/production-plans/${id}/approve`, data || {});
  },

  /**
   * Reject plan
   */
  rejectPlan: async (id: string, data: RejectPlanRequest): Promise<void> => {
    await apiClient.post(`/production-plans/${id}/reject`, data);
  },

  /**
   * Cancel plan
   */
  cancelPlan: async (id: string, data: CancelPlanRequest): Promise<void> => {
    await apiClient.post(`/production-plans/${id}/cancel`, data);
  },

  /**
   * Request edit for approved plan
   */
  requestEdit: async (id: string, reason: string): Promise<void> => {
    await apiClient.post(`/production-plans/${id}/request-edit`, { reason });
  },

  /**
   * Update plan status
   */
  updatePlanStatus: async (id: string, status: ProductionPlanStatusType): Promise<ProductionPlan> => {
    const response = await apiClient.patch<ProductionPlan>(`/production-plans/${id}/status`, { status });
    if (!response.data) throw new Error("Failed to update plan status");
    return response.data;
  },

  // ============================================
  // PLAN ITEMS
  // ============================================

  /**
   * Add item to production plan
   */
  addPlanItem: async (
    planId: string,
    data: ProductionPlanItemFormData
  ): Promise<ProductionPlanItem> => {
    const response = await apiClient.post<ProductionPlanItem>(`/production-plans/${planId}/items`, data);
    if (!response.data) throw new Error("Failed to add plan item");
    return response.data;
  },

  /**
   * Update plan item
   */
  updatePlanItem: async (
    planId: string,
    itemId: string,
    data: { quantity?: number }
  ): Promise<ProductionPlanItem> => {
    const response = await apiClient.put<ProductionPlanItem>(
      `/production-plans/${planId}/items/${itemId}`,
      data
    );
    if (!response.data) throw new Error("Failed to update plan item");
    return response.data;
  },

  /**
   * Remove item from production plan
   */
  removePlanItem: async (planId: string, itemId: string): Promise<void> => {
    await apiClient.delete(`/production-plans/${planId}/items/${itemId}`);
  },

  // ============================================
  // MATERIAL REQUIREMENTS
  // ============================================

  /**
   * Update material priorities
   */
  updateMaterialPriorities: async (
    planId: string,
    itemId: string,
    priorities: Record<string, number>
  ): Promise<void> => {
    await apiClient.patch(`/production-plans/${planId}/items/${itemId}/priorities`, {
      material_priorities: priorities,
    });
  },

  /**
   * Update MR item status
   */
  updateMRStatus: async (
    _planId: string,
    mrItemId: string,
    status: string
  ): Promise<void> => {
    await apiClient.patch(`/material-requirement-items/${mrItemId}/status`, { status });
  },

  // ============================================
  // CREATE DOWNSTREAM DOCUMENTS
  // ============================================

  /**
   * Create Purchase Request from MR items
   */
  createPRFromMR: async (data: {
    planId: string;
    planNumber: string;
    items: {
      materialId: string;
      materialCode: string;
      materialName: string;
      quantity: number;
      unit: string;
    }[];
    requiredDate: string;
    notes?: string;
  }): Promise<{ id: string; prNumber: string }> => {
    const response = await apiClient.post<{ id: string; prNumber: string }>("/purchase-requests", {
      mr_id: data.planId,
      required_date: data.requiredDate,
      notes: data.notes,
      items: data.items.map((item) => ({
        materialId: item.materialId,
        quantityRequested: item.quantity,
        notes: item.unit,
      })),
    });
    if (!response.data) throw new Error("Failed to create PR");
    return response.data;
  },

  /**
   * Create Work Order from plan item
   */
  createWO: async (data: {
    planId: string;
    planNumber: string;
    planItemId: string;
    productId: string;
    productCode: string;
    productName: string;
    quantity: number;
    unit: string;
    startDate?: string;
    notes?: string;
  }): Promise<{ id: string; woNumber: string }> => {
    const response = await apiClient.post<{ id: string; woNumber: string }>("/production/work-orders", {
      plan_id: data.planId,
      product_id: data.productId,
      quantity: data.quantity,
      target_date: data.startDate || new Date().toISOString().split("T")[0],
      notes: data.notes,
    });
    if (!response.data) throw new Error("Failed to create WO");
    return response.data;
  },

  // ============================================
  // REPORTS & STATISTICS
  // ============================================

  /**
   * Get plan statistics
   */
  getPlanStats: async (): Promise<{
    total: number;
    draft: number;
    submitted: number;
    approved: number;
    inProgress: number;
    completed: number;
  }> => {
    const response = await apiClient.get<{
      total: number;
      draft: number;
      submitted: number;
      approved: number;
      inProgress: number;
      completed: number;
    }>("/production-plans/reports/stats");
    return response.data || { total: 0, draft: 0, submitted: 0, approved: 0, inProgress: 0, completed: 0 };
  },

  /**
   * Get plans pending approval
   */
  getPlansPendingApproval: async (): Promise<ProductionPlan[]> => {
    const response = await apiClient.get<ProductionPlan[]>("/production-plans/pending-approval");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get plans by status
   */
  getPlansByStatus: async (status: ProductionPlanStatusType): Promise<ProductionPlan[]> => {
    const response = await apiClient.get<ProductionPlan[]>(`/production-plans?status=${status}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get finished goods products for dropdown
   */
  getFinishedGoods: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/products?type=FG&status=active");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get all products for dropdown
   * GET /products
   */
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/products?status=active");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get Material Requirements for a plan
   * GET /production-plans/{id}/material-requirements
   */
  getMaterialRequirements: async (planId: string): Promise<MaterialRequirement[]> => {
    const response = await apiClient.get<MaterialRequirement[]>(
      `/production-plans/${planId}/material-requirements`
    );
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get MR for a specific plan item
   * GET /production-plans/{id}/items/{itemId}/material-requirements
   */
  getItemMaterialRequirements: async (planId: string, itemId: string): Promise<MRItem[]> => {
    const response = await apiClient.get<MRItem[]>(
      `/production-plans/${planId}/items/${itemId}/material-requirements`
    );
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Refresh Material Requirements (recalculate)
   * POST /production-plans/{id}/material-requirements/refresh
   */
  refreshMaterialRequirements: async (planId: string): Promise<void> => {
    await apiClient.post(`/production-plans/${planId}/material-requirements/refresh`, {});
  },

  /**
   * Get shortage summary for a plan
   * GET /production-plans/{id}/material-requirements/shortage-summary
   */
  getMRShortageSummary: async (planId: string): Promise<any> => {
    const response = await apiClient.get(`/production-plans/${planId}/material-requirements/shortage-summary`);
    return response.data || {};
  },

  /**
   * Set priority weights for a plan item
   * POST /production-plans/{id}/items/{itemId}/priority-weights
   */
  setPriorityWeights: async (
    planId: string,
    itemId: string,
    weights: Record<string, number>
  ): Promise<void> => {
    await apiClient.post(`/production-plans/${planId}/items/${itemId}/priority-weights`, { weights });
  },

  /**
   * Get approval history for a plan
   * GET /production-plans/{id}/approval-history
   */
  getApprovalHistory: async (planId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/production-plans/${planId}/approval-history`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get critical materials for a plan
   * GET /production-plans/{id}/critical-materials
   */
  getCriticalMaterials: async (planId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/production-plans/${planId}/critical-materials`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get BoM for a product
   */
  getBoMForProduct: async (productId: string): Promise<BoMMaterial[]> => {
    const response = await apiClient.get<BoMMaterial[]>(`/products/${productId}/bom/materials`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get stock levels for materials
   */
  getStockLevels: async (materialIds?: string[]): Promise<Record<string, number>> => {
    const params = materialIds ? `?ids=${materialIds.join(",")}` : "";
    const response = await apiClient.get<Record<string, number>>(`/warehouse/stock${params}`);
    return response.data || {};
  },
};

// Export types
export type {
  ProductionPlan,
  ProductionPlanItem,
  ProductionPlanFilters,
  MaterialRequirement,
  MRItem,
  Product,
  BoMMaterial,
};