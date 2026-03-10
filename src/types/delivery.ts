/**
 * Delivery Module Types
 * Based on PRD-05-WAREHOUSE.md - Delivery Order (Outbound to HO)
 * Matches OpenAPI WarehouseDO schema
 */

// ============================================
// ENUMS
// ============================================

// Warehouse DO Status (matches OpenAPI WarehouseDO.status)
export type DOStatusType =
  | "draft"
  | "released"
  | "in_transit"
  | "partially_delivered"
  | "delivered"
  | "received"
  | "cancelled";

export enum DOStatus {
  DRAFT = "draft",
  RELEASED = "released",
  IN_TRANSIT = "in_transit",
  PARTIALLY_DELIVERED = "partially_delivered",
  DELIVERED = "delivered",
  RECEIVED = "received",
  CANCELLED = "cancelled",
}

// BAST Status (matches OpenAPI BASTOutbound implicit status)
export type BASTStatusType = "generated" | "uploaded" | "signed";

export enum BASTStatus {
  GENERATED = "generated",
  UPLOADED = "uploaded",
  SIGNED = "signed",
}

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
  baseUnit: string;
  status: "active" | "inactive";
}

// ============================================
// INTERFACES - Stock Reference
// ============================================

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

// ============================================
// INTERFACES - Delivery Order
// ============================================

/**
 * Delivery Order Item
 * Matches OpenAPI WarehouseDOItem schema
 */
export interface DOItem {
  id: string;
  doId: string;
  productId: string;
  product?: ProductReference;
  quantity: number;
  quantityDelivered?: number;
  unit: string;
  // Legacy fields
  productCode?: string;
  productName?: string;
  stockBefore?: number;
  stockAfter?: number;
}

/**
 * BAST (Berita Acara Serah Terima) - Outbound
 * Matches OpenAPI BASTOutbound schema
 */
export interface BASTOutbound {
  id: string;
  doId: string;
  bast_number: string;
  bast_date: string;
  fileUrl?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  // Legacy fields
  doNumber?: string;
  status?: BASTStatusType;
  documentPath?: string;
  notes?: string;
  receivedDate?: string;
}

/**
 * DO Status History Entry
 */
export interface DOStatusHistory {
  id: string;
  doId: string;
  status: DOStatusType;
  timestamp: string;
  userId: string;
  userName: string;
  notes?: string;
}

/**
 * Delivery Order (Outbound to HO)
 * Matches OpenAPI WarehouseDO schema
 */
export interface DeliveryOrder {
  id: string;
  do_number: string;
  do_date: string;
  status: DOStatusType;
  items: DOItem[];
  bastOutbound?: BASTOutbound;
  createdAt: string;
  updatedAt: string;
  // Legacy fields
  doNumber?: string;
  doDate?: string;
  notes?: string;
  statusHistory?: DOStatusHistory[];
  createdBy?: string;
  releasedAt?: string;
  releasedBy?: string;
  deliveredAt?: string;
  receivedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  bast?: BASTOutbound;
}

// ============================================
// FORM TYPES
// ============================================

// Matches OpenAPI CreateWarehouseDORequest (implicit)
export interface DOFormData {
  do_number: string;
  do_date: string;
  notes?: string;
  items: DOItemFormData[];
}

export interface DOItemFormData {
  productId: string;
  quantity: number;
}

// Matches OpenAPI UpdateWarehouseDORequest (implicit)
export interface UpdateDORequest {
  do_number?: string;
  do_date?: string;
  notes?: string;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface DOFilters {
  status?: DOStatusType | "all";
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

export interface DOListResponse {
  success: boolean;
  data: DeliveryOrder[];
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

export type DOStatusColor = {
  [key in DOStatusType]: {
    bg: string;
    text: string;
    border: string;
  };
};

export const doStatusColors: DOStatusColor = {
  draft: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  released: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  in_transit: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  partially_delivered: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  received: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export const bastStatusColors: Record<BASTStatusType, { bg: string; text: string; border: string }> = {
  generated: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  uploaded: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  signed: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
};

// Status progression rules
export const canTransitionTo: Record<DOStatusType, DOStatusType[]> = {
  draft: ["released", "cancelled"],
  released: ["in_transit", "partially_delivered", "delivered", "cancelled"],
  in_transit: ["delivered", "partially_delivered", "cancelled"],
  partially_delivered: ["delivered", "received", "cancelled"],
  delivered: ["received"],
  received: [], // Final state
  cancelled: [], // Final state
};

// Check if DO can be edited
export const canEditDO = (status: DOStatusType): boolean => {
  return status === "draft";
};

// Check if DO can be cancelled
export const canCancelDO = (status: DOStatusType): boolean => {
  return !["delivered", "cancelled"].includes(status);
};

// Check if DO can be released
export const canReleaseDO = (status: DOStatusType): boolean => {
  return status === "draft";
};

// Check if BAST can be uploaded
export const canUploadBAST = (status: DOStatusType): boolean => {
  return status === "delivered";
};

// Get display label for status
export const getDOStatusLabel = (status: DOStatusType): string => {
  const labels: Record<DOStatusType, string> = {
    draft: "Draft",
    released: "Released",
    in_transit: "In Transit",
    partially_delivered: "Partially Delivered",
    delivered: "Delivered",
    received: "Received",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

// Helper function to get DO number (handles both formats)
export const getDONumber = (do_: DeliveryOrder): string => {
  return do_.do_number || do_.doNumber || "";
};

// Helper function to get DO date (handles both formats)
export const getDODate = (do_: DeliveryOrder): string => {
  return do_.do_date || do_.doDate || "";
};