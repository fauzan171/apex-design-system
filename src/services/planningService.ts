/**
 * Planning Service
 * Handles all Production Plan operations
 * Automatically switches between mock data and real API based on environment
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
import { ProductionPlanStatus, MRStatus, MRItemStatus } from "@/types/planning";
import { apiClient } from "@/lib/apiClient";

// Check if using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Import mock service only when needed
let mockPlanningService: typeof import("@/data/mockPlanningData").planningService | null = null;

const getMockService = async () => {
  if (!mockPlanningService) {
    const module = await import("@/data/mockPlanningData");
    mockPlanningService = module.planningService;
  }
  return mockPlanningService;
};

// ============================================
// MOCK DATA EXPORTS (for PlanningFormPage compatibility)
// ============================================

// Products for planning (Finished Goods only)
export const mockProducts: Product[] = [
  { id: "prod-001", code: "MOTOR-X1", name: "Electric Motor Type X1", type: "Finished Good", unit: "Unit" },
  { id: "prod-002", code: "MOTOR-X2", name: "Electric Motor Type X2", type: "Finished Good", unit: "Unit" },
  { id: "prod-003", code: "GENERATOR-G1", name: "Industrial Generator G1", type: "Finished Good", unit: "Unit" },
];

// BoM data - materials required for each product
export const mockBoM: Record<string, BoMMaterial[]> = {
  "prod-001": [
    { id: "bom-001-1", productId: "prod-004", productCode: "COPPER-WIRE-001", productName: "Copper Wire 2mm", quantityRequired: 50, unit: "Meter" },
    { id: "bom-001-2", productId: "prod-005", productCode: "STEEL-ROD-001", productName: "Steel Rod Standard", quantityRequired: 2, unit: "Unit" },
    { id: "bom-001-3", productId: "prod-006", productCode: "GREASE-001", productName: "Industrial Grease", quantityRequired: 0.5, unit: "Kg" },
    { id: "bom-001-4", productId: "prod-007", productCode: "BEARING-001", productName: "Bearing Standard Type", quantityRequired: 4, unit: "Unit" },
  ],
  "prod-002": [
    { id: "bom-002-1", productId: "prod-004", productCode: "COPPER-WIRE-001", productName: "Copper Wire 2mm", quantityRequired: 60, unit: "Meter" },
    { id: "bom-002-2", productId: "prod-005", productCode: "STEEL-ROD-001", productName: "Steel Rod Standard", quantityRequired: 3, unit: "Unit" },
    { id: "bom-002-3", productId: "prod-007", productCode: "BEARING-001", productName: "Bearing Standard Type", quantityRequired: 6, unit: "Unit" },
  ],
  "prod-003": [
    { id: "bom-003-1", productId: "prod-004", productCode: "COPPER-WIRE-001", productName: "Copper Wire 2mm", quantityRequired: 100, unit: "Meter" },
    { id: "bom-003-2", productId: "prod-005", productCode: "STEEL-ROD-001", productName: "Steel Rod Standard", quantityRequired: 5, unit: "Unit" },
    { id: "bom-003-3", productId: "prod-006", productCode: "GREASE-001", productName: "Industrial Grease", quantityRequired: 1, unit: "Kg" },
    { id: "bom-003-4", productId: "prod-007", productCode: "BEARING-001", productName: "Bearing Standard Type", quantityRequired: 8, unit: "Unit" },
  ],
};

// Stock levels for raw materials
export const mockStockLevels: Record<string, number> = {
  "prod-004": 3000,  // Copper Wire: 3000m
  "prod-005": 200,   // Steel Rod: 200 units
  "prod-006": 20,    // Grease: 20 kg
  "prod-007": 150,   // Bearing: 150 units
  "prod-008": 500,   // Screw: 500 units
};

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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPlans({
        status: filters?.status,
        dateFrom: filters?.startDate || filters?.dateFrom,
        dateTo: filters?.endDate || filters?.dateTo,
        search: filters?.search,
      });
    }

    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<ProductionPlan[]>(`/production-plans?${params.toString()}`);
    return response.data || [];
  },

  /**
   * Get a single production plan by ID
   */
  getPlanById: async (id: string): Promise<ProductionPlan | null> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      const plan = await mock.getPlanById(id);
      return plan || null;
    }

    const response = await apiClient.get<ProductionPlan>(`/production-plans/${id}`);
    return response.data || null;
  },

  /**
   * Create a new production plan
   */
  createPlan: async (data: ProductionPlanFormData): Promise<ProductionPlan> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.createPlan({
        hoOrderReference: data.ho_order_reference,
        planDate: data.plan_date,
        targetCompletionDate: data.target_completion_date,
        notes: data.notes,
      });
    }

    const response = await apiClient.post<ProductionPlan>("/production-plans", data);
    if (!response.data) throw new Error("Failed to create production plan");
    return response.data;
  },

  /**
   * Update a production plan
   */
  updatePlan: async (id: string, data: UpdateProductionPlanRequest): Promise<ProductionPlan> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.updatePlanStatus(id, ProductionPlanStatus.DRAFT);
    }

    const response = await apiClient.put<ProductionPlan>(`/production-plans/${id}`, data);
    if (!response.data) throw new Error("Failed to update production plan");
    return response.data;
  },

  /**
   * Submit plan for approval
   */
  submitPlan: async (id: string, data?: SubmitPlanRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.submitPlan(id);
    }

    await apiClient.post(`/production-plans/${id}/submit`, data || {});
  },

  /**
   * Approve plan
   */
  approvePlan: async (id: string, data?: ApprovePlanRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.approvePlan(id);
    }

    await apiClient.post(`/production-plans/${id}/approve`, data || {});
  },

  /**
   * Reject plan
   */
  rejectPlan: async (id: string, data: RejectPlanRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.rejectPlan(id, data.notes);
    }

    await apiClient.post(`/production-plans/${id}/reject`, data);
  },

  /**
   * Cancel plan
   */
  cancelPlan: async (id: string, data: CancelPlanRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.cancelPlan(id, data.reason);
    }

    await apiClient.post(`/production-plans/${id}/cancel`, data);
  },

  /**
   * Request edit for approved plan
   */
  requestEdit: async (id: string, reason: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.requestEdit(id, reason);
    }

    await apiClient.post(`/production-plans/${id}/request-edit`, { reason });
  },

  /**
   * Update plan status
   */
  updatePlanStatus: async (id: string, status: ProductionPlanStatusType): Promise<ProductionPlan> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.updatePlanStatus(id, status);
    }

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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      const mrItems = data.mrItems || [];
      return mock.addPlanItem(planId, {
        productId: data.product_id || data.productId || "",
        quantity: data.quantity,
        mrItems: mrItems.map((item) => ({
          materialId: item.materialId,
          priorityWeight: item.priorityWeight,
        })),
      });
    }

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
    if (USE_MOCK_DATA) {
      throw new Error("Update plan item not implemented in mock");
    }

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
    if (USE_MOCK_DATA) {
      throw new Error("Remove plan item not implemented in mock");
    }

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
    if (USE_MOCK_DATA) {
      // Mock doesn't have this, skip
      return;
    }

    await apiClient.patch(`/production-plans/${planId}/items/${itemId}/priorities`, {
      material_priorities: priorities,
    });
  },

  /**
   * Update MR item status
   */
  updateMRStatus: async (
    planId: string,
    mrItemId: string,
    status: string
  ): Promise<void> => {
    if (USE_MOCK_DATA) {
      // Mock doesn't have this, skip
      return;
    }

    await apiClient.patch(`/material-requirements/${mrItemId}/status`, { status });
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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.createPRFromMR(data);
    }

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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.createWO(data);
    }

    const response = await apiClient.post<{ id: string; woNumber: string }>("/work-orders", {
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
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      const plans = await mock.getPlans();
      return {
        total: plans.length,
        draft: plans.filter((p) => p.status === "draft").length,
        submitted: plans.filter((p) => p.status === "submitted").length,
        approved: plans.filter((p) => p.status === "approved").length,
        inProgress: plans.filter((p) => p.status === "in_progress").length,
        completed: plans.filter((p) => p.status === "completed").length,
      };
    }

    const response = await apiClient.get<{
      total: number;
      draft: number;
      submitted: number;
      approved: number;
      inProgress: number;
      completed: number;
    }>("/production-plans/stats");
    return response.data || { total: 0, draft: 0, submitted: 0, approved: 0, inProgress: 0, completed: 0 };
  },

  /**
   * Get plans pending approval
   */
  getPlansPendingApproval: async (): Promise<ProductionPlan[]> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPlans({ status: "submitted" });
    }

    const response = await apiClient.get<ProductionPlan[]>("/production-plans/pending-approval");
    return response.data || [];
  },

  /**
   * Get plans by status
   */
  getPlansByStatus: async (status: ProductionPlanStatusType): Promise<ProductionPlan[]> => {
    if (USE_MOCK_DATA) {
      const mock = await getMockService();
      return mock.getPlans({ status });
    }

    const response = await apiClient.get<ProductionPlan[]>(`/production-plans?status=${status}`);
    return response.data || [];
  },

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get finished goods products for dropdown
   */
  getFinishedGoods: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      return mockProducts;
    }

    const response = await apiClient.get<Product[]>("/products?type=FG");
    return response.data || [];
  },

  /**
   * Get BoM for a product
   */
  getBoMForProduct: async (productId: string): Promise<BoMMaterial[]> => {
    if (USE_MOCK_DATA) {
      return mockBoM[productId] || [];
    }

    const response = await apiClient.get<BoMMaterial[]>(`/products/${productId}/bom/materials`);
    return response.data || [];
  },

  /**
   * Get stock levels for materials
   */
  getStockLevels: async (materialIds?: string[]): Promise<Record<string, number>> => {
    if (USE_MOCK_DATA) {
      if (materialIds) {
        const result: Record<string, number> = {};
        materialIds.forEach((id) => {
          if (mockStockLevels[id] !== undefined) {
            result[id] = mockStockLevels[id];
          }
        });
        return result;
      }
      return mockStockLevels;
    }

    const params = materialIds ? `?ids=${materialIds.join(",")}` : "";
    const response = await apiClient.get<Record<string, number>>(`/stock/levels${params}`);
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