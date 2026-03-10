/**
 * Master Data Types
 * Product and Bill of Materials (BoM) management
 * Based on OpenAPI spec
 */

// ==================== PRODUCT TYPES ====================

// Product Type (matches OpenAPI Product.type)
export type ProductType =
  | "FG"        // Finished Goods
  | "SEMI"      // Semi-Finished
  | "RAW"       // Raw Material
  | "PACKAGING" // Packaging
  | "SPAREPART" // Spare Part
  | "SUPPORT";  // Support Material

// Product Status
export type ProductStatusType = "active" | "inactive" | "discontinued";

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

// Legacy enum for backward compatibility
export enum ProductCategory {
  FINISHED_GOODS = "finished_goods",
  RAW_MATERIAL = "raw_material",
  SEMI_FINISHED = "semi_finished",
  PACKAGING = "packaging",
  SPARE_PART = "spare_part",
  SERVICE = "service",
}

/**
 * Product
 * Matches OpenAPI Product schema
 */
export interface Product {
  id: string;
  code: string;
  name: string;
  type?: ProductType;
  description?: string;
  baseUnit?: string;
  status: ProductStatusType;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  category?: ProductCategory | string;
  unitOfMeasure?: string;
  basePrice?: number;
  sellingPrice?: number;
  costPrice?: number;
  minStock?: number;
  maxStock?: number;
  currentStock?: number;
  reorderPoint?: number;
  weight?: number;
  weightUnit?: "kg" | "g";
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  dimensionUnit?: "cm" | "mm" | "m";
  shelfLife?: number;
  storageCondition?: string;
  imageUrl?: string;
  barcode?: string;
  hasBoM?: boolean;
  isPurchasable?: boolean;
  isSellable?: boolean;
  taxRate?: number;
  createdBy?: string;
}

/**
 * Create Product Request
 * Matches OpenAPI CreateProductRequest
 */
export interface CreateProductRequest {
  code: string;
  name: string;
  type: ProductType;
  description?: string;
  baseUnit: string;
  // Legacy fields
  category?: ProductCategory;
  unitOfMeasure?: string;
  basePrice?: number;
  sellingPrice?: number;
  costPrice?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  weight?: number;
  weightUnit?: "kg" | "g";
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  dimensionUnit?: "cm" | "mm" | "m";
  shelfLife?: number;
  storageCondition?: string;
  barcode?: string;
  isPurchasable?: boolean;
  isSellable?: boolean;
  taxRate?: number;
}

/**
 * Update Product Request
 * Matches OpenAPI UpdateProductRequest
 */
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  baseUnit?: string;
  status?: ProductStatusType;
  // Legacy fields
  category?: ProductCategory;
  unitOfMeasure?: string;
  basePrice?: number;
  sellingPrice?: number;
  costPrice?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  weight?: number;
  weightUnit?: "kg" | "g";
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  dimensionUnit?: "cm" | "mm" | "m";
  shelfLife?: number;
  storageCondition?: string;
  barcode?: string;
  isPurchasable?: boolean;
  isSellable?: boolean;
  taxRate?: number;
}

// ==================== BOM TYPES ====================

// BoM Status (matches OpenAPI BoM.status)
export type BoMStatusType = "draft" | "active" | "inactive" | "obsolete";

export enum BoMStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  OBSOLETE = "obsolete",
}

/**
 * BoM Item
 * Matches OpenAPI BoMItem schema
 */
export interface BoMItem {
  id: string;
  materialId?: string;
  material?: Product;
  quantityRequired?: number;
  unit?: string;
  createdAt?: string;
  // Legacy fields for backward compatibility
  productId?: string;
  product?: Product;
  quantity?: number;
  wastagePercent?: number;
  unitCost?: number;
  totalCost?: number;
  notes?: string;
  sortOrder?: number;
}

/**
 * Bill of Materials
 * Matches OpenAPI BoM schema
 */
export interface BoM {
  id: string;
  productId: string;
  product?: Product;
  status: BoMStatusType;
  items?: BoMItem[];
  version?: number | string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields - support both naming conventions
  components?: BoMItem[];  // Alias for items
  quantity?: number;
  unitOfMeasure?: string;
  totalMaterialCost?: number;
  laborCost?: number;
  overheadCost?: number;
  totalCost?: number;
  notes?: string;
  effectiveDate?: string;
  obsoleteDate?: string;
  createdBy?: string;
  isDefault?: boolean;
}

/**
 * Create BoM Request
 * Matches OpenAPI CreateBoMRequest
 */
export interface CreateBoMRequest {
  status?: BoMStatusType;
  items?: {
    materialId: string;
    quantityRequired: number;
    unit: string;
  }[];
  // Legacy fields
  productId?: string;
  version?: string | number;
  quantity?: number;
  unitOfMeasure?: string;
  laborCost?: number;
  overheadCost?: number;
  notes?: string;
  effectiveDate?: string;
  components?: {
    productId: string;
    quantity: number;
    unit?: string;
    wastagePercent?: number;
    unitCost?: number;
    totalCost?: number;
    notes?: string;
    sortOrder?: number;
  }[];
}

/**
 * Update BoM Request (Legacy)
 */
export interface UpdateBoMRequest {
  name?: string;
  description?: string;
  status?: BoMStatusType;
  items?: {
    materialId: string;
    quantityRequired: number;
    unit: string;
  }[];
  laborCost?: number;
  overheadCost?: number;
  notes?: string;
  obsoleteDate?: string;
  isDefault?: boolean;
  components?: BoMItem[];
}

