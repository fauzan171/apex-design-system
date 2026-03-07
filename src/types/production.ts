/**
 * Production Module Types
 * Based on PRD-06-PRODUCTION.md
 */

// ============================================
// ENUMS
// ============================================

export enum WOStatus {
  DRAFT = "Draft",
  RELEASED = "Released",
  IN_PROGRESS = "In Progress",
  QC = "QC",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum WOStepStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export enum QCResult {
  PASS = "Pass",
  FAIL = "Fail",
}

export enum QCFindingStatus {
  OPEN = "Open",
  RESOLVED = "Resolved",
}

// ============================================
// INTERFACES
// ============================================

/**
 * Work Order Step
 */
export interface WOStep {
  id: string;
  woId: string;
  sequence: number;
  operationName: string;
  estimatedTime: number; // in minutes
  status: WOStepStatus;
  actualStart?: string;
  actualEnd?: string;
}

/**
 * Progress Photo
 */
export interface ProgressPhoto {
  id: string;
  progressId: string;
  filePath: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
}

/**
 * WO Progress Record
 */
export interface WOProgress {
  id: string;
  woId: string;
  stepId: string;
  quantityDone: number;
  notes?: string;
  photos: ProgressPhoto[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

/**
 * QC Finding
 */
export interface QCFinding {
  id: string;
  qcSessionId: string;
  description: string;
  reworkNotes: string;
  status: QCFindingStatus;
  photos: FindingPhoto[];
  createdAt: string;
  resolvedAt?: string;
}

/**
 * Finding Photo
 */
export interface FindingPhoto {
  id: string;
  findingId: string;
  filePath: string;
  uploadedAt: string;
}

/**
 * QC Session
 */
export interface QCSession {
  id: string;
  woId: string;
  qcBy: string;
  qcByName: string;
  qcAt: string;
  result: QCResult;
  findings: QCFinding[];
}

/**
 * Work Order
 */
export interface WorkOrder {
  id: string;
  woNumber: string;
  planId: string;
  planNumber: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  status: WOStatus;
  startDate?: string;
  targetDate: string; // required
  endDate?: string;
  steps: WOStep[];
  progress: WOProgress[];
  qcSessions: QCSession[];
  reworkNotes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  releasedAt?: string;
  releasedBy?: string;
  completedAt?: string;
  completedBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface WOFormData {
  planId: string;
  planNumber: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  targetDate: string;
  notes?: string;
  steps: WOStepFormData[];
}

export interface WOStepFormData {
  operationName: string;
  estimatedTime: number;
  sequence: number;
}

export interface ProgressUpdateFormData {
  stepId: string;
  quantityDone: number;
  notes?: string;
  photos: File[];
  captions?: string[];
}

export interface QCFormData {
  result: QCResult;
  findings: QCFindingFormData[];
}

export interface QCFindingFormData {
  description: string;
  reworkNotes: string;
  photos?: File[];
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface WOFilters {
  status?: WOStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  productId?: string;
}

// ============================================
// REPORT TYPES
// ============================================

export interface WOStatusSummary {
  status: WOStatus;
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
  [key in WOStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const woStatusColors: WOStatusColor = {
  [WOStatus.DRAFT]: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  [WOStatus.RELEASED]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [WOStatus.IN_PROGRESS]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [WOStatus.QC]: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  [WOStatus.COMPLETED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [WOStatus.CANCELLED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export type WOStepStatusColor = {
  [key in WOStepStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const woStepStatusColors: WOStepStatusColor = {
  [WOStepStatus.PENDING]: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
  [WOStepStatus.IN_PROGRESS]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [WOStepStatus.DONE]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
};

// Status transition rules
export const canWOTransitionTo: Record<WOStatus, WOStatus[]> = {
  [WOStatus.DRAFT]: [WOStatus.RELEASED, WOStatus.CANCELLED],
  [WOStatus.RELEASED]: [WOStatus.IN_PROGRESS, WOStatus.CANCELLED],
  [WOStatus.IN_PROGRESS]: [WOStatus.QC, WOStatus.CANCELLED],
  [WOStatus.QC]: [WOStatus.COMPLETED, WOStatus.IN_PROGRESS], // Fail goes back to In Progress
  [WOStatus.COMPLETED]: [], // Final state
  [WOStatus.CANCELLED]: [], // Final state
};

// Check if WO can be edited
export const canWOEdit = (status: WOStatus): boolean => {
  return status === WOStatus.DRAFT;
};

// Check if WO can be cancelled
export const canWOCancel = (status: WOStatus): boolean => {
  return status !== WOStatus.COMPLETED && status !== WOStatus.CANCELLED;
};

// Check if WO is in a state where progress can be updated
export const canUpdateProgress = (status: WOStatus): boolean => {
  return status === WOStatus.IN_PROGRESS;
};

// Check if WO can be marked for QC
export const canMarkForQC = (status: WOStatus): boolean => {
  return status === WOStatus.IN_PROGRESS;
};
