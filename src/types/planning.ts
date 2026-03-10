/**
 * Planning Module Types
 * Based on PRD-03-PLANNING.md and OpenAPI spec
 */

// ============================================
// ENUMS
// ============================================

// Production Plan Status (matches OpenAPI ProductionPlan.status)
export type ProductionPlanStatusType =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "edit_requested";

export enum ProductionPlanStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  PENDING_APPROVAL = "submitted", // Legacy alias
  APPROVED = "approved",
  REJECTED = "rejected",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  EDIT_REQUESTED = "edit_requested",
}

// Material Requirement Status (matches OpenAPI MaterialRequirement.status)
export type MRStatusType =
  | "pending"
  | "allocated"
  | "purchased"
  | "received"
  | "shortage_accepted";

export enum MRStatus {
  PENDING = "pending",
  ALLOCATED = "allocated",
  PURCHASED = "purchased",
  RECEIVED = "received",
  SHORTAGE_ACCEPTED = "shortage_accepted",
}

// Legacy enum for backward compatibility
export enum MRItemStatus {
  PENDING = "Pending",
  FULFILLED = "Fulfilled",
}

// WO Status type re-exported from production
export type { WOStatusType } from "./production";
export { WOStatus } from "./production";

// PR Status re-exported from purchasing
export type { PRStatusType } from "./purchasing";
export { PRStatus } from "./purchasing";

// ============================================
// INTERFACES - Product Reference
// ============================================

/**
 * Product reference (matches OpenAPI Product schema)
 */
export interface ProductReference {
  id: string;
  code: string;
  name: string;
  type?: "FG" | "SEMI" | "RAW" | "PACKAGING" | "SPAREPART" | "SUPPORT" | string;
  description?: string;
  baseUnit?: string;
  status?: "active" | "inactive";
  // Legacy fields for backward compatibility
  unit?: string;
}

// Legacy aliases for backward compatibility
export type Product = ProductReference;

/**
 * Material in BoM (legacy type)
 */
export interface BoMMaterial {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantityRequired: number;
  unit: string;
}

// ============================================
// INTERFACES - Material Requirement
// ============================================

/**
 * Material Requirement
 * Matches OpenAPI MaterialRequirement schema
 */
export interface MaterialRequirement {
  id: string;
  itemId?: string;
  materialId: string;
  material?: ProductReference;
  requiredQuantity?: number;
  availableStock?: number;
  shortageQuantity?: number;
  status?: MRStatusType | MRItemStatus | string;
  priority_weight?: number;
  // Legacy fields for backward compatibility
  planItemId?: string;
  materialCode?: string;
  materialName?: string;
  requiredQty?: number;
  availableQty?: number;
  unit?: string;
  priorityWeight?: number;
  isCritical?: boolean;
  prId?: string;
}

// Legacy alias
export type MRItem = MaterialRequirement;

/**
 * Material Priority Configuration
 * Used for setting priority weights on materials
 */
export interface MaterialPriority {
  [materialId: string]: {
    weight: number;
    acceptableShortagePercentage?: number;
  };
}

// ============================================
// INTERFACES - Production Plan
// ============================================

/**
 * Production Plan Item (Product in Plan)
 * Matches OpenAPI ProductionPlanItem schema
 */
export interface ProductionPlanItem {
  id: string;
  planId: string;
  productId: string;
  product?: ProductReference;
  quantity: number;
  material_priorities?: MaterialPriority;
  status?: string;
  materialRequirements?: MaterialRequirement[];
  // Legacy fields for backward compatibility
  productCode?: string;
  productName?: string;
  unit?: string;
  mrStatus?: "Pending" | "Partial Fulfilled" | "Fulfilled";
  mrProgress?: number;
  criticalMrFulfilled?: boolean;
  woStatus?: string;
  woId?: string;
  mrItems?: MaterialRequirement[];
}

/**
 * Approval History Entry
 * Matches OpenAPI ApprovalHistory schema
 */
export interface ApprovalHistory {
  id: string;
  entityType?: string;
  entityId?: string;
  approverId?: string;
  approver?: {
    id: string;
    fullName: string;
    email: string;
  };
  action?: "approve" | "reject" | "request_edit" | "submit" | "cancel" | "Submit" | "Approve" | "Reject" | "Cancel" | "Request Edit" | "In Progress" | "Completed";
  notes?: string;
  createdAt?: string;
  // Legacy fields
  userId?: string;
  userName?: string;
  timestamp?: string;
  planId?: string;
}

// Legacy type alias
export type PlanApprovalLog = ApprovalHistory;

/**
 * Production Plan
 * Matches OpenAPI ProductionPlan schema
 */
