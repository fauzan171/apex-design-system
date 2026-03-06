/**
 * Planning Module Types
 * Based on PRD-03-PLANNING.md
 */

// ============================================
// ENUMS
// ============================================

export enum ProductionPlanStatus {
  DRAFT = "Draft",
  PENDING_APPROVAL = "Pending Approval",
  APPROVED = "Approved",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum MRItemStatus {
  PENDING = "Pending",
  FULFILLED = "Fulfilled",
}

export enum WOStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export enum PRStatus {
  DRAFT = "Draft",
  PENDING_APPROVAL = "Pending Approval",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
}

// ============================================
// INTERFACES
// ============================================

/**
 * Product reference (simplified from Master Data)
 */
export interface Product {
  id: string;
  code: string;
  name: string;
  type: "Finished Good" | "Raw Material" | "Consumable";
  unit: string;
}

/**
 * Material in BoM
 */
export interface BoMMaterial {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantityRequired: number;
  unit: string;
}

/**
 * Material Requirement Item
 * Generated from BoM × Plan Item Quantity
 */
export interface MRItem {
  id: string;
  planItemId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  requiredQty: number;
  availableQty: number;
  shortageQty: number;
  unit: string;
  priorityWeight: number; // Percentage (0-100)
  isCritical: boolean;
  status: MRItemStatus;
  prId?: string; // Reference to PR if converted
}

/**
 * Production Plan Item (Product in Plan)
 */
export interface ProductionPlanItem {
  id: string;
  planId: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  mrStatus: "Pending" | "Partial Fulfilled" | "Fulfilled";
  mrProgress: number; // Percentage (0-100)
  criticalMrFulfilled: boolean;
  woStatus: WOStatus;
  woId?: string;
  mrItems: MRItem[];
}

/**
 * Approval Log Entry
 */
export interface PlanApprovalLog {
  id: string;
  planId: string;
  action: "Submit" | "Approve" | "Reject" | "Cancel" | "Request Edit";
  userId: string;
  userName: string;
  timestamp: string;
  notes?: string;
}

/**
 * Production Plan
 */
export interface ProductionPlan {
  id: string;
  planNumber: string;
  planDate: string;
  targetCompletionDate: string;
  hoOrderReference: string;
  notes?: string;
  status: ProductionPlanStatus;
  cancelReason?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  items: ProductionPlanItem[];
  approvalLogs: PlanApprovalLog[];
}

/**
 * Purchase Request Item
 */
export interface PRItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
}

/**
 * Purchase Request (created from MR items)
 */
export interface PurchaseRequest {
  id: string;
  prNumber: string;
  requestDate: string;
  requiredDate: string;
  status: PRStatus;
  sourcePlanId: string;
  sourcePlanNumber: string;
  items: PRItem[];
  notes?: string;
  createdBy: string;
  createdAt: string;
}

/**
 * Work Order (created from Plan Item)
 */
export interface WorkOrder {
  id: string;
  woNumber: string;
  planId: string;
  planNumber: string;
  planItemId: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  status: WOStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface ProductionPlanFormData {
  hoOrderReference: string;
  planDate: string;
  targetCompletionDate: string;
  notes?: string;
  items: ProductionPlanItemFormData[];
}

export interface ProductionPlanItemFormData {
  productId: string;
  quantity: number;
  mrItems: MRItemFormData[];
}

export interface MRItemFormData {
  materialId: string;
  priorityWeight: number;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface ProductionPlanFilters {
  status?: ProductionPlanStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ProductionPlanListResponse {
  data: ProductionPlan[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// UTILITY TYPES
// ============================================

export type StatusColor = {
  [key in ProductionPlanStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const productionPlanStatusColors: StatusColor = {
  [ProductionPlanStatus.DRAFT]: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  [ProductionPlanStatus.PENDING_APPROVAL]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [ProductionPlanStatus.APPROVED]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [ProductionPlanStatus.IN_PROGRESS]: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  [ProductionPlanStatus.COMPLETED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [ProductionPlanStatus.CANCELLED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};