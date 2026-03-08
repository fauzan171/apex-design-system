/**
 * Master Data Service
 * Handles all Product and Bill of Materials (BoM) operations
 * Automatically switches between mock data and real API based on environment
 */

import type {
  Product,
  ProductType,
  ProductStatusType,
  ProductFilter,
  CreateProductRequest,
  UpdateProductRequest,
  BoM,
  BoMItem,
  BoMStatusType,
  BoMFilter,
  CreateBoMRequest,
  UpdateBoMRequest,
  UpdateBoMStatusRequest,
  AddBoMItemRequest,
  UpdateBoMItemRequest,
} from "@/types/masterData";
import { BoMStatus } from "@/types/masterData";
import { apiClient } from "@/lib/apiClient";

// Check if using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Import mock services only when needed
let mockProductService: typeof import("@/data/mockMasterData").productService | null = null;
let mockBomService: typeof import("@/data/mockMasterData").bomService | null = null;

const getMockServices = async () => {
  if (!mockProductService || !mockBomService) {
    const module = await import("@/data/mockMasterData");
    mockProductService = module.productService;
    mockBomService = module.bomService;
  }
  return { productService: mockProductService, bomService: mockBomService };
};

// ============================================
// PRODUCT SERVICE
// ============================================

export const productService = {
  /**
   * Get all products with optional filters
   */
  getProducts: async (filter?: ProductFilter): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.getProducts(filter);
    }

    const params = new URLSearchParams();
    if (filter?.type && filter.type !== "all") params.append("type", filter.type);
    if (filter?.status && filter.status !== "all") params.append("status", filter.status);
    if (filter?.search) params.append("search", filter.search);
    if (filter?.isPurchasable !== undefined) params.append("is_purchasable", String(filter.isPurchasable));
    if (filter?.isSellable !== undefined) params.append("is_sellable", String(filter.isSellable));
    if (filter?.hasBoM !== undefined) params.append("has_bom", String(filter.hasBoM));

    const response = await apiClient.get<Product[]>(`/products?${params.toString()}`);
    return response.data || [];
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: string): Promise<Product | null> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      const product = await productService.getProductById(id);
      return product || null;
    }

    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data || null;
  },

  /**
   * Get a single product by code
   */
  getProductByCode: async (code: string): Promise<Product | null> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      const product = await productService.getProductByCode(code);
      return product || null;
    }

    const response = await apiClient.get<Product>(`/products/code/${code}`);
    return response.data || null;
  },

  /**
   * Create a new product
   */
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.createProduct(data);
    }

    const response = await apiClient.post<Product>("/products", data);
    if (!response.data) throw new Error("Failed to create product");
    return response.data;
  },

  /**
   * Update a product
   */
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.updateProduct(id, data);
    }

    const response = await apiClient.put<Product>(`/products/${id}`, data);
    if (!response.data) throw new Error("Failed to update product");
    return response.data;
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.deleteProduct(id);
    }

    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Get low stock products
   */
  getLowStockProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.getLowStockProducts();
    }

    const response = await apiClient.get<Product[]>("/products/low-stock");
    return response.data || [];
  },

  /**
   * Adjust product stock
   */
  adjustStock: async (id: string, quantity: number, reason: string): Promise<Product> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.adjustStock(id, quantity, reason);
    }

    const response = await apiClient.post<Product>(`/products/${id}/adjust-stock`, {
      quantity,
      reason,
    });
    if (!response.data) throw new Error("Failed to adjust stock");
    return response.data;
  },

  /**
   * Get product statistics
   */
  getProductStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    discontinued: number;
    byType: Record<ProductType, number>;
    lowStock: number;
    withBoM: number;
  }> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      const stats = await productService.getProductStats();
      return {
        ...stats,
        byType: stats.byCategory as unknown as Record<ProductType, number>,
      };
    }

    const response = await apiClient.get<{
      total: number;
      active: number;
      inactive: number;
      discontinued: number;
      byType: Record<ProductType, number>;
      lowStock: number;
      withBoM: number;
    }>("/products/stats");
    return response.data || {
      total: 0,
      active: 0,
      inactive: 0,
      discontinued: 0,
      byType: {} as Record<ProductType, number>,
      lowStock: 0,
      withBoM: 0,
    };
  },

  /**
   * Get products by type
   */
  getProductsByType: async (type: ProductType): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.getProducts({ type });
    }

    const response = await apiClient.get<Product[]>(`/products?type=${type}`);
    return response.data || [];
  },

  /**
   * Get active products (for dropdowns, etc.)
   */
  getActiveProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.getProducts({ status: "active" });
    }

    const response = await apiClient.get<Product[]>("/products?status=active");
    return response.data || [];
  },

  /**
   * Search products
   */
  searchProducts: async (query: string): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      const { productService } = await getMockServices();
      return productService.getProducts({ search: query });
    }

    const response = await apiClient.get<Product[]>(`/products?search=${encodeURIComponent(query)}`);
    return response.data || [];
  },
};

// ============================================
// BOM SERVICE
// ============================================

