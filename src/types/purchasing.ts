/**
 * Purchasing Module Types
 * Based on PRD-04-PURCHASING.md
 */

// ============================================
// ENUMS
// ============================================

export enum PRStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PROCESSING = "Processing",
  DO_ISSUED = "DO Issued",
  CLOSED = "Closed",
}

export enum PRItemStatus {
  PENDING = "Pending",
  PARTIAL = "Partial",
  RECEIVED = "Received",
}

// Legacy enum for backward compatibility
export { PRStatus as PurchaseRequestStatus };

// ============================================
// INTERFACES
// ============================================

/**
 * Material reference (from Master Data / Planning)
 */
export interface Material {
  id: string;
  code: string;
  name: string;
  unit: string;
}

/**
 * Purchase Request Item
 */
export interface PRItem {
  id: string;
  prId: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  notes?: string;
  receivedQty: number;
  status: PRItemStatus;
}

/**
 * PR Status Log Entry
 */
export interface PRStatusLog {
  id: string;
  prId: string;
  oldStatus?: PRStatus;
  newStatus: PRStatus;
  changedBy: string;
  changedByName: string;
  changedAt: string;
  notes?: string;
}

/**
 * Delivery Order from HO
 */
export interface DeliveryOrderFromHO {
  id: string;
  doNumber: string;
  prId: string;
  doDate: string;
  documentPath?: string;
  documentName?: string;
  items: DOItemFromHO[];
  createdBy: string;
  createdAt: string;
  notes?: string;
}

/**
 * DO Item from HO
 */
export interface DOItemFromHO {
  id: string;
  doId: string;
  prItemId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
}

/**
 * Purchase Request
 */
export interface PurchaseRequest {
  id: string;
  prNumber: string;
  requestDate: string;
  requiredDate: string;
  status: PRStatus;
  mrId?: string;
  mrNumber?: string;
  sourcePlanId?: string;
  sourcePlanNumber?: string;
  planId?: string;
  planNumber?: string;
  notes?: string;
  leadTimeEstimate?: string;
  items: PRItem[];
  deliveryOrders: DeliveryOrderFromHO[];
  statusLogs: PRStatusLog[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface PRFormData {
  requestDate: string;
  requiredDate: string;
  notes?: string;
  items: PRItemFormData[];
}

export interface PRItemFormData {
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface DOFormData {
  doNumber: string;
  doDate: string;
  notes?: string;
  items: DOItemFormData[];
}

export interface DOItemFormData {
  prItemId: string;
  quantity: number;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface PRFilters {
  status?: PRStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// ============================================
// REPORT TYPES
// ============================================

export interface PRAgingReport {
  ageGroup: "0-3 days" | "4-7 days" | ">7 days";
  count: number;
  prs: PurchaseRequest[];
}

export interface PRStatusSummary {
  status: PRStatus;
  count: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PRListResponse {
  data: PurchaseRequest[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// UTILITY TYPES
// ============================================

export type PRStatusColor = {
  [key in PRStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const prStatusColors: PRStatusColor = {
  [PRStatus.DRAFT]: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  [PRStatus.SUBMITTED]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [PRStatus.APPROVED]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [PRStatus.REJECTED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  [PRStatus.PROCESSING]: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  [PRStatus.DO_ISSUED]: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  [PRStatus.CLOSED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
};

// Status transition rules
export const canTransitionTo: Record<PRStatus, PRStatus[]> = {
  [PRStatus.DRAFT]: [PRStatus.SUBMITTED],
  [PRStatus.SUBMITTED]: [PRStatus.APPROVED, PRStatus.REJECTED],
  [PRStatus.APPROVED]: [PRStatus.PROCESSING],
  [PRStatus.REJECTED]: [PRStatus.SUBMITTED], // Can resubmit
  [PRStatus.PROCESSING]: [PRStatus.DO_ISSUED],
  [PRStatus.DO_ISSUED]: [PRStatus.CLOSED],
  [PRStatus.CLOSED]: [], // Final state
};

// Check if PR can be edited
export const canEdit = (status: PRStatus): boolean => {
  return status === PRStatus.DRAFT;
};

// Check if PR can be deleted
export const canDelete = (status: PRStatus): boolean => {
  return status === PRStatus.DRAFT;
};

// Check if PR needs approval
export const needsApproval = (status: PRStatus): boolean => {
  return status === PRStatus.SUBMITTED;
};

// Check if PR can receive DO
export const canAddDO = (status: PRStatus): boolean => {
  return status === PRStatus.PROCESSING || status === PRStatus.DO_ISSUED;
};