/**
 * Warehouse Stock Hooks
 * Custom hooks for Warehouse management (Stock, GR, GI)
 * Note: Delivery Order hooks are in useDeliveryOrders.ts
 */

import { useQuery, clearQueryCache } from "./useQuery";
import { useMutation } from "./useMutation";
import { warehouseService } from "@/services/warehouseService";
import type {
  Stock,
  StockAlert,
  StockFilters,
  GoodsReceipt,
  GRFilters,
  GRFormData,
  GoodsIssue,
  GIFilters,
  GIFormData,
  Inspection,
} from "@/types/warehouse";

// ============================================
// Query Keys
// ============================================

const queryKeys = {
  stock: {
    all: ["stock"] as const,
    list: (filters?: StockFilters) => [...queryKeys.stock.all, "list", filters] as const,
    alerts: () => [...queryKeys.stock.all, "alerts"] as const,
    stats: () => [...queryKeys.stock.all, "stats"] as const,
  },
  gr: {
    all: ["goods-receipts"] as const,
    list: (filters?: GRFilters) => [...queryKeys.gr.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.gr.all, "detail", id] as const,
  },
  gi: {
    all: ["goods-issues"] as const,
    list: (filters?: GIFilters) => [...queryKeys.gi.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.gi.all, "detail", id] as const,
  },
};

// ============================================
// Stock Hooks
// ============================================

/**
 * Hook to fetch stock list
 *
 * @example
 * ```tsx
 * const { data: stock, isLoading } = useWarehouseStock({
 *   filters: { category: "Raw Material", lowStock: true },
 * });
 * ```
 */