export const bomService = {
  /**
   * Get all BoMs with optional filters
   */
  getBoMs: async (filter?: BoMFilter): Promise<BoM[]> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.getBoMs(filter);
    }

    const params = new URLSearchParams();
    if (filter?.productId) params.append("product_id", filter.productId);
    if (filter?.status && filter.status !== "all") params.append("status", filter.status);
    if (filter?.search) params.append("search", filter.search);

    const response = await apiClient.get<BoM[]>(`/boms?${params.toString()}`);
    return response.data || [];
  },

  /**
   * Get a single BoM by ID
   */
  getBoMById: async (id: string): Promise<BoM | null> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      const bom = await bomService.getBoMById(id);
      return bom || null;
    }

    const response = await apiClient.get<BoM>(`/boms/${id}`);
    return response.data || null;
  },

  /**
   * Get BoMs by product ID
   */
  getBoMsByProduct: async (productId: string): Promise<BoM[]> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.getBoMsByProduct(productId);
    }

    const response = await apiClient.get<BoM[]>(`/products/${productId}/boms`);
    return response.data || [];
  },

  /**
   * Get default BoM for a product
   */
  getDefaultBoM: async (productId: string): Promise<BoM | null> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      const bom = await bomService.getDefaultBoM(productId);
      return bom || null;
    }

    const response = await apiClient.get<BoM>(`/products/${productId}/boms/default`);
    return response.data || null;
  },

  /**
   * Create a new BoM
   */
  createBoM: async (data: CreateBoMRequest): Promise<BoM> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.createBoM(data);
    }

    const response = await apiClient.post<BoM>("/boms", data);
    if (!response.data) throw new Error("Failed to create BoM");
    return response.data;
  },

  /**
   * Update a BoM
   */
  updateBoM: async (id: string, data: UpdateBoMRequest): Promise<BoM> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.updateBoM(id, data);
    }

    const response = await apiClient.put<BoM>(`/boms/${id}`, data);
    if (!response.data) throw new Error("Failed to update BoM");
    return response.data;
  },

  /**
   * Delete a BoM
   */
  deleteBoM: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.deleteBoM(id);
    }

    await apiClient.delete(`/boms/${id}`);
  },

  /**
   * Update BoM status
   */
  updateBoMStatus: async (id: string, data: UpdateBoMStatusRequest): Promise<BoM> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      if (data.status === "active") {
        return bomService.activateBoM(id);
      } else if (data.status === "obsolete") {
        return bomService.obsoleteBoM(id);
      }
      throw new Error("Status not supported in mock");
    }

    const response = await apiClient.patch<BoM>(`/boms/${id}/status`, data);
    if (!response.data) throw new Error("Failed to update BoM status");
    return response.data;
  },

  /**
   * Activate BoM
   */
  activateBoM: async (id: string): Promise<BoM> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.activateBoM(id);
    }

    const response = await apiClient.post<BoM>(`/boms/${id}/activate`);
    if (!response.data) throw new Error("Failed to activate BoM");
    return response.data;
  },

  /**
   * Obsolete BoM
   */
  obsoleteBoM: async (id: string): Promise<BoM> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.obsoleteBoM(id);
    }

    const response = await apiClient.post<BoM>(`/boms/${id}/obsolete`);
    if (!response.data) throw new Error("Failed to obsolete BoM");
    return response.data;
  },

  /**
   * Add item to BoM
   */
  addBoMItem: async (bomId: string, data: AddBoMItemRequest): Promise<BoMItem> => {
    if (USE_MOCK_DATA) {
      throw new Error("Add BoM item not implemented in mock");
    }

    const response = await apiClient.post<BoMItem>(`/boms/${bomId}/items`, data);
    if (!response.data) throw new Error("Failed to add BoM item");
    return response.data;
  },

  /**
   * Update BoM item
   */
  updateBoMItem: async (bomId: string, itemId: string, data: UpdateBoMItemRequest): Promise<BoMItem> => {
    if (USE_MOCK_DATA) {
      throw new Error("Update BoM item not implemented in mock");
    }

    const response = await apiClient.put<BoMItem>(`/boms/${bomId}/items/${itemId}`, data);
    if (!response.data) throw new Error("Failed to update BoM item");
    return response.data;
  },

  /**
   * Remove item from BoM
   */
  removeBoMItem: async (bomId: string, itemId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      throw new Error("Remove BoM item not implemented in mock");
    }

    await apiClient.delete(`/boms/${bomId}/items/${itemId}`);
  },

  /**
   * Calculate production cost
   */
  calculateProductionCost: async (
    productId: string,
    quantity: number,
    bomVersion?: string
  ): Promise<{
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    totalCost: number;
    unitCost: number;
    components: { productId: string; quantity: number; cost: number }[];
  }> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      return bomService.calculateProductionCost(productId, quantity, bomVersion);
    }

    const params = new URLSearchParams();
    params.append("quantity", String(quantity));
    if (bomVersion) params.append("version", bomVersion);

    const response = await apiClient.get<{
      materialCost: number;
      laborCost: number;
      overheadCost: number;
      totalCost: number;
      unitCost: number;
      components: { productId: string; quantity: number; cost: number }[];
    }>(`/products/${productId}/calculate-cost?${params.toString()}`);
    return response.data || {
      materialCost: 0,
      laborCost: 0,
      overheadCost: 0,
      totalCost: 0,
      unitCost: 0,
      components: [],
    };
  },

  /**
   * Get BoM statistics
   */
  getBoMStats: async (): Promise<{
    total: number;
    active: number;
    draft: number;
    inactive: number;
    obsolete: number;
  }> => {
    if (USE_MOCK_DATA) {
      const { bomService } = await getMockServices();
      const boms = await bomService.getBoMs();
      return {
        total: boms.length,
        active: boms.filter((b) => b.status === "active").length,
        draft: boms.filter((b) => b.status === "draft").length,
        inactive: boms.filter((b) => b.status === "inactive").length,
        obsolete: boms.filter((b) => b.status === "obsolete").length,
      };
    }

    const response = await apiClient.get<{
      total: number;
      active: number;
      draft: number;
      inactive: number;
      obsolete: number;
    }>("/boms/stats");
    return response.data || { total: 0, active: 0, draft: 0, inactive: 0, obsolete: 0 };
  },
};

// Export combined master data service
export const masterDataService = {
  product: productService,
  bom: bomService,
};

// Export types
export type { Product, ProductType, ProductFilter, BoM, BoMItem, BoMFilter };