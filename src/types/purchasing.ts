/**
 * Purchasing Module Types
 * Based on PRD-04-PURCHASING.md and OpenAPI spec
 */

// ============================================
// ENUMS
// ============================================

// PR Status (matches OpenAPI PurchaseRequest.status)
export type PRStatusType =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "processing"
  | "do_issued"
  | "resubmitted"
  | "cancelled";

export enum PRStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
  PROCESSING = "processing",
  DO_ISSUED = "do_issued",
  RESUBMITTED = "resubmitted",
  CANCELLED = "cancelled",
}

// PR Item Status
export type PRItemStatusType = "pending" | "partial" | "received";

export enum PRItemStatus {
  PENDING = "pending",
  PARTIAL = "partial",
  RECEIVED = "received",
}

// PR Priority (matches OpenAPI PurchaseRequest.priority)
export type PRPriorityType = "low" | "medium" | "high" | "urgent";

export enum PRPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Delivery Order Status (from HO)
export type DOStatusType =
  | "draft"
  | "released"
  | "partially_received"
  | "received"
  | "cancelled";

export enum DOStatus {
  DRAFT = "draft",
  RELEASED = "released",
  PARTIALLY_RECEIVED = "partially_received",
  RECEIVED = "received",
  CANCELLED = "cancelled",
}

// ============================================
// INTERFACES - Common Types
// ============================================

/**
 * Material reference (matches OpenAPI Product schema)
 */
export interface MaterialReference {
  id: string;
  code: string;
  name: string;
  type: "FG" | "SEMI" | "RAW" | "PACKAGING" | "SPAREPART" | "SUPPORT";
  baseUnit: string;
  status: "active" | "inactive";
}

/**
 * User reference
 */
export interface UserReference {
  id: string;
  fullName: string;
  email: string;
}

// ============================================
// INTERFACES - Purchase Request
// ============================================

/**
 * Purchase Request Item
 * Matches OpenAPI PRItem schema
 */
export interface PRItem {
  id: string;
  prId: string;
  materialId: string;
  material?: MaterialReference;
  quantityRequested: number;
  quantityApproved?: number;
  quantityReceived?: number;
  unit: string;
  notes?: string;
  // Legacy fields
  materialCode?: string;
  materialName?: string;
  status?: PRItemStatusType;
  receivedQty?: number;
}

/**
 * Approval History Entry
 * Matches OpenAPI ApprovalHistory schema
 */
export interface ApprovalHistory {
  id: string;
  entityType: string;
  entityId: string;
  approverId: string;
  approver?: UserReference;
  action: "approve" | "reject" | "request_edit" | "submit";
  notes?: string;
  createdAt: string;
}

/**
 * Delivery Order Item (from HO)
 * Matches OpenAPI DOItem schema
 */
export interface DOItem {
  id: string;
  doId: string;
  prItemId: string;
  materialId: string;
  material?: MaterialReference;
  quantity: number;
  quantityReceived?: number;
  unit: string;
}

/**
 * Delivery Order (from HO)
 * Matches OpenAPI DeliveryOrder schema
 */
export interface DeliveryOrderFromHO {
  id: string;
  prId: string;
  do_number: string;
  do_date: string;
  status: DOStatusType;
  items: DOItem[];
  createdAt: string;
  updatedAt: string;
  // Legacy fields
  doNumber?: string;
  doDate?: string;
  documentPath?: string;
  documentName?: string;
  createdBy?: string;
  notes?: string;
}

/**
 * Purchase Request
 * Matches OpenAPI PurchaseRequest schema
 */
