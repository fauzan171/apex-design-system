/**
 * Master Data Hooks
 * Custom hooks for Product and BOM management
 */

import { useQuery, clearQueryCache } from "./useQuery";
import { useMutation } from "./useMutation";
import { masterDataService } from "@/services/masterDataService";
import type {
  Product,
  ProductFilter,
  CreateProductRequest,
  UpdateProductRequest,
  BoM,
  BoMItem,
  CreateBoMRequest,
  UpdateBoMRequest,
  AddBoMItemRequest,
  ProductType,
  ProductStatusType,
} from "@/types/masterData";

// ============================================
// Query Keys
// ============================================

const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: ProductFilter) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    byType: (type: string) => [...queryKeys.products.all, "type", type] as const,
  },
  bom: {
    all: ["bom"] as const,
    byProduct: (productId: string) => [...queryKeys.bom.all, "product", productId] as const,
    detail: (id: string) => [...queryKeys.bom.all, "detail", id] as const,
  },
};

// ============================================
// Product Hooks
// ============================================

/**
 * Hook to fetch list of products with optional filters
 *
 * @example
 * ```tsx
 * const { data: products, isLoading } = useProducts({
 *   filters: { type: "fg" },
 * });
 * ```
 */
export function useProducts(options?: {
  filters?: ProductFilter;
  enabled?: boolean;
  staleTime?: number;
}) {
  const { filters, enabled = true, staleTime = 60000 } = options || {};

  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => masterDataService.product.getProducts(filters),
    enabled,
    staleTime,
  }) as { data: Product[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch a single product by ID
 *
 * @example
 * ```tsx
 * const { data: product } = useProduct(productId);
 * ```
 */
export function useProduct(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => masterDataService.product.getProductById(id),
    enabled: enabled && !!id,
  }) as { data: Product | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch products by type
 *
 * @example
 * ```tsx
 * const { data: finishedGoods } = useProductsByType("fg");
 * const { data: rawMaterials } = useProductsByType("raw");
 * ```
 */
export function useProductsByType(type: ProductType | string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.products.byType(type),
    queryFn: () => masterDataService.product.getProductsByType(type as ProductType),
    enabled: enabled && !!type,
    staleTime: 60000,
  }) as { data: Product[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to get product types for dropdown
 *
 * @example
 * ```tsx
 * const { data: types } = useProductTypes();
 * // types: [{ value: "fg", label: "Finished Good" }, ...]
 * ```
 */
export function useProductTypes() {
  return useQuery({
    queryKey: ["product-types"],
    queryFn: () => Promise.resolve([
      { value: "fg", label: "Finished Good" },
      { value: "semi", label: "Semi-finished" },
      { value: "raw", label: "Raw Material" },
      { value: "packaging", label: "Packaging" },
      { value: "sparepart", label: "Spare Part" },
      { value: "support", label: "Support Material" },
    ]),
    staleTime: Infinity,
    initialData: [
      { value: "fg", label: "Finished Good" },
      { value: "semi", label: "Semi-finished" },
      { value: "raw", label: "Raw Material" },
      { value: "packaging", label: "Packaging" },
      { value: "sparepart", label: "Spare Part" },
      { value: "support", label: "Support Material" },
    ],
  }) as { data: { value: string; label: string }[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to get units of measure for dropdown
 *
 * @example
 * ```tsx
 * const { data: units } = useUnits();
 * // units: [{ value: "kg", label: "Kilogram" }, ...]
 * ```
 */
export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: () => Promise.resolve([
      { value: "unit", label: "Unit" },
      { value: "kg", label: "Kilogram" },
      { value: "m", label: "Meter" },
      { value: "l", label: "Liter" },
      { value: "pcs", label: "Pieces" },
      { value: "set", label: "Set" },
    ]),
    staleTime: Infinity,
    initialData: [
      { value: "unit", label: "Unit" },
      { value: "kg", label: "Kilogram" },
      { value: "m", label: "Meter" },
      { value: "l", label: "Liter" },
      { value: "pcs", label: "Pieces" },
      { value: "set", label: "Set" },
    ],
  }) as { data: { value: string; label: string }[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// Product Mutations
// ============================================

/**
 * Hook to create a new product
 *
 * @example
 * ```tsx
 * const createProduct = useCreateProduct();
 *
 * createProduct.mutate(productData, {
 *   onSuccess: (product) => {
 *     toast.success(`Product ${product.code} created`);
 *   },
 * });
 * ```
 */
export function useCreateProduct(options?: {
  onSuccess?: (data: Product) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<Product, CreateProductRequest>({
    mutationFn: (data: CreateProductRequest) => masterDataService.product.createProduct(data),
    onSuccess: (data: Product) => {
      clearQueryCache(JSON.stringify(queryKeys.products.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct(options?: {
  onSuccess?: (data: Product) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<Product, { id: string; data: UpdateProductRequest }>({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      masterDataService.product.updateProduct(id, data),
    onSuccess: (data: Product, variables: { id: string; data: UpdateProductRequest }) => {
      clearQueryCache(JSON.stringify(queryKeys.products.detail(variables.id)));
      clearQueryCache(JSON.stringify(queryKeys.products.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, string>({
    mutationFn: (id: string) => masterDataService.product.deleteProduct(id),
    onSuccess: (_, id: string) => {
      clearQueryCache(JSON.stringify(queryKeys.products.detail(id)));
      clearQueryCache(JSON.stringify(queryKeys.products.lists()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to search products by code or name
 */
export function useSearchProducts(searchTerm: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: [...queryKeys.products.all, "search", searchTerm],
    queryFn: () => masterDataService.product.searchProducts(searchTerm),
    enabled: enabled && searchTerm.length >= 2,
    staleTime: 30000,
  }) as { data: Product[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to get product statistics
 */
export function useProductStats() {
  return useQuery({
    queryKey: [...queryKeys.products.all, "stats"],
    queryFn: () => masterDataService.product.getProductStats(),
    staleTime: 60000,
  }) as { data: { total: number; byType: Record<ProductType, number>; byStatus: Record<ProductStatusType, number>; withBoM: number; withoutBoM: number } | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// BOM Query Hooks
// ============================================

/**
 * Hook to fetch BOM for a product
 *
 * @example
 * ```tsx
 * const { data: bom, isLoading } = useBoM(productId);
 * ```
 */
export function useBoM(productId: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.bom.byProduct(productId),
    queryFn: () => masterDataService.bom.getDefaultBoM(productId),
    enabled: enabled && !!productId,
  }) as { data: BoM | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch a single BOM by ID
 */
export function useBoMById(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.bom.detail(id),
    queryFn: () => masterDataService.bom.getBoMById(id),
    enabled: enabled && !!id,
  }) as { data: BoM | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch all BOMs for a product
 */
export function useBoMsByProduct(productId: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: [...queryKeys.bom.all, "list", productId],
    queryFn: () => masterDataService.bom.getBoMsByProduct(productId),
    enabled: enabled && !!productId,
  }) as { data: BoM[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// BOM Mutations
// ============================================

/**
 * Hook to create a BOM for a product
 *
 * @example
 * ```tsx
 * const createBOM = useCreateBoM();
 *
 * createBOM.mutate({ productId, items: [...] });
 * ```
 */
export function useCreateBoM(options?: {
  onSuccess?: (data: BoM) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<BoM, CreateBoMRequest>({
    mutationFn: (data: CreateBoMRequest) => masterDataService.bom.createBoM(data),
    onSuccess: (data: BoM) => {
      clearQueryCache(JSON.stringify(queryKeys.bom.all));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to update a BOM
 */
export function useUpdateBoM(options?: {
  onSuccess?: (data: BoM) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<BoM, { id: string; data: UpdateBoMRequest }>({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoMRequest }) =>
      masterDataService.bom.updateBoM(id, data),
    onSuccess: (data: BoM, variables: { id: string; data: UpdateBoMRequest }) => {
      clearQueryCache(JSON.stringify(queryKeys.bom.detail(variables.id)));
      clearQueryCache(JSON.stringify(queryKeys.bom.byProduct(data.productId)));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to delete a BOM
 */
export function useDeleteBoM(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, string>({
    mutationFn: (id: string) => masterDataService.bom.deleteBoM(id),
    onSuccess: (_, id: string) => {
      clearQueryCache(JSON.stringify(queryKeys.bom.detail(id)));
      clearQueryCache(JSON.stringify(queryKeys.bom.all));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to add item to BOM
 */
export function useAddBoMItem(options?: {
  onSuccess?: (data: BoMItem) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<BoMItem, { bomId: string; data: AddBoMItemRequest }>({
    mutationFn: ({ bomId, data }: { bomId: string; data: AddBoMItemRequest }) =>
      masterDataService.bom.addBoMItem(bomId, data),
    onSuccess: (data: BoMItem, variables: { bomId: string; data: AddBoMItemRequest }) => {
      clearQueryCache(JSON.stringify(queryKeys.bom.detail(variables.bomId)));
      clearQueryCache(JSON.stringify(queryKeys.bom.all));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to remove item from BOM
 */
export function useRemoveBoMItem(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { bomId: string; itemId: string }>({
    mutationFn: ({ bomId, itemId }: { bomId: string; itemId: string }) =>
      masterDataService.bom.removeBoMItem(bomId, itemId),
    onSuccess: (_, variables: { bomId: string; itemId: string }) => {
      clearQueryCache(JSON.stringify(queryKeys.bom.detail(variables.bomId)));
      clearQueryCache(JSON.stringify(queryKeys.bom.all));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to activate BOM
 */
export function useActivateBoM(options?: {
  onSuccess?: (data: BoM) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<BoM, string>({
    mutationFn: (id: string) => masterDataService.bom.activateBoM(id),
    onSuccess: (data: BoM) => {
      clearQueryCache(JSON.stringify(queryKeys.bom.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.bom.all));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to get BOM statistics
 */
export function useBoMStats() {
  return useQuery({
    queryKey: [...queryKeys.bom.all, "stats"],
    queryFn: () => masterDataService.bom.getBoMStats(),
    staleTime: 60000,
  }) as { data: { total: number; active: number; draft: number; inactive: number; obsolete: number } | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// Combined/Utility Hooks
// ============================================

/**
 * Hook to get finished goods products for dropdown
 */
export function useFinishedGoods() {
  return useProductsByType("fg");
}

/**
 * Hook to get raw materials for dropdown
 */
export function useRawMaterials() {
  return useProductsByType("raw");
}

/**
 * Hook to get active products
 */
export function useActiveProducts() {
  return useQuery({
    queryKey: [...queryKeys.products.all, "active"],
    queryFn: () => masterDataService.product.getActiveProducts(),
    staleTime: 60000,
  }) as { data: Product[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}