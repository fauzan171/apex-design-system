/**
 * Planning Module Mock Data
 * Based on PRD-03-PLANNING.md
 *
 * This data is for frontend development and QA testing.
 * Will be replaced with API calls in production.
 */

import type {
  ProductionPlan,
  ProductionPlanItem,
  MRItem,
  Product,
  BoMMaterial,
  PurchaseRequest,
  WorkOrder,
} from "@/types/planning";
import {
  ProductionPlanStatus,
  MRItemStatus,
  WOStatus,
  PRStatus,
} from "@/types/planning";

// ============================================
// MASTER DATA (Products & BoM)
// ============================================

export const mockProducts: Product[] = [
  {
    id: "prod-001",
    code: "MOTOR-X1",
    name: "Electric Motor Type X1",
    type: "Finished Good",
    unit: "Unit",
  },
  {
    id: "prod-002",
    code: "MOTOR-X2",
    name: "Electric Motor Type X2",
    type: "Finished Good",
    unit: "Unit",
  },
  {
    id: "prod-003",
    code: "GENERATOR-G1",
    name: "Industrial Generator G1",
    type: "Finished Good",
    unit: "Unit",
  },
  {
    id: "prod-004",
    code: "COPPER-WIRE-001",
    name: "Copper Wire 2mm",
    type: "Raw Material",
    unit: "Meter",
  },
  {
    id: "prod-005",
    code: "STEEL-ROD-001",
    name: "Steel Rod Standard",
    type: "Raw Material",
    unit: "Unit",
  },
  {
    id: "prod-006",
    code: "GREASE-001",
    name: "Industrial Grease",
    type: "Consumable",
    unit: "Kg",
  },
  {
    id: "prod-007",
    code: "BEARING-001",
    name: "Bearing Standard Type",
    type: "Raw Material",
    unit: "Unit",
  },
  {
    id: "prod-008",
    code: "SCREW-001",
    name: "Screw M8x20",
    type: "Consumable",
    unit: "Unit",
  },
];

/**
 * BoM data - materials required for each Finished Good
 * Key: Product ID (Finished Good)
 * Value: Array of BoMMaterial
 */
export const mockBoM: Record<string, BoMMaterial[]> = {
  "prod-001": [
    {
      id: "bom-001-1",
      productId: "prod-004",
      productCode: "COPPER-WIRE-001",
      productName: "Copper Wire 2mm",
      quantityRequired: 50, // per unit of MOTOR-X1
      unit: "Meter",
    },
    {
      id: "bom-001-2",
      productId: "prod-005",
      productCode: "STEEL-ROD-001",
      productName: "Steel Rod Standard",
      quantityRequired: 2,
      unit: "Unit",
    },
    {
      id: "bom-001-3",
      productId: "prod-006",
      productCode: "GREASE-001",
      productName: "Industrial Grease",
      quantityRequired: 0.5,
      unit: "Kg",
    },
    {
      id: "bom-001-4",
      productId: "prod-007",
      productCode: "BEARING-001",
      productName: "Bearing Standard Type",
      quantityRequired: 4,
      unit: "Unit",
    },
    {
      id: "bom-001-5",
      productId: "prod-008",
      productCode: "SCREW-001",
      productName: "Screw M8x20",
      quantityRequired: 12,
      unit: "Unit",
    },
  ],
  "prod-002": [
    {
      id: "bom-002-1",
      productId: "prod-004",
      productCode: "COPPER-WIRE-001",
      productName: "Copper Wire 2mm",
      quantityRequired: 60,
      unit: "Meter",
    },
    {
      id: "bom-002-2",
      productId: "prod-005",
      productCode: "STEEL-ROD-001",
      productName: "Steel Rod Standard",
      quantityRequired: 3,
      unit: "Unit",
    },
    {
      id: "bom-002-3",
      productId: "prod-007",
      productCode: "BEARING-001",
      productName: "Bearing Standard Type",
      quantityRequired: 6,
      unit: "Unit",
    },
  ],
  "prod-003": [
    {
      id: "bom-003-1",
      productId: "prod-004",
      productCode: "COPPER-WIRE-001",
      productName: "Copper Wire 2mm",
      quantityRequired: 100,
      unit: "Meter",
    },
    {
      id: "bom-003-2",
      productId: "prod-005",
      productCode: "STEEL-ROD-001",
      productName: "Steel Rod Standard",
      quantityRequired: 5,
      unit: "Unit",
    },
    {
      id: "bom-003-3",
      productId: "prod-006",
      productCode: "GREASE-001",
      productName: "Industrial Grease",
      quantityRequired: 1,
      unit: "Kg",
    },
    {
      id: "bom-003-4",
      productId: "prod-007",
      productCode: "BEARING-001",
      productName: "Bearing Standard Type",
      quantityRequired: 8,
      unit: "Unit",
    },
  ],
};

