/**
 * Delivery Module Types
 * Based on PRD-05-WAREHOUSE.md - Delivery Order (Outbound to HO)
 */

// ============================================
// ENUMS
// ============================================

export enum DOStatus {
  DRAFT = "Draft",
  RELEASED = "Released",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  RECEIVED = "Received",
  CANCELLED = "Cancelled",
}

export enum BASTStatus {
  PENDING = "Pending",
  UPLOADED = "Uploaded",
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
 * Stock reference for finished goods
 */
export interface FinishedGoodStock {
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  availableForDO: number; // Quantity not reserved in other DOs
  lastUpdated: string;
}

/**
 * Delivery Order Item
 */
export interface DOItem {
  id: string;
  doId: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  stockBefore?: number;
  stockAfter?: number;
}

/**
 * BAST (Berita Acara Serah Terima) - Outbound
 */
export interface BASTOutbound {
  id: string;
  doId: string;
  doNumber: string;
  bastNumber: string;
  documentPath?: string;
  uploadedAt?: string;
  receivedDate: string;
  status: BASTStatus;
  notes?: string;
}

/**
 * DO Status History Entry
 */
export interface DOStatusHistory {
  id: string;
  doId: string;
  status: DOStatus;
  timestamp: string;
  userId: string;
  userName: string;
  notes?: string;
}

/**
 * Delivery Order (Outbound to HO)
 */
export interface DeliveryOrder {
  id: string;
  doNumber: string;
  doDate: string;
  status: DOStatus;
  items: DOItem[];
  bast?: BASTOutbound;
  statusHistory: DOStatusHistory[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  releasedAt?: string;
  releasedBy?: string;
  deliveredAt?: string;
  receivedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface DOFormData {
  doDate: string;
  notes?: string;
  items: DOItemFormData[];
}

export interface DOItemFormData {
  productId: string;
  quantity: number;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface DOFilters {
  status?: DOStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface DOListResponse {
  data: DeliveryOrder[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DOStatusColor = {
  [key in DOStatus]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const doStatusColors: DOStatusColor = {
  [DOStatus.DRAFT]: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  [DOStatus.RELEASED]: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  [DOStatus.IN_TRANSIT]: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  [DOStatus.DELIVERED]: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  [DOStatus.RECEIVED]: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  [DOStatus.CANCELLED]: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

// Status progression rules
export const canTransitionTo: Record<DOStatus, DOStatus[]> = {
  [DOStatus.DRAFT]: [DOStatus.RELEASED, DOStatus.CANCELLED],
  [DOStatus.RELEASED]: [DOStatus.IN_TRANSIT, DOStatus.CANCELLED],
  [DOStatus.IN_TRANSIT]: [DOStatus.DELIVERED, DOStatus.CANCELLED],
  [DOStatus.DELIVERED]: [DOStatus.RECEIVED],
  [DOStatus.RECEIVED]: [], // Final state
  [DOStatus.CANCELLED]: [], // Final state
};