export interface ProductionPlan {
  id: string;
  plan_date?: string;
  target_completion_date?: string;
  ho_order_reference?: string;
  notes?: string;
  status: ProductionPlanStatusType;
  items?: ProductionPlanItem[];
  approvalHistory?: ApprovalHistory[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  planNumber?: string;
  planDate?: string;
  targetCompletionDate?: string;
  hoOrderReference?: string;
  cancelReason?: string;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  criticalMaterials?: CriticalMaterial[];
  materialRequirements?: MaterialRequirement[];
  approvalLogs?: ApprovalHistory[]; // Alias for approvalHistory
}

/**
 * Critical Material in Production Plan
 */
export interface CriticalMaterial {
  materialId: string;
  materialCode: string;
  materialName: string;
  requiredQty: number;
  availableQty: number;
  shortageQty: number;
  isUrgent: boolean;
}

// ============================================
// INTERFACES - Purchase Request (for Planning)
// ============================================

/**
 * Purchase Request Item (simplified for planning context)
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
  prNumber?: string;
  requestDate?: string;
  required_date: string;
  status: string;
  sourcePlanId?: string;
  sourcePlanNumber?: string;
  items?: PRItem[];
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  // Legacy field
  mrId?: string;
  mrNumber?: string;
}

// ============================================
// INTERFACES - Work Order (for Planning)
// ============================================

/**
 * Work Order (created from Plan Item)
 * Simplified for planning context
 */
export interface WorkOrder {
  id: string;
  woNumber?: string;
  planId?: string;
  planNumber?: string;
  planItemId?: string;
  productId: string;
  productCode?: string;
  productName?: string;
  quantity: number;
  unit?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  target_date: string;
  quantityCompleted?: number;
  releaseDate?: string;
  releaseBy?: string;
  createdBy?: string;
  createdAt?: string;
  // Legacy field
  targetDate?: string;
}

// ============================================
// FORM TYPES
// ============================================

// Matches OpenAPI CreateProductionPlanRequest
export interface ProductionPlanFormData {
  plan_date: string;
  target_completion_date: string;
  ho_order_reference?: string;
  notes?: string;
  items?: ProductionPlanItemFormData[];
}

// Matches OpenAPI AddPlanItemRequest
export interface ProductionPlanItemFormData {
  product_id: string;
  quantity: number;
  material_priorities?: MaterialPriority;
  // Legacy fields
  productId?: string;
  mrItems?: MRItemFormData[];
}

export interface MRItemFormData {
  materialId: string;
  priorityWeight: number;
}

// Matches OpenAPI UpdateProductionPlanRequest
export interface UpdateProductionPlanRequest {
  plan_date?: string;
  target_completion_date?: string;
  ho_order_reference?: string;
  notes?: string;
}

// Matches OpenAPI SubmitPlanRequest
export interface SubmitPlanRequest {
  notes?: string;
}

// Matches OpenAPI ApprovePlanRequest
export interface ApprovePlanRequest {
  notes?: string;
}

// Matches OpenAPI RejectPlanRequest
export interface RejectPlanRequest {
  notes: string;
}

// Matches OpenAPI CancelPlanRequest
export interface CancelPlanRequest {
  reason: string;
}

// Matches OpenAPI RequestEditRequest
export interface RequestEditRequest {
  reason: string;
}

// Matches OpenAPI UpdatePlanItemRequest
export interface UpdatePlanItemRequest {
  quantity?: number;
  material_priorities?: MaterialPriority;
}

// Matches OpenAPI UpdateMaterialPrioritiesRequest
export interface UpdateMaterialPrioritiesRequest {
  material_priorities: MaterialPriority;
}

// Matches OpenAPI UpdateMrItemStatusRequest
export interface UpdateMRStatusRequest {
  status: MRStatusType;
  notes?: string;
}

// Matches OpenAPI SetPriorityWeightsRequest
export interface SetPriorityWeightsRequest {
  weights: Record<string, number>;
}

// Matches OpenAPI AutoDistributeWeightsRequest
export interface AutoDistributeWeightsRequest {
  strategy: "equal" | "proportional" | "custom";
  options?: Record<string, unknown>;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface ProductionPlanFilters {
  status?: ProductionPlanStatusType | "all";
  startDate?: string;
  endDate?: string;
  search?: string;
  // Legacy fields
  dateFrom?: string;
  dateTo?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ProductionPlanListResponse {
  success: boolean;
  data: ProductionPlan[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// UTILITY TYPES
// ============================================

export type StatusColor = {
  [key in ProductionPlanStatusType]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const productionPlanStatusColors: StatusColor = {
  draft: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  submitted: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  approved: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  in_progress: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  cancelled: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
  },
  edit_requested: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

// Status transition rules
export const canPlanTransitionTo: Record<ProductionPlanStatusType, ProductionPlanStatusType[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["approved", "rejected", "edit_requested"],
  approved: ["in_progress", "cancelled"],
  rejected: ["draft"], // Can revise and resubmit
  in_progress: ["completed", "cancelled"],
  completed: [], // Final state
  cancelled: [], // Final state
  edit_requested: ["draft"], // Return to draft for editing
};

// Check if plan can be edited
export const canPlanEdit = (status: ProductionPlanStatusType): boolean => {
  return status === "draft" || status === "edit_requested";
};

// Check if plan can be deleted
export const canPlanDelete = (status: ProductionPlanStatusType): boolean => {
  return status === "draft";
};

// Check if plan needs approval
export const needsPlanApproval = (status: ProductionPlanStatusType): boolean => {
  return status === "submitted";
};

// Check if plan can be cancelled
export const canPlanCancel = (status: ProductionPlanStatusType): boolean => {
  return !["completed", "cancelled"].includes(status);
};

// Get display label for status
export const getPlanStatusLabel = (status: ProductionPlanStatusType): string => {
  const labels: Record<ProductionPlanStatusType, string> = {
    draft: "Draft",
    submitted: "Pending Approval",
    approved: "Approved",
    rejected: "Rejected",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    edit_requested: "Edit Requested",
  };
  return labels[status] || status;
};

// ============================================
// RE-EXPORTS
// ============================================

// Re-export production types for convenience
export type { WOStep, WOProgress, ProgressPhoto, QCFinding, QCFindingPhoto, QCSession } from "./production";