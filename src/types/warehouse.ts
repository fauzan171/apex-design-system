/**
 * Warehouse Module Types
 * Based on PRD-05-Warehouse.md and OpenAPI spec
 * Covers: Stock, Goods Receipt, Goods Issue, Delivery Order, BAST, Inspection
 */

// ============================================
// ENUMS
// ============================================

// Stock/Low Stock Alert Status
export enum StockCategory {
  RAW_MATERIAL = "Raw Material",
  WORK_IN_PROGRESS = "Work in Progress",
  FINISHED_GOOD = "Finished Good",
  CONSUMABLE = "Consumable",
}

// Product Type (from OpenAPI)
export type ProductType = "FG" | "SEMI" | "RAW" | "PACKAGING" | "SPAREPART" | "SUPPORT";

// Goods Receipt Status (snake_case to match API)
export type GRStatusType =
  | "draft"
  | "inspection_pending"
  | "inspection_in_progress"
  | "inspection_approved"
  | "inspection_rejected"
  | "completed"
  | "cancelled";

export enum GRStatus {
  DRAFT = "draft",
  INSPECTION_PENDING = "inspection_pending",
  INSPECTION_IN_PROGRESS = "inspection_in_progress",
  INSPECTION_APPROVED = "inspection_approved",
  INSPECTION_REJECTED = "inspection_rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Goods Issue Status (snake_case to match API)
export type GIStatusType =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "issued"
  | "cancelled";

export enum GIStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
  ISSUED = "issued",
  CANCELLED = "cancelled",
}

// Finished Goods Receipt Status
export type FGStatusType = "received";

export enum FGStatus {
  RECEIVED = "received",
}

// BAST Status (Inbound & Outbound)
export type BASTStatusType = "generated" | "signed";

export enum BASTStatus {
  GENERATED = "generated",
  SIGNED = "signed",
}

// Inspection Status
export type InspectionStatusType =
  | "pending"
  | "in_progress"
  | "submitted"
  | "approved"
  | "rejected";

export enum InspectionStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Warehouse DO Status
export type WDOStatusType =
  | "draft"
  | "released"
  | "partially_delivered"
  | "delivered"
  | "cancelled";