export function useWarehouseStock(options?: {
  filters?: StockFilters;
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}) {
  const { filters, enabled = true, staleTime = 30000, refetchInterval } = options || {};

  return useQuery({
    queryKey: queryKeys.stock.list(filters),
    queryFn: () => warehouseService.getStocks(filters),
    enabled,
    staleTime,
    refetchInterval,
  }) as { data: Stock[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch low stock alerts
 *
 * @example
 * ```tsx
 * const { data: alerts } = useLowStockAlerts();
 * ```
 */
export function useLowStockAlerts(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.stock.alerts(),
    queryFn: () => warehouseService.getLowStockAlerts(),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
  }) as { data: StockAlert[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// Goods Receipt Hooks
// ============================================

/**
 * Hook to fetch goods receipts list
 */
export function useGoodsReceipts(options?: { filters?: GRFilters; enabled?: boolean }) {
  const { filters, enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.gr.list(filters),
    queryFn: () => warehouseService.getGoodsReceipts(filters),
    enabled,
    staleTime: 30000,
  }) as { data: GoodsReceipt[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch a single goods receipt
 */
export function useGoodsReceipt(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.gr.detail(id),
    queryFn: () => warehouseService.getGoodsReceiptById(id),
    enabled: enabled && !!id,
  }) as { data: GoodsReceipt | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to create a goods receipt
 */
export function useCreateGoodsReceipt(options?: {
  onSuccess?: (data: GoodsReceipt) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsReceipt, GRFormData>({
    mutationFn: (data: GRFormData) => warehouseService.createGoodsReceipt(data),
    onSuccess: (data: GoodsReceipt) => {
      clearQueryCache(JSON.stringify(queryKeys.gr.all));
      clearQueryCache(JSON.stringify(queryKeys.stock.all));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to submit a goods receipt for inspection
 */
export function useSubmitGoodsReceipt(options?: {
  onSuccess?: (data: GoodsReceipt) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsReceipt, string>({
    mutationFn: (id: string) => warehouseService.submitGoodsReceipt(id),
    onSuccess: (data: GoodsReceipt) => {
      clearQueryCache(JSON.stringify(queryKeys.gr.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gr.list()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to start inspection for a goods receipt
 */
export function useStartInspection(options?: {
  onSuccess?: (data: Inspection) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<Inspection, string>({
    mutationFn: (grId: string) => warehouseService.startInspection(grId),
    onSuccess: (data: Inspection) => {
      clearQueryCache(JSON.stringify(queryKeys.gr.detail(data.grId)));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to complete inspection for a goods receipt
 */
export function useCompleteInspection(options?: {
  onSuccess?: (data: GoodsReceipt) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsReceipt, { grId: string; result: "approved" | "rejected" }>({
    mutationFn: ({ grId, result }: { grId: string; result: "approved" | "rejected" }) =>
      warehouseService.completeInspection(grId, result),
    onSuccess: (data: GoodsReceipt) => {
      clearQueryCache(JSON.stringify(queryKeys.gr.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gr.list()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to complete goods receipt and generate BAST
 */
export function useCompleteGoodsReceipt(options?: {
  onSuccess?: (data: GoodsReceipt) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsReceipt, string>({
    mutationFn: (grId: string) => warehouseService.completeGR(grId),
    onSuccess: (data: GoodsReceipt) => {
      clearQueryCache(JSON.stringify(queryKeys.gr.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gr.list()));
      clearQueryCache(JSON.stringify(queryKeys.stock.all));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to cancel a goods receipt
 */
export function useCancelGoodsReceipt(options?: {
  onSuccess?: (data: GoodsReceipt) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsReceipt, { id: string; reason: string }>({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      warehouseService.cancelGR(id, { reason }),
    onSuccess: (data: GoodsReceipt) => {
      clearQueryCache(JSON.stringify(queryKeys.gr.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gr.list()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// ============================================
// Goods Issue Hooks
// ============================================

/**
 * Hook to fetch goods issues list
 */
export function useGoodsIssues(options?: { filters?: GIFilters; enabled?: boolean }) {
  const { filters, enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.gi.list(filters),
    queryFn: () => warehouseService.getGoodsIssues(filters),
    enabled,
    staleTime: 30000,
  }) as { data: GoodsIssue[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch a single goods issue
 */
export function useGoodsIssue(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.gi.detail(id),
    queryFn: () => warehouseService.getGoodsIssueById(id),
    enabled: enabled && !!id,
  }) as { data: GoodsIssue | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to create a goods issue
 */
export function useCreateGoodsIssue(options?: {
  onSuccess?: (data: GoodsIssue) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsIssue, GIFormData>({
    mutationFn: (data: GIFormData) => warehouseService.createGoodsIssue(data),
    onSuccess: (data: GoodsIssue) => {
      clearQueryCache(JSON.stringify(queryKeys.gi.all));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to submit a goods issue for approval
 */
export function useSubmitGoodsIssue(options?: {
  onSuccess?: (data: GoodsIssue) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsIssue, string>({
    mutationFn: (id: string) => warehouseService.submitGoodsIssue(id),
    onSuccess: (data: GoodsIssue) => {
      clearQueryCache(JSON.stringify(queryKeys.gi.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gi.list()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to approve a goods issue
 */
export function useApproveGoodsIssue(options?: {
  onSuccess?: (data: GoodsIssue) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsIssue, string>({
    mutationFn: (id: string) => warehouseService.approveGoodsIssue(id),
    onSuccess: (data: GoodsIssue) => {
      clearQueryCache(JSON.stringify(queryKeys.gi.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gi.list()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to reject a goods issue
 */
export function useRejectGoodsIssue(options?: {
  onSuccess?: (data: GoodsIssue) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsIssue, { id: string; reason?: string }>({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      warehouseService.rejectGoodsIssue(id, reason),
    onSuccess: (data: GoodsIssue) => {
      clearQueryCache(JSON.stringify(queryKeys.gi.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gi.list()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to issue goods (confirm issuance)
 */
export function useIssueGoods(options?: {
  onSuccess?: (data: GoodsIssue) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsIssue, string>({
    mutationFn: (id: string) => warehouseService.issueGoods(id),
    onSuccess: (data: GoodsIssue) => {
      clearQueryCache(JSON.stringify(queryKeys.gi.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gi.list()));
      clearQueryCache(JSON.stringify(queryKeys.stock.all));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to cancel a goods issue
 */
export function useCancelGoodsIssue(options?: {
  onSuccess?: (data: GoodsIssue) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<GoodsIssue, string>({
    mutationFn: (id: string) => warehouseService.cancelGoodsIssue(id),
    onSuccess: (data: GoodsIssue) => {
      clearQueryCache(JSON.stringify(queryKeys.gi.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.gi.list()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// ============================================
// Inspection Hooks
// ============================================

/**
 * Hook to fetch inspection details
 */
export function useInspection(grItemId: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: ["inspection", grItemId],
    queryFn: () => warehouseService.getInspectionById(grItemId),
    enabled: enabled && !!grItemId,
  }) as { data: Inspection | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// Stock Statistics Hook
// ============================================

/**
 * Hook to fetch warehouse statistics
 */
export function useWarehouseStats() {
  return useQuery({
    queryKey: queryKeys.stock.stats(),
    queryFn: () => warehouseService.getWarehouseStats(),
    staleTime: 60000,
  }) as { data: { totalItems: number; totalValue: number; lowStockCount: number; byCategory: { category: string; count: number; value: number }[] } | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}