/**
 * Current Stock Levels
 * Key: Product ID (Raw Material / Consumable)
 * Value: Available quantity
 */
export const mockStockLevels: Record<string, number> = {
  "prod-004": 3000, // Copper Wire: 3000m
  "prod-005": 200, // Steel Rod: 200 units
  "prod-006": 20, // Grease: 20 kg
  "prod-007": 150, // Bearing: 150 units
  "prod-008": 500, // Screw: 500 units
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate MR Items for a Production Plan Item
 */
function generateMRItems(
  planItemId: string,
  productId: string,
  planQuantity: number
): MRItem[] {
  const bomMaterials = mockBoM[productId] || [];

  return bomMaterials.map((material, index) => {
    const requiredQty = material.quantityRequired * planQuantity;
    const availableQty = mockStockLevels[material.productId] || 0;
    const shortageQty = Math.max(0, requiredQty - availableQty);

    // Default priority weights (total = 100%)
    const defaultWeights = [50, 20, 15, 10, 5];
    const priorityWeight = defaultWeights[index] || 5;

    return {
      id: `mr-${planItemId}-${material.productId}`,
      planItemId,
      materialId: material.productId,
      materialCode: material.productCode,
      materialName: material.productName,
      requiredQty,
      availableQty,
      shortageQty,
      unit: material.unit,
      priorityWeight,
      isCritical: index === 0, // First material is critical by default
      status: shortageQty === 0 ? MRItemStatus.FULFILLED : MRItemStatus.PENDING,
    };
  });
}

/**
 * Calculate MR Progress (Weighted Average)
 */
function calculateMRProgress(mrItems: MRItem[]): number {
  const fulfilledWeight = mrItems
    .filter((item) => item.status === MRItemStatus.FULFILLED)
    .reduce((sum, item) => sum + item.priorityWeight, 0);

  return fulfilledWeight;
}

/**
 * Check if critical materials are fulfilled
 */
function checkCriticalMrFulfilled(mrItems: MRItem[]): boolean {
  return mrItems
    .filter((item) => item.isCritical)
    .every((item) => item.status === MRItemStatus.FULFILLED);
}

// ============================================
// PRODUCTION PLANS
// ============================================

export const mockProductionPlans: ProductionPlan[] = [
  {
    id: "plan-001",
    planNumber: "PP-2024-0001",
    planDate: "2024-01-15",
    targetCompletionDate: "2024-02-15",
    hoOrderReference: "HO-ORD-2024-0042",
    notes: "Priority order from Head Office for Q1 delivery",
    status: ProductionPlanStatus.APPROVED,
    createdBy: "user-001",
    createdAt: "2024-01-14T10:30:00Z",
    approvedBy: "user-002",
    approvedAt: "2024-01-14T14:00:00Z",
    items: [],
    approvalLogs: [
      {
        id: "log-001",
        planId: "plan-001",
        action: "Submit",
        userId: "user-001",
        userName: "Ahmad Supervisor",
        timestamp: "2024-01-14T10:30:00Z",
      },
      {
        id: "log-002",
        planId: "plan-001",
        action: "Approve",
        userId: "user-002",
        userName: "Budi Manager",
        timestamp: "2024-01-14T14:00:00Z",
      },
    ],
  },
  {
    id: "plan-002",
    planNumber: "PP-2024-0002",
    planDate: "2024-01-20",
    targetCompletionDate: "2024-02-25",
    hoOrderReference: "HO-ORD-2024-0048",
    notes: "Standard production batch",
    status: ProductionPlanStatus.PENDING_APPROVAL,
    createdBy: "user-001",
    createdAt: "2024-01-19T09:00:00Z",
    items: [],
    approvalLogs: [
      {
        id: "log-003",
        planId: "plan-002",
        action: "Submit",
        userId: "user-001",
        userName: "Ahmad Supervisor",
        timestamp: "2024-01-19T09:00:00Z",
      },
    ],
  },
  {
    id: "plan-003",
    planNumber: "PP-2024-0003",
    planDate: "2024-01-10",
    targetCompletionDate: "2024-01-25",
    hoOrderReference: "HO-ORD-2024-0035",
    status: ProductionPlanStatus.IN_PROGRESS,
    createdBy: "user-001",
    createdAt: "2024-01-09T08:00:00Z",
    approvedBy: "user-002",
    approvedAt: "2024-01-09T11:00:00Z",
    items: [],
    approvalLogs: [],
  },
  {
    id: "plan-004",
    planNumber: "PP-2024-0004",
    planDate: "2024-01-05",
    targetCompletionDate: "2024-01-20",
    hoOrderReference: "HO-ORD-2024-0030",
    status: ProductionPlanStatus.COMPLETED,
    createdBy: "user-001",
    createdAt: "2024-01-04T10:00:00Z",
    approvedBy: "user-002",
    approvedAt: "2024-01-04T14:00:00Z",
    items: [],
    approvalLogs: [],
  },
  {
    id: "plan-005",
    planNumber: "PP-2024-0005",
    planDate: "2024-01-18",
    targetCompletionDate: "2024-02-28",
    hoOrderReference: "HO-ORD-2024-0050",
    notes: "Draft - need to finalize product list",
    status: ProductionPlanStatus.DRAFT,
    createdBy: "user-001",
    createdAt: "2024-01-17T15:00:00Z",
    items: [],
    approvalLogs: [],
  },
  {
    id: "plan-006",
    planNumber: "PP-2024-0006",
    planDate: "2024-01-12",
    targetCompletionDate: "2024-01-30",
    hoOrderReference: "HO-ORD-2024-0038",
    status: ProductionPlanStatus.CANCELLED,
    cancelReason: "Order cancelled by Head Office due to priority change",
    createdBy: "user-001",
    createdAt: "2024-01-11T09:00:00Z",
    items: [],
    approvalLogs: [
      {
        id: "log-004",
        planId: "plan-006",
        action: "Cancel",
        userId: "user-001",
        userName: "Ahmad Supervisor",
        timestamp: "2024-01-13T10:00:00Z",
        notes: "Order cancelled by Head Office due to priority change",
      },
    ],
  },
];

// Populate items for plan-001
(mockProductionPlans[0].items as ProductionPlanItem[]) = [
  {
    id: "item-001",
    planId: "plan-001",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Electric Motor Type X1",
    quantity: 100,
    unit: "Unit",
    mrStatus: "Partial Fulfilled",
    mrProgress: 30,
    criticalMrFulfilled: false,
    woStatus: WOStatus.NOT_STARTED,
    mrItems: generateMRItems("item-001", "prod-001", 100),
  },
  {
    id: "item-002",
    planId: "plan-001",
    productId: "prod-002",
    productCode: "MOTOR-X2",
    productName: "Electric Motor Type X2",
    quantity: 50,
    unit: "Unit",
    mrStatus: "Fulfilled",
    mrProgress: 100,
    criticalMrFulfilled: true,
    woStatus: WOStatus.IN_PROGRESS,
    woId: "wo-001",
    mrItems: generateMRItems("item-002", "prod-002", 50),
  },
];

// Populate items for plan-005 (Draft)
(mockProductionPlans[4].items as ProductionPlanItem[]) = [
  {
    id: "item-005-1",
    planId: "plan-005",
    productId: "prod-003",
    productCode: "GENERATOR-G1",
    productName: "Industrial Generator G1",
    quantity: 25,
    unit: "Unit",
    mrStatus: "Pending",
    mrProgress: 0,
    criticalMrFulfilled: false,
    woStatus: WOStatus.NOT_STARTED,
    mrItems: generateMRItems("item-005-1", "prod-003", 25),
  },
];

// ============================================
// PURCHASE REQUESTS (from MR conversion)
// ============================================

export const mockPRs: PurchaseRequest[] = [];

// ============================================
// WORK ORDERS
// ============================================

export const mockWOs: WorkOrder[] = [];

// ============================================
// EXPORTS
// ============================================

export const planningService = {
  /**
   * Get all production plans with optional filters
   */
  getPlans: async (filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<ProductionPlan[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let plans = [...mockProductionPlans];

    if (filters?.status && filters.status !== "all") {
      plans = plans.filter((p) => p.status === filters.status);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      plans = plans.filter(
        (p) =>
          p.planNumber.toLowerCase().includes(search) ||
          p.hoOrderReference.toLowerCase().includes(search)
      );
    }

    return plans;
  },

  /**
   * Get a single production plan by ID
   */
  getPlanById: async (id: string): Promise<ProductionPlan | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProductionPlans.find((p) => p.id === id) || null;
  },

  /**
   * Create a new production plan
   */
  createPlan: async (data: {
    hoOrderReference: string;
    planDate: string;
    targetCompletionDate: string;
    notes?: string;
  }): Promise<ProductionPlan> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPlan: ProductionPlan = {
      id: `plan-${Date.now()}`,
      planNumber: `PP-2024-${String(mockProductionPlans.length + 1).padStart(4, "0")}`,
      ...data,
      status: ProductionPlanStatus.DRAFT,
      createdBy: "user-001",
      createdAt: new Date().toISOString(),
      items: [],
      approvalLogs: [],
    };

    mockProductionPlans.unshift(newPlan);
    return newPlan;
  },

  /**
   * Add product item to a plan
   */
  addPlanItem: async (
    planId: string,
    data: { productId: string; quantity: number; mrItems: { materialId: string; priorityWeight: number }[] }
  ): Promise<ProductionPlanItem> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const plan = mockProductionPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    const product = mockProducts.find((p) => p.id === data.productId);
    if (!product) throw new Error("Product not found");

    const newItemId = `item-${Date.now()}`;
    const bomMaterials = mockBoM[data.productId] || [];

    const mrItems: MRItem[] = bomMaterials.map((material) => {
      const priorityData = data.mrItems.find((m) => m.materialId === material.productId);
      const requiredQty = material.quantityRequired * data.quantity;
      const availableQty = mockStockLevels[material.productId] || 0;
      const shortageQty = Math.max(0, requiredQty - availableQty);

      return {
        id: `mr-${newItemId}-${material.productId}`,
        planItemId: newItemId,
        materialId: material.productId,
        materialCode: material.productCode,
        materialName: material.productName,
        requiredQty,
        availableQty,
        shortageQty,
        unit: material.unit,
        priorityWeight: priorityData?.priorityWeight || 0,
        isCritical: false, // Will be determined later
        status: shortageQty === 0 ? MRItemStatus.FULFILLED : MRItemStatus.PENDING,
      };
    });

    // Determine critical material (highest priority weight)
    const maxPriority = Math.max(...mrItems.map((m) => m.priorityWeight));
    mrItems.forEach((m) => {
      m.isCritical = m.priorityWeight === maxPriority;
    });

    const newItem: ProductionPlanItem = {
      id: newItemId,
      planId,
      productId: data.productId,
      productCode: product.code,
      productName: product.name,
      quantity: data.quantity,
      unit: product.unit,
      mrStatus: mrItems.every((m) => m.status === MRItemStatus.FULFILLED)
        ? "Fulfilled"
        : mrItems.some((m) => m.status === MRItemStatus.FULFILLED)
        ? "Partial Fulfilled"
        : "Pending",
      mrProgress: calculateMRProgress(mrItems),
      criticalMrFulfilled: checkCriticalMrFulfilled(mrItems),
      woStatus: WOStatus.NOT_STARTED,
      mrItems,
    };

    plan.items.push(newItem);
    return newItem;
  },

  /**
   * Submit plan for approval
   */
  submitPlan: async (planId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const plan = mockProductionPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    plan.status = ProductionPlanStatus.PENDING_APPROVAL;
    plan.approvalLogs.push({
      id: `log-${Date.now()}`,
      planId,
      action: "Submit",
      userId: "user-001",
      userName: "Ahmad Supervisor",
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Approve plan
   */
  approvePlan: async (planId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const plan = mockProductionPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    plan.status = ProductionPlanStatus.APPROVED;
    plan.approvedBy = "user-002";
    plan.approvedAt = new Date().toISOString();
    plan.approvalLogs.push({
      id: `log-${Date.now()}`,
      planId,
      action: "Approve",
      userId: "user-002",
      userName: "Budi Manager",
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Reject plan
   */
  rejectPlan: async (planId: string, reason: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const plan = mockProductionPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    plan.status = ProductionPlanStatus.DRAFT;
    plan.approvalLogs.push({
      id: `log-${Date.now()}`,
      planId,
      action: "Reject",
      userId: "user-002",
      userName: "Budi Manager",
      timestamp: new Date().toISOString(),
      notes: reason,
    });
  },

  /**
   * Cancel plan
   */
  cancelPlan: async (planId: string, reason: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const plan = mockProductionPlans.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    plan.status = ProductionPlanStatus.CANCELLED;
    plan.cancelReason = reason;
    plan.approvalLogs.push({
      id: `log-${Date.now()}`,
      planId,
      action: "Cancel",
      userId: "user-001",
      userName: "Ahmad Supervisor",
      timestamp: new Date().toISOString(),
      notes: reason,
    });
  },

  /**
   * Create PR from selected MR items
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    const prNumber = `PR-2024-${String(mockPRs.length + 1).padStart(4, "0")}`;
    const newPR = {
      id: `pr-${Date.now()}`,
      prNumber,
      requestDate: new Date().toISOString().split("T")[0],
      requiredDate: data.requiredDate,
      status: PRStatus.DRAFT,
      sourcePlanId: data.planId,
      sourcePlanNumber: data.planNumber,
      items: data.items.map((item, idx) => ({
        id: `pr-item-${Date.now()}-${idx}`,
        ...item,
      })),
      notes: data.notes,
      createdBy: "user-001",
      createdAt: new Date().toISOString(),
    };

    mockPRs.push(newPR);

    // Update MR items with PR reference
    const plan = mockProductionPlans.find((p) => p.id === data.planId);
    if (plan) {
      plan.items.forEach((planItem) => {
        planItem.mrItems.forEach((mrItem) => {
          if (data.items.some((i) => i.materialId === mrItem.materialId)) {
            mrItem.prId = prNumber;
          }
        });
      });
    }

    return { id: newPR.id, prNumber };
  },

  /**
   * Create Work Order from Plan Item
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    const woNumber = `WO-2024-${String(mockWOs.length + 1).padStart(4, "0")}`;
    const newWO: WorkOrder = {
      id: `wo-${Date.now()}`,
      woNumber,
      planId: data.planId,
      planNumber: data.planNumber,
      planItemId: data.planItemId,
      productId: data.productId,
      productCode: data.productCode,
      productName: data.productName,
      quantity: data.quantity,
      unit: data.unit,
      status: WOStatus.NOT_STARTED,
      startDate: data.startDate,
      notes: data.notes,
      createdBy: "user-001",
      createdAt: new Date().toISOString(),
    };

    mockWOs.push(newWO);

    // Update Plan Item with WO reference
    const plan = mockProductionPlans.find((p) => p.id === data.planId);
    if (plan) {
      const planItem = plan.items.find((item) => item.id === data.planItemId);
      if (planItem) {
        planItem.woId = woNumber;
        planItem.woStatus = WOStatus.NOT_STARTED;
      }
    }

    return { id: newWO.id, woNumber };
  },
};