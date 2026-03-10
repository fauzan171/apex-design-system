/**
 * Master Data Service
 * Handles all Product and Bill of Materials (BoM) operations
 * Real API integration
 *
 * OpenAPI endpoints (base: /api/v1):
 * - /products/*
 * - /boms/*
 * - /products/{productId}/bom/*
 */

import type {
  Product,
  ProductType,
  ProductFilter,
  CreateProductRequest,
  UpdateProductRequest,
  BoM,
  BoMFilter,
  CreateBoMRequest,
  UpdateBoMRequest,
  UpdateBoMStatusRequest,
  AddBoMItemRequest,
  UpdateBoMItemRequest,
} from "@/types/masterData";
import { apiClient } from "@/lib/apiClient";

// Helper to extract array from paginated or direct responses
function extractArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

// ============================================
// PRODUCT SERVICE
// ============================================

export const productService = {
  /**
   * Get all products with optional filters
   * GET /products
   */
  getProducts: async (filter?: ProductFilter): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filter?.type && filter.type !== "all") params.append("type", filter.type);
    if (filter?.status && filter.status !== "all") params.append("status", filter.status);
    if (filter?.search) params.append("search", filter.search);

    const response = await apiClient.get<Product[]>(`/products?${params.toString()}`);
    return extractArray<Product>(response.data);
  },

  /**
   * Get a single product by ID
   * GET /products/{id}
   */
  getProductById: async (id: string): Promise<Product | null> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data || null;
  },

  /**
   * Get products by type (uses /products/by-type endpoint)
   * GET /products/by-type?type={type}
   */
  getProductsByType: async (type: ProductType): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/by-type?type=${type}`);
    return extractArray<Product>(response.data);
  },

  /**
   * Search products
   * GET /products/search?q={query}
   */
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
    return extractArray<Product>(response.data);
  },

  /**
   * Get product summary stats
   * GET /products/summary
   */
  getProductSummary: async (): Promise<{ total: number; byType: Record<string, number> }> => {
    const response = await apiClient.get<{ total: number; byType: Record<string, number> }>("/products/summary");
    return response.data || { total: 0, byType: {} };
  },

  /**
   * Get active products (for dropdowns, etc.)
   */
  getActiveProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/products?status=active");
    return extractArray<Product>(response.data);
  },

  /**
   * Create a new product
   * POST /products
   */
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>("/products", data);
    if (!response.data) throw new Error("Failed to create product");
    return response.data;
  },

  /**
   * Update a product
   * PUT /products/{id}
   */
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    if (!response.data) throw new Error("Failed to update product");
    return response.data;
  },

  /**
   * Delete a product
   * DELETE /products/{id}
   */
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Deactivate a product
   * POST /products/{id}/deactivate
   */
  deactivateProduct: async (id: string): Promise<void> => {
    await apiClient.post(`/products/${id}/deactivate`);
  },

  /**
   * Activate a product
   * POST /products/{id}/activate
   */
  activateProduct: async (id: string): Promise<void> => {
    await apiClient.post(`/products/${id}/activate`);
  },

  /**
   * Import products from CSV/Excel
   * POST /products/import (multipart/form-data)
   */
  importProducts: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<{ imported: number; errors: string[] }>("/products/import", formData);
    return response.data || { imported: 0, errors: [] };
  },

  /**
   * Download import template
   * GET /products/import/template
   */
  getImportTemplate: (): string => {
    return "/api/v1/products/import/template";
  },

  /**
   * Export products
   * GET /products/export
   */
  exportProducts: (filter?: ProductFilter): string => {
    const params = new URLSearchParams();
    if (filter?.type && filter.type !== "all") params.append("type", filter.type);
    if (filter?.status && filter.status !== "all") params.append("status", filter.status);
    return `/api/v1/products/export?${params.toString()}`;
  },
};

// ============================================
// BOM SERVICE
// ============================================

export const bomService = {
  /**
   * Get all BoMs with optional filters
   * GET /boms
   */
  getBoMs: async (filter?: BoMFilter): Promise<BoM[]> => {
    const params = new URLSearchParams();
    if (filter?.productId) params.append("product_id", filter.productId);
    if (filter?.status && filter.status !== "all") params.append("status", filter.status);
    if (filter?.search) params.append("search", filter.search);

    const response = await apiClient.get<BoM[]>(`/boms?${params.toString()}`);
    return extractArray<BoM>(response.data);
  },

  /**
   * Get BoM for a specific product
   * GET /products/{productId}/bom
   */
  getBoMByProduct: async (productId: string): Promise<BoM | null> => {
    const response = await apiClient.get<BoM>(`/products/${productId}/bom`);
    return response.data || null;
  },

  /**
   * Get all BoMs for a product
   * GET /products/{productId}/bom (returns full BoM object)
   */
  getBoMsByProduct: async (productId: string): Promise<BoM[]> => {
    const response = await apiClient.get<BoM>(`/products/${productId}/bom`);
    if (response.data) return [response.data];
    return [];
  },

  /**
   * Create a BoM for a product
   * POST /products/{productId}/bom  (or via POST /boms with product_id)
   */
  createBoM: async (productId: string, data: CreateBoMRequest): Promise<BoM> => {
    const response = await apiClient.post<BoM>(`/products/${productId}/bom`, data);
    if (!response.data) throw new Error("Failed to create BoM");
    return response.data;
  },

  /**
   * Update BoM (via product path)
   */
  updateBoM: async (_id: string, data: UpdateBoMRequest): Promise<BoM> => {
    // Use productId if available — for direct update, POST to boms/{id}
    const response = await apiClient.put<BoM>(`/boms/${_id}`, data);
    if (!response.data) throw new Error("Failed to update BoM");
    return response.data;
  },

  /**
   * Update BoM status (activate/deactivate/etc)
   * PUT /products/{productId}/bom/status
   */
  updateBoMStatus: async (productId: string, data: UpdateBoMStatusRequest): Promise<BoM> => {
    const response = await apiClient.put<BoM>(`/products/${productId}/bom/status`, data);
    if (!response.data) throw new Error("Failed to update BoM status");
    return response.data;
  },

  /**
   * Delete a BoM
   * DELETE /boms/{id}
   */
  deleteBoM: async (id: string): Promise<void> => {
    await apiClient.delete(`/boms/${id}`);
  },

  /**
   * Get BoM materials (for Planning MR calculation)
   * GET /products/{productId}/bom/materials
   */
  getBoMForProduct: async (productId: string): Promise<import("@/types/masterData").BoMItem[]> => {
    const response = await apiClient.get<import("@/types/masterData").BoMItem[]>(
      `/products/${productId}/bom/materials`
    );
    return extractArray<import("@/types/masterData").BoMItem>(response.data);
  },

  /**
   * Add item to BoM
   * POST /products/{productId}/bom/items
   */
  addBoMItem: async (productId: string, data: AddBoMItemRequest): Promise<import("@/types/masterData").BoMItem> => {
    const response = await apiClient.post<import("@/types/masterData").BoMItem>(
      `/products/${productId}/bom/items`,
      data
    );
    if (!response.data) throw new Error("Failed to add BoM item");
    return response.data;
  },

  /**
   * Update BoM item
   * PUT /products/{productId}/bom/items/{itemId}
   */
  updateBoMItem: async (
    productId: string,
    itemId: string,
    data: UpdateBoMItemRequest
  ): Promise<import("@/types/masterData").BoMItem> => {
    const response = await apiClient.put<import("@/types/masterData").BoMItem>(
      `/products/${productId}/bom/items/${itemId}`,
      data
    );
    if (!response.data) throw new Error("Failed to update BoM item");
    return response.data;
  },

  /**
   * Remove item from BoM
   * DELETE /products/{productId}/bom/items/{itemId}
   */
  removeBoMItem: async (productId: string, itemId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/bom/items/${itemId}`);
  },

  /**
   * Import BoMs from CSV/Excel
   * POST /boms/import
   */
  importBoMs: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<{ imported: number; errors: string[] }>("/boms/import", formData);
    return response.data || { imported: 0, errors: [] };
  },

  /**
   * Export BoMs
   * GET /boms/export
   */
  exportBoMs: (): string => {
    return "/api/v1/boms/export";
  },
};

// Export combined master data service
export const masterDataService = {
  product: productService,
  bom: bomService,
};

// Export types
export type { Product, ProductType, ProductFilter, BoM, BoMFilter };