export enum WDOStatus {
  DRAFT = "draft",
  RELEASED = "released",
  PARTIALLY_DELIVERED = "partially_delivered",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

// ============================================
// INTERFACES - Common Types
// ============================================

/**
 * Product reference from API (matches OpenAPI Product schema)
 */
export interface ProductReference {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  description?: string;
  baseUnit: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================
// INTERFACES - Stock Management
// ============================================

/**
 * Stock (Inventory) for each product
 * Matches OpenAPI Stock schema
 */
export interface Stock {
  id: string;
  productId: string;
  product: ProductReference;
  quantity: number;
  safetyStock: number;
  location: string;
  lastUpdated: string;
}

/**
 * Low Stock Alert
 */
export interface StockAlert {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  currentQty: number;
  safetyStock: number;
  shortageAmount: number;
  category: StockCategory;
  lastUpdated: string;
  actionTaken?: string;
}

/**
 * Safety Stock Update Request
 * Matches OpenAPI SafetyStockUpdateRequest
 */
export interface SafetyStockUpdateRequest {
  safety_stock: number;
}

// ============================================
// INTERFACES - Goods Receipt (Inbound)
// ============================================

/**
 * Goods Receipt Item
 * Matches OpenAPI GRItem schema
 */
export interface GRItem {
  id: string;
  grId: string;
  prItemId: string;
  materialId: string;
  material: ProductReference;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  unit: string;
  inspectionNotes?: string;
}

/**
 * BAST (Berita Acara Serah Terima) Inbound
 * Matches OpenAPI BASTInbound schema
 */
export interface BASTInbound {
  id: string;
  grId: string;
  bast_number: string;
  bast_date: string;
  status: BASTStatusType;
  pdfUrl?: string;
  createdAt: string;
}

/**
 * Goods Receipt (Inbound from Supplier/PR)
 * Matches OpenAPI GoodsReceipt schema
 */
export interface GoodsReceipt {
  id: string;
  prId: string;
  purchaseRequest?: {
    id: string;
    prNumber?: string;
    required_date?: string;
  };
  do_number: string;
  gr_date: string;
  notes?: string;
  status: GRStatusType;
  items: GRItem[];
  bastInbound?: BASTInbound;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INTERFACES - Inspection
// ============================================

/**
 * Inspection Photo
 * Matches OpenAPI InspectionPhoto schema
 */
export interface InspectionPhoto {
  id: string;
  inspectionId: string;
  url: string;
  uploadedAt: string;
}

/**
 * Inspection Record
 * Matches OpenAPI Inspection schema
 */
export interface Inspection {
  id: string;
  grId: string;
  goodsReceipt?: GoodsReceipt;
  status: InspectionStatusType;
  photos: InspectionPhoto[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INTERFACES - Goods Issue (Outbound for WO)
// ============================================

/**
 * Goods Issue Item
 * Matches OpenAPI GIItem schema
 */
export interface GIItem {
  id: string;
  giId: string;
  materialId: string;
  material: ProductReference;
  quantityRequested: number;
  quantityIssued: number;
  unit: string;
}

/**
 * Goods Issue (Issue materials to Work Order)
 * Matches OpenAPI GoodsIssue schema
 */
export interface GoodsIssue {
  id: string;
  woId: string;
  workOrder?: {
    id: string;
    woNumber?: string;
    productName?: string;
  };
  status: GIStatusType;
  items: GIItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INTERFACES - Finished Goods Receipt
// ============================================

/**
 * Finished Goods Receipt (WO Completion Receipt)
 * Matches OpenAPI FinishedGoodsReceipt schema
 */
export interface FinishedGoodsReceipt {
  id: string;
  woId: string;
  workOrder?: {
    id: string;
    woNumber?: string;
    productName?: string;
  };
  quantity: number;
  status: FGStatusType;
  receivedAt?: string;
  createdAt: string;
}

// ============================================
// INTERFACES - Delivery Order (Warehouse DO)
// ============================================

/**
 * Warehouse Delivery Order Item
 * Matches OpenAPI WarehouseDOItem schema
 */
export interface WarehouseDOItem {
  id: string;
  doId: string;
  productId: string;
  product: ProductReference;
  quantity: number;
  quantityDelivered?: number;
  unit: string;
}

/**
 * BAST (Berita Acara Serah Terima) Outbound
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
}

/**
 * Delivery Order (Outbound from Warehouse to HO)
 * Matches OpenAPI WarehouseDO schema
 * Note: Uses DeliveryOrder as the primary interface name for backward compatibility
 */
export interface DeliveryOrder {
  id: string;
  do_number: string;
  doDate?: string; // Legacy camelCase field
  do_date?: string; // API snake_case field
  status: WDOStatusType;
  items: WarehouseDOItem[];
  bastOutbound?: BASTOutbound;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FORM TYPES
// ============================================

// Goods Receipt - Matches OpenAPI CreateGRRequest
export interface GRFormData {
  pr_id: string;
  do_number: string;
  gr_date: string;
  notes?: string;
  items: GRItemFormData[];
}

export interface GRItemFormData {
  prItemId: string;
  quantityReceived: number;
  inspectionNotes?: string;
}

// Matches OpenAPI UpdateGRRequest
export interface UpdateGRRequest {
  gr_date?: string;
  notes?: string;
}

// Matches OpenAPI UpdateGRItemRequest
export interface UpdateGRItemRequest {
  quantityAccepted?: number;
  quantityRejected?: number;
  inspectionNotes?: string;
}

// Matches OpenAPI CancelGRRequest
export interface CancelGRRequest {
  reason: string;
  notes?: string;
}

// Inspection
export interface InspectionFormData {
  status?: InspectionStatusType;
  notes?: string;
}

export interface InspectionPhotoFormData {
  file: File;
}

// Goods Issue
export interface GIFormData {
  woId: string;
  items: GIItemFormData[];
}

export interface GIItemFormData {
  materialId: string;
  quantityRequested: number;
}

export interface UpdateGIRequest {
  notes?: string;
}

// Finished Goods Receipt
export interface FGReceiptFormData {
  woId: string;
  quantity: number;
}

// Warehouse DO
export interface WDDOFormData {
  do_number: string;
  do_date: string;
  items: WDDOItemFormData[];
}

export interface WDDOItemFormData {
  productId: string;
  quantity: number;
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

export interface StockFilters {
  category?: StockCategory;
  lowStock?: boolean;
  search?: string;
}

export interface GRFilters {
  status?: GRStatusType;
  prId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  // Legacy fields for backward compatibility
  dateFrom?: string;
  dateTo?: string;
}

export interface GIFilters {
  status?: GIStatusType;
  woId?: string;
  startDate?: string;
  endDate?: string;
  // Legacy fields for backward compatibility
  dateFrom?: string;
  dateTo?: string;
}

export interface DOFilters {
  status?: WDOStatusType;
  startDate?: string;
  endDate?: string;
  search?: string;
  // Legacy fields for backward compatibility
  dateFrom?: string;
  dateTo?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface StockListResponse {
  success: boolean;
  data: Stock[];
  pagination?: PaginationMeta;
}

export interface GRListResponse {
  success: boolean;
  data: GoodsReceipt[];
  pagination?: PaginationMeta;
}

export interface GIListResponse {
  success: boolean;
  data: GoodsIssue[];
  pagination?: PaginationMeta;
}

export interface DOListResponse {
  success: boolean;
  data: DeliveryOrder[];
  pagination?: PaginationMeta;
}

// ============================================
// UTILITY TYPES
// ============================================

export const grStatusColors: Record<GRStatusType, { bg: string; text: string; border: string }> = {
  draft: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
  inspection_pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  inspection_in_progress: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  inspection_approved: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  inspection_rejected: {
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

export const giStatusColors: Record<GIStatusType, { bg: string; text: string; border: string }> = {
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
  issued: {
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

export const bastStatusColors: Record<BASTStatusType, { bg: string; text: string; border: string }> = {
  generated: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  signed: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
};

export const wdoStatusColors: Record<WDOStatusType, { bg: string; text: string; border: string }> = {
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
  partially_delivered: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

// Status transition rules
export const canGRTransitionTo: Record<GRStatusType, GRStatusType[]> = {
  draft: ["inspection_pending", "cancelled"],
  inspection_pending: ["inspection_in_progress", "cancelled"],
  inspection_in_progress: ["inspection_approved", "inspection_rejected", "cancelled"],
  inspection_approved: ["completed"],
  inspection_rejected: ["draft"], // Can revise and restart
  completed: [],
  cancelled: [],
};

export const canGITransitionTo: Record<GIStatusType, GIStatusType[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["approved", "rejected"],
  approved: ["issued"],
  rejected: ["draft"],
  issued: [],
  cancelled: [],
};

// Check if GR can be edited
export const canEditGR = (status: GRStatusType): boolean => {
  return status === "draft";
};

// Check if GR can be cancelled
export const canCancelGR = (status: GRStatusType): boolean => {
  return status !== "completed" && status !== "cancelled";
};

// Check if GI can be edited
export const canEditGI = (status: GIStatusType): boolean => {
  return status === "draft";
};

// Stock Category Colors
export const StockCategoryColors: Record<StockCategory, string> = {
  [StockCategory.RAW_MATERIAL]: "bg-slate-100 text-slate-700 border-slate-200",
  [StockCategory.WORK_IN_PROGRESS]: "bg-amber-100 text-amber-700 border-amber-200",
  [StockCategory.FINISHED_GOOD]: "bg-green-100 text-green-700 border-green-200",
  [StockCategory.CONSUMABLE]: "bg-blue-100 text-blue-700 border-blue-200",
};

export const StockCategoryLabels: Record<StockCategory, string> = {
  [StockCategory.RAW_MATERIAL]: "Raw Material",
  [StockCategory.WORK_IN_PROGRESS]: "Work in Progress",
  [StockCategory.FINISHED_GOOD]: "Finished Good",
  [StockCategory.CONSUMABLE]: "Consumable",
};

// Helper function to get DO date (handles both formats)
export const getDODate = (do_: DeliveryOrder): string => {
  return do_.do_date || do_.doDate || "";
};

// Helper function to get DO number (handles both formats)
export const getDONumber = (do_: DeliveryOrder): string => {
  return do_.do_number || "";
};