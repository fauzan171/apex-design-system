/**
 * Delivery Orders Hooks
 * Custom hooks for Delivery Order management (outbound)
 */

import { useQuery, clearQueryCache } from "./useQuery";
import { useMutation } from "./useMutation";
import { deliveryService } from "@/services/deliveryService";
import type {
  DeliveryOrder,
  DOItem,
  DOFilters,
  DOFormData,
  DOStatusType,
  DOItemFormData,
} from "@/types/delivery";

// ============================================
// Query Keys
// ============================================

const queryKeys = {
  all: ["delivery-orders"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters?: DOFilters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  stats: () => [...queryKeys.all, "stats"] as const,
};

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch list of delivery orders with optional filters
 *
 * @example
 * ```tsx
 * const { data: dos, isLoading } = useDeliveryOrders({
 *   filters: { status: "in_transit" },
 * });
 * ```
 */
export function useDeliveryOrders(options?: {
  filters?: DOFilters;
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}) {
  const { filters, enabled = true, staleTime = 30000, refetchInterval } = options || {};

  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => deliveryService.getDOs(filters),
    enabled,
    staleTime,
    refetchInterval,
  }) as { data: DeliveryOrder[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch a single delivery order by ID
 *
 * @example
 * ```tsx
 * const { data: do, isLoading } = useDeliveryOrder(doId);
 * ```
 */
export function useDeliveryOrder(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => deliveryService.getDOById(id),
    enabled: enabled && !!id,
  }) as { data: DeliveryOrder | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch delivery order status summary
 *
 * @example
 * ```tsx
 * const { data: stats } = useDeliveryOrderStats();
 * ```
 */
export function useDeliveryOrderStats() {
  return useQuery({
    queryKey: queryKeys.stats(),
    queryFn: () => deliveryService.getDOStatusSummary(),
    staleTime: 60000,
  }) as { data: { status: Record<DOStatusType, number> } | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch delivery metrics
 */
export function useDeliveryMetrics() {
  return useQuery({
    queryKey: [...queryKeys.all, "metrics"],
    queryFn: () => deliveryService.getDeliveryMetrics(),
    staleTime: 60000,
  }) as { data: { total: number; inTransit: number; delivered: number; pending: number; onTimeRate: number; avgLeadTime: number } | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook to create a new delivery order
 *
 * @example
 * ```tsx
 * const createDO = useCreateDO();
 *
 * createDO.mutate(formData, {
 *   onSuccess: (do) => {
 *     toast.success(`DO ${do.doNumber} created`);
 *     navigate(`/delivery/${do.id}`);
 *   },
 * });
 * ```
 */
export function useCreateDO(options?: {
  onSuccess?: (data: DeliveryOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DeliveryOrder, DOFormData>({
    mutationFn: (data: DOFormData) => deliveryService.createDO(data),
    onSuccess: (data: DeliveryOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to update a delivery order
 */
export function useUpdateDO(options?: {
  onSuccess?: (data: DeliveryOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DeliveryOrder, { id: string; data: Partial<DOFormData> }>({
    mutationFn: ({ id, data }: { id: string; data: Partial<DOFormData> }) =>
      deliveryService.updateDO(id, data),
    onSuccess: (data: DeliveryOrder, variables: { id: string; data: Partial<DOFormData> }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to release a delivery order
 */
export function useReleaseDO(options?: {
  onSuccess?: (data: DeliveryOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DeliveryOrder, string>({
    mutationFn: (id: string) => deliveryService.releaseDO(id),
    onSuccess: (data: DeliveryOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.stats()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to mark delivery order as in transit
 */
export function useMarkInTransit(options?: {
  onSuccess?: (data: DeliveryOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DeliveryOrder, string>({
    mutationFn: (id: string) => deliveryService.startTransit(id),
    onSuccess: (data: DeliveryOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to mark delivery order as delivered
 */
export function useMarkDelivered(options?: {
  onSuccess?: (data: DeliveryOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DeliveryOrder, string>({
    mutationFn: (id: string) => deliveryService.markDelivered(id),
    onSuccess: (data: DeliveryOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.stats()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to upload BAST (delivery confirmation document)
 *
 * @example
 * ```tsx
 * const uploadBAST = useUploadBAST();
 *
 * const handleFileUpload = (file: File) => {
 *   uploadBAST.mutate({ doId, file });
 * };
 * ```
 */
export function useUploadBAST(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { doId: string; file: File }>({
    mutationFn: ({ doId, file }: { doId: string; file: File }) =>
      deliveryService.uploadBAST(doId, file).then(() => {}),
    onSuccess: (_, variables: { doId: string; file: File }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.doId)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to cancel a delivery order
 */
export function useCancelDO(options?: {
  onSuccess?: (data: DeliveryOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DeliveryOrder, { id: string; reason?: string }>({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      deliveryService.cancelDO(id, reason),
    onSuccess: (data: DeliveryOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.stats()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to delete a delivery order
 */
export function useDeleteDO(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, string>({
    mutationFn: (id: string) => deliveryService.deleteDO(id),
    onSuccess: (_, id: string) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to add an item to a delivery order
 */
export function useAddDOItem(options?: {
  onSuccess?: (data: DOItem) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<DOItem, { doId: string; data: DOItemFormData }>({
    mutationFn: ({ doId, data }: { doId: string; data: DOItemFormData }) =>
      deliveryService.addDOItem(doId, data),
    onSuccess: (data: DOItem) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.doId)));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to remove an item from a delivery order
 */
export function useRemoveDOItem(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { doId: string; itemId: string }>({
    mutationFn: ({ doId, itemId }: { doId: string; itemId: string }) =>
      deliveryService.removeDOItem(doId, itemId),
    onSuccess: (_, variables: { doId: string; itemId: string }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.doId)));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to get delivery orders pending BAST
 */
export function useDOPendingBAST() {
  return useQuery({
    queryKey: [...queryKeys.all, "pending-bast"],
    queryFn: () => deliveryService.getDOsPendingBAST(),
    staleTime: 30000,
  }) as { data: DeliveryOrder[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to get finished goods stock for delivery
 */
export function useFinishedGoodStock() {
  return useQuery({
    queryKey: [...queryKeys.all, "finished-goods"],
    queryFn: () => deliveryService.getFinishedGoodStock(),
    staleTime: 30000,
  }) as { data: { productId: string; productCode: string; productName: string; availableQty: number; unit: string }[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to generate a new DO number
 */
export function useGenerateDONumber() {
  return useMutation<string, void>({
    mutationFn: () => deliveryService.generateDONumber(),
  });
}