/**
 * Production Module Types
 * Based on PRD-06-PRODUCTION.md and OpenAPI spec
 */

// ============================================
// ENUMS
// ============================================

// Work Order Status (matches OpenAPI WorkOrder.status)
export type WOStatusType =
  | "draft"
  | "not_started"
  | "released"
  | "in_progress"
  | "marked_qc"
  | "qc"
  | "qc_in_progress"
  | "qc_passed"
  | "qc_failed"
  | "completed"
  | "cancelled";

export enum WOStatus {
  DRAFT = "draft",
  NOT_STARTED = "not_started", // Legacy status
  RELEASED = "released",
  IN_PROGRESS = "in_progress",
  MARKED_QC = "marked_qc",
  QC = "qc", // Legacy status alias
  QC_IN_PROGRESS = "qc_in_progress",
  QC_PASSED = "qc_passed",
  QC_FAILED = "qc_failed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// WO Step Status (matches OpenAPI WOStep.status)
export type WOStepStatusType = "pending" | "in_progress" | "completed";

export enum WOStepStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  DONE = "completed", // Legacy alias
}

// QC Session Status
export type QCSessionStatusType = "in_progress" | "completed";

export enum QCSessionStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

// QC Result (matches OpenAPI QCSession.result)
export type QCResultType = "pass" | "fail" | "pending";

export enum QCResult {
  PASS = "pass",
  FAIL = "fail",
  PENDING = "pending",
}

// QC Finding Status (matches OpenAPI QCFinding.status)
export type QCFindingStatusType = "open" | "resolved";

export enum QCFindingStatus {
  OPEN = "open",
  RESOLVED = "resolved",
}

// QC Finding Photo Type
export type QCFindingPhotoType = "finding" | "rework";

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
  type: "FG" | "SEMI" | "RAW" | "PACKAGING" | "SPAREPART" | "SUPPORT";
  description?: string;
  baseUnit: string;
  status: "active" | "inactive";
}

// ============================================
// INTERFACES - Work Order
// ============================================

/**
 * Work Order Step
 * Matches OpenAPI WOStep schema
 */
export interface WOStep {
  id: string;
  woId: string;
  name?: string;
  sequence?: number;
  status?: WOStepStatusType;
  startedAt?: string;
  completedAt?: string;
  // Legacy fields for backward compatibility
  operationName?: string;
  estimatedTime?: number;
  actualStart?: string;
  actualEnd?: string;
}

/**
 * Progress Photo
 * Matches OpenAPI ProgressPhoto schema
 */