/**
 * Update BoM Status Request
 * Matches OpenAPI UpdateBoMStatusRequest
 */
export interface UpdateBoMStatusRequest {
  status: BoMStatusType;
}

/**
 * Add BoM Item Request
 * Matches OpenAPI AddBoMItemRequest
 */
export interface AddBoMItemRequest {
  materialId: string;
  quantityRequired: number;
  unit: string;
}

/**
 * Update BoM Item Request
 * Matches OpenAPI UpdateBoMItemRequest
 */
export interface UpdateBoMItemRequest {
  quantityRequired?: number;
  unit?: string;
}

// Legacy type aliases
export type BoMComponent = BoMItem;
export type CreateBoMComponentRequest = AddBoMItemRequest;

// ==================== LABELS & COLORS ====================

export const productTypeLabels: Record<ProductType, string> = {
  FG: "Finished Goods",
  SEMI: "Semi-Finished",
  RAW: "Raw Material",
  PACKAGING: "Packaging",
  SPAREPART: "Spare Part",
  SUPPORT: "Support Material",
};

export const productStatusLabels: Record<ProductStatusType, string> = {
  active: "Active",
  inactive: "Inactive",
  discontinued: "Discontinued",
};

export const productCategoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.FINISHED_GOODS]: "Finished Goods",
  [ProductCategory.RAW_MATERIAL]: "Raw Material",
  [ProductCategory.SEMI_FINISHED]: "Semi-Finished",
  [ProductCategory.PACKAGING]: "Packaging",
  [ProductCategory.SPARE_PART]: "Spare Part",
  [ProductCategory.SERVICE]: "Service",
};

export const boMStatusLabels: Record<BoMStatusType, string> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
  obsolete: "Obsolete",
};

export const productTypeColors: Record<ProductType, string> = {
  FG: "bg-blue-100 text-blue-700",
  SEMI: "bg-purple-100 text-purple-700",
  RAW: "bg-amber-100 text-amber-700",
  PACKAGING: "bg-green-100 text-green-700",
  SPAREPART: "bg-gray-100 text-gray-700",
  SUPPORT: "bg-pink-100 text-pink-700",
};

export const productStatusColors: Record<ProductStatusType, { bg: string; text: string; border: string }> = {
  active: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  inactive: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
  discontinued: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

export const productCategoryColors: Record<ProductCategory, string> = {
  [ProductCategory.FINISHED_GOODS]: "bg-blue-100 text-blue-700",
  [ProductCategory.RAW_MATERIAL]: "bg-amber-100 text-amber-700",
  [ProductCategory.SEMI_FINISHED]: "bg-purple-100 text-purple-700",
  [ProductCategory.PACKAGING]: "bg-green-100 text-green-700",
  [ProductCategory.SPARE_PART]: "bg-gray-100 text-gray-700",
  [ProductCategory.SERVICE]: "bg-pink-100 text-pink-700",
};

export const boMStatusColors: Record<BoMStatusType, { bg: string; text: string; border: string }> = {
  draft: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  active: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  inactive: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
  obsolete: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert legacy ProductCategory to ProductType
 */
export const categoryToType = (category: ProductCategory): ProductType => {
  const mapping: Record<ProductCategory, ProductType> = {
    [ProductCategory.FINISHED_GOODS]: "FG",
    [ProductCategory.SEMI_FINISHED]: "SEMI",
    [ProductCategory.RAW_MATERIAL]: "RAW",
    [ProductCategory.PACKAGING]: "PACKAGING",
    [ProductCategory.SPARE_PART]: "SPAREPART",
    [ProductCategory.SERVICE]: "SUPPORT",
  };
  return mapping[category];
};

/**
 * Convert ProductType to legacy ProductCategory
 */
export const typeToCategory = (type: ProductType): ProductCategory => {
  const mapping: Record<ProductType, ProductCategory> = {
    FG: ProductCategory.FINISHED_GOODS,
    SEMI: ProductCategory.SEMI_FINISHED,
    RAW: ProductCategory.RAW_MATERIAL,
    PACKAGING: ProductCategory.PACKAGING,
    SPAREPART: ProductCategory.SPARE_PART,
    SUPPORT: ProductCategory.SERVICE,
  };
  return mapping[type];
};

// ==================== FILTER TYPES ====================

export interface ProductFilter {
  type?: ProductType | "all";
  status?: ProductStatusType | "all";
  search?: string;
  // Legacy fields
  category?: ProductCategory | "all";
  isPurchasable?: boolean;
  isSellable?: boolean;
  hasBoM?: boolean;
}

export interface BoMFilter {
  productId?: string;
  status?: BoMStatusType | "all";
  search?: string;
}

// ==================== UNIT OF MEASURE ====================

export enum UnitOfMeasure {
  PCS = "PCS",
  KG = "KG",
  G = "G",
  L = "L",
  M = "M",
  UNIT = "UNIT",
  BOX = "BOX",
  PACK = "PACK",
  ROLL = "ROLL",
  SET = "SET",
}

export const unitOfMeasureLabels: Record<UnitOfMeasure, string> = {
  PCS: "Pieces",
  KG: "Kilogram",
  G: "Gram",
  L: "Liter",
  M: "Meter",
  UNIT: "Unit",
  BOX: "Box",
  PACK: "Pack",
  ROLL: "Roll",
  SET: "Set",
};