export interface PurchaseRequest {
  id: string;
  mr_id?: string;
  required_date?: string;
  priority?: PRPriorityType;
  notes?: string;
  lead_time_estimate?: number;
  status: PRStatusType;
  items?: PRItem[];
  approvalHistory?: ApprovalHistory[];
  deliveryOrders?: DeliveryOrderFromHO[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields
  prNumber?: string;
  requestDate?: string;
  requiredDate?: string;
  mrNumber?: string;
  sourcePlanId?: string;
  sourcePlanNumber?: string;
  planId?: string;
  planNumber?: string;
  createdBy?: string;
  createdByName?: string;
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

// Matches OpenAPI CreatePRRequest
export interface CreatePRRequest {
  mr_id?: string;
  required_date: string;
  priority: PRPriorityType;
  notes?: string;
  lead_time_estimate?: number;
  items: PRItemCreateData[];
}

export interface PRItemCreateData {
  materialId: string;
  quantityRequested: number;
  notes?: string;
}

// Matches OpenAPI UpdatePRRequest
export interface UpdatePRRequest {
  required_date?: string;
  priority?: PRPriorityType;
  notes?: string;
  lead_time_estimate?: number;
  items?: PRItemUpdateData[];
}

export interface PRItemUpdateData {
  id?: string;
  materialId?: string;
  quantityRequested?: number;
  notes?: string;
}

// Matches OpenAPI SubmitPRRequest
export interface SubmitPRRequest {
  notes?: string;
}

// Matches OpenAPI ApprovePRRequest
export interface ApprovePRRequest {
  notes?: string;
}

// Matches OpenAPI RejectPRRequest
export interface RejectPRRequest {
  reason: string;
  notes?: string;
}

// Matches OpenAPI AddPRItemRequest
export interface AddPRItemRequest {
  materialId: string;
  quantityRequested: number;
  notes?: string;
}

// Matches OpenAPI UpdatePRItemRequest
export interface UpdatePRItemRequest {
  quantityRequested?: number;
  notes?: string;
}

// Matches OpenAPI UpdateLeadTimeRequest
export interface UpdateLeadTimeRequest {
  lead_time_estimate: number;
}

// Matches OpenAPI MarkAsProcessingRequest
export interface MarkAsProcessingRequest {
  do_number?: string;
  do_date?: string;
}

// Matches OpenAPI MarkAsDOIssuedRequest
export interface MarkAsDOIssuedRequest {
  do_number: string;
}

// Matches OpenAPI AddNoteRequest
export interface AddNoteRequest {
  note: string;
}

// Legacy form data types
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
  status?: PRStatusType | "all";
  startDate?: string;
  endDate?: string;
  search?: string;
  priority?: PRPriorityType;
  mrId?: string;
  // Legacy fields
  dateFrom?: string;
  dateTo?: string;
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
  status: PRStatusType;
  count: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PRListResponse {
  success: boolean;
  data: PurchaseRequest[];
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

export type PRStatusColor = {
  [key in PRStatusType]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const prStatusColors: PRStatusColor = {
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
  processing: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  do_issued: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  resubmitted: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  cancelled: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
  },
};

export const prPriorityColors: Record<PRPriorityType, { bg: string; text: string; border: string }> = {
  low: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  medium: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  high: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  urgent: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

// Status transition rules
export const canTransitionTo: Record<PRStatusType, PRStatusType[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["approved", "rejected"],
  approved: ["processing"],
  rejected: ["draft", "resubmitted"],
  processing: ["do_issued"],
  do_issued: [], // Wait for goods receipt
  resubmitted: ["approved", "rejected"],
  cancelled: [],
};

// Check if PR can be edited
export const canEdit = (status: PRStatusType): boolean => {
  return status === "draft" || status === "resubmitted";
};

// Check if PR can be deleted
export const canDelete = (status: PRStatusType): boolean => {
  return status === "draft";
};

// Check if PR needs approval
export const needsApproval = (status: PRStatusType): boolean => {
  return status === "submitted" || status === "resubmitted";
};

// Check if PR can receive DO
export const canAddDO = (status: PRStatusType): boolean => {
  return status === "processing" || status === "do_issued";
};

// Get display label for status
export const getPRStatusLabel = (status: PRStatusType): string => {
  const labels: Record<PRStatusType, string> = {
    draft: "Draft",
    submitted: "Pending Approval",
    approved: "Approved",
    rejected: "Rejected",
    processing: "Processing",
    do_issued: "DO Issued",
    resubmitted: "Resubmitted",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

// Get display label for priority
export const getPRPriorityLabel = (priority: PRPriorityType): string => {
  const labels: Record<PRPriorityType, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };
  return labels[priority] || priority;
};