export interface ProgressPhoto {
  id: string;
  progressId: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

/**
 * WO Progress Record
 * Matches OpenAPI WOProgress schema
 */
export interface WOProgress {
  id?: string;
  woId?: string;
  currentStepId?: string;
  quantity?: number;
  photos?: ProgressPhoto[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields
  stepId?: string;
  quantityDone?: number;
  notes?: string;
  createdBy?: string;
  createdByName?: string;
}

/**
 * Work Order
 * Matches OpenAPI WorkOrder schema
 */
export interface WorkOrder {
  id: string;
  planId?: string;
  productId?: string;
  product?: ProductReference;
  quantity?: number;
  quantityCompleted?: number;
  target_date?: string;
  notes?: string;
  status?: WOStatusType;
  steps?: WOStep[];
  progress?: WOProgress[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  woNumber?: string;
  planNumber?: string;
  planItemId?: string;
  productCode?: string;
  productName?: string;
  unit?: string;
  startDate?: string;
  endDate?: string;
  releaseDate?: string;
  releaseBy?: string;
  createdBy?: string;
  targetDate?: string;
  // QC fields
  qcSessions?: QCSession[];
  reworkNotes?: string;
  releasedAt?: string;
  releasedBy?: string;
  completedAt?: string;
  completedBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
}

// ============================================
// INTERFACES - QC
// ============================================

/**
 * QC Finding Photo
 * Matches OpenAPI QCFindingPhoto schema
 */
export interface QCFindingPhoto {
  id?: string;
  findingId?: string;
  url?: string;
  filePath?: string; // Legacy field
  type?: QCFindingPhotoType;
  uploadedAt?: string;
}

/**
 * QC Finding
 * Matches OpenAPI QCFinding schema
 */
export interface QCFinding {
  id?: string;
  sessionId?: string;
  description?: string;
  reworkNotes?: string;
  status?: QCFindingStatusType;
  photos?: QCFindingPhoto[];
  resolvedAt?: string;
  createdAt?: string;
  // Legacy field
  qcSessionId?: string;
}

/**
 * QC Session
 * Matches OpenAPI QCSession schema
 */
export interface QCSession {
  id?: string;
  woId?: string;
  workOrder?: WorkOrder;
  status?: QCSessionStatusType;
  result?: QCResultType;
  notes?: string;
  findings?: QCFinding[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields
  qcBy?: string;
  qcByName?: string;
  qcAt?: string;
}

// ============================================
// FORM TYPES
// ============================================

// Matches OpenAPI CreateWORequest
export interface WOFormData {
  plan_id?: string;
  product_id: string;
  quantity: number;
  target_date: string;
  notes?: string;
  steps?: WOStepFormData[];
  // Legacy fields
  planId?: string;
  planNumber?: string;
  productId?: string;
  productCode?: string;
  productName?: string;
}

export interface WOStepFormData {
  name: string;
  sequence: number;
  // Legacy fields
  operationName?: string;
  estimatedTime?: number;
}

// Matches OpenAPI UpdateWORequest
export interface UpdateWORequest {
  target_date?: string;
  notes?: string;
}

// Matches OpenAPI CancelWORequest
export interface CancelWORequest {
  reason: string;
}

export interface ProgressUpdateFormData {
  stepId: string;
  quantity: number;
  notes?: string;
  photos?: File[];
  captions?: string[];
  // Legacy field
  quantityDone?: number;
}

// Matches OpenAPI AddFindingRequest
export interface QCFindingFormData {
  description: string;
  reworkNotes: string;
  photos?: File[];
}

// Matches OpenAPI QCNotesRequest
export interface QCNotesRequest {
  notes?: string;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface WOFilters {
  status?: WOStatusType | "all";
  startDate?: string;
  endDate?: string;
  search?: string;
  productId?: string;
  planId?: string;
  // Legacy fields
  dateFrom?: string;
  dateTo?: string;
}

// ============================================
// REPORT TYPES
// ============================================

export interface WOStatusSummary {
  status: WOStatusType;
  count: number;
}

export interface ProductionMetrics {
  totalWOs: number;
  completedWOs: number;
  inProgressWOs: number;
  qcPendingWOs: number;
  onTimeRate: number;
  qcFirstPassRate: number;
}

// ============================================
// UTILITY TYPES
// ============================================

export type WOStatusColor = {
  [key in WOStatusType]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const woStatusColors: WOStatusColor = {
  draft: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  not_started: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
  released: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  in_progress: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  marked_qc: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  qc: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  qc_in_progress: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  qc_passed: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  qc_failed: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  cancelled: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
  },
};

export type WOStepStatusColor = {
  [key in WOStepStatusType]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const woStepStatusColors: WOStepStatusColor = {
  pending: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
  in_progress: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
};

// Status transition rules
export const canWOTransitionTo: Record<WOStatusType, WOStatusType[]> = {
  draft: ["released", "not_started", "cancelled"],
  not_started: ["released", "cancelled"],
  released: ["in_progress", "cancelled"],
  in_progress: ["marked_qc", "qc", "cancelled"],
  marked_qc: ["qc_in_progress", "cancelled"],
  qc: ["qc_in_progress", "cancelled"],
  qc_in_progress: ["qc_passed", "qc_failed"],
  qc_passed: ["completed"],
  qc_failed: ["in_progress"], // Rework - back to production
  completed: [], // Final state
  cancelled: [], // Final state
};

// Check if WO can be edited
export const canWOEdit = (status: WOStatusType): boolean => {
  return status === "draft";
};

// Check if WO can be cancelled
export const canWOCancel = (status: WOStatusType): boolean => {
  return status !== "completed" && status !== "cancelled";
};

// Check if WO is in a state where progress can be updated
export const canUpdateProgress = (status: WOStatusType): boolean => {
  return status === "in_progress";
};

// Check if WO can be marked for QC
export const canMarkForQC = (status: WOStatusType): boolean => {
  return status === "in_progress";
};

// Check if WO is in QC
export const isInQC = (status: WOStatusType): boolean => {
  return ["marked_qc", "qc_in_progress", "qc_passed", "qc_failed"].includes(status);
};

// Check if WO can start QC
export const canStartQC = (status: WOStatusType): boolean => {
  return status === "marked_qc";
};

// Check if WO can be completed
export const canComplete = (status: WOStatusType): boolean => {
  return status === "qc_passed";
};

// Get display label for status
export const getWOStatusLabel = (status: WOStatusType): string => {
  const labels: Record<WOStatusType, string> = {
    draft: "Draft",
    not_started: "Not Started",
    released: "Released",
    in_progress: "In Progress",
    marked_qc: "Marked for QC",
    qc: "QC",
    qc_in_progress: "QC In Progress",
    qc_passed: "QC Passed",
    qc_failed: "QC Failed",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};