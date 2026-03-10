/**
 * Production Orders (Work Orders) Hooks
 * Custom hooks for Work Order management
 */

import { useQuery, clearQueryCache } from "./useQuery";
import { useMutation } from "./useMutation";
import { productionService } from "@/services/productionService";
import type {
  WorkOrder,
  WOFilters,
  WOStatusType,
  WOFormData,
  ProgressUpdateFormData,
  QCResultType,
} from "@/types/production";

// ============================================
// Query Keys
// ============================================

const queryKeys = {
  all: ["work-orders"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters?: WOFilters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  statusSummary: () => [...queryKeys.all, "status-summary"] as const,
  metrics: () => [...queryKeys.all, "metrics"] as const,
};

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch list of work orders with optional filters
 *
 * @example
 * ```tsx
 * const { data: wos, isLoading } = useProductionOrders({
 *   filters: { status: "in_progress" },
 * });
 * ```
 */
export function useProductionOrders(options?: {
  filters?: WOFilters;
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}) {
  const { filters, enabled = true, staleTime = 30000, refetchInterval } = options || {};

  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => productionService.getWOs(filters),
    enabled,
    staleTime,
    refetchInterval,
  }) as { data: WorkOrder[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch a single work order by ID
 *
 * @example
 * ```tsx
 * const { data: wo, isLoading } = useProductionOrder(woId);
 * ```
 */
export function useProductionOrder(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => productionService.getWOById(id),
    enabled: enabled && !!id,
  }) as { data: WorkOrder | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch WO status summary for dashboard
 *
 * @example
 * ```tsx
 * const { data: summary } = useWOStatusSummary();
 * ```
 */
export function useWOStatusSummary(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.statusSummary(),
    queryFn: () => productionService.getWOStatusSummary(),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
  }) as { data: { status: WOStatusType; count: number }[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch production metrics
 *
 * @example
 * ```tsx
 * const { data: metrics } = useProductionMetrics();
 * ```
 */
export function useProductionMetrics() {
  return useQuery({
    queryKey: queryKeys.metrics(),
    queryFn: () => productionService.getProductionMetrics(),
    staleTime: 60000,
  }) as { data: { efficiency: number; onTimeRate: number; qcPassRate: number; totalWOs: number; completedWOs: number; inProgressWOs: number } | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook to create a new work order
 *
 * @example
 * ```tsx
 * const createWO = useCreateWO();
 *
 * createWO.mutate(woData, {
 *   onSuccess: (wo) => {
 *     toast.success(`WO ${wo.woNumber} created`);
 *   },
 * });
 * ```
 */
export function useCreateWO(options?: {
  onSuccess?: (data: WorkOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<WorkOrder, WOFormData>({
    mutationFn: (data: WOFormData) => productionService.createWO(data),
    onSuccess: (data: WorkOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to release a work order
 */
export function useReleaseWO(options?: {
  onSuccess?: (data: WorkOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<WorkOrder, string>({
    mutationFn: (id: string) => productionService.releaseWO(id),
    onSuccess: (data: WorkOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.statusSummary()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to start a work order
 */
export function useStartWO(options?: {
  onSuccess?: (data: WorkOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<WorkOrder, string>({
    mutationFn: (id: string) => productionService.startWO(id),
    onSuccess: (data: WorkOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.statusSummary()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to mark work order for QC
 */
export function useMarkWOForQC(options?: {
  onSuccess?: (data: WorkOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<WorkOrder, string>({
    mutationFn: (id: string) => productionService.markForQC(id),
    onSuccess: (data: WorkOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to complete a work order
 */
export function useCompleteWO(options?: {
  onSuccess?: (data: WorkOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<WorkOrder, string>({
    mutationFn: (id: string) => productionService.completeWO(id),
    onSuccess: (data: WorkOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.metrics()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to cancel a work order
 */
export function useCancelWO(options?: {
  onSuccess?: (data: WorkOrder) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<WorkOrder, { id: string; reason: string }>({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      productionService.cancelWO(id, { reason }),
    onSuccess: (data: WorkOrder) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(data.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to update work order progress
 */
export function useUpdateProgress(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { woId: string; data: ProgressUpdateFormData }>({
    mutationFn: ({ woId, data }: { woId: string; data: ProgressUpdateFormData }) =>
      productionService.updateProgress(woId, data).then(() => {}),
    onSuccess: (_, variables: { woId: string; data: ProgressUpdateFormData }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.woId)));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to complete a step
 */
export function useCompleteStep(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { woId: string; stepId: string }>({
    mutationFn: ({ woId, stepId }: { woId: string; stepId: string }) =>
      productionService.completeStep(woId, stepId).then(() => {}),
    onSuccess: (_, variables: { woId: string; stepId: string }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.woId)));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to start QC session
 */
export function useStartQC(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, string>({
    mutationFn: (woId: string) => productionService.startQC(woId).then(() => {}),
    onSuccess: (_, woId: string) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(woId)));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to complete QC session
 */
export function useCompleteQC(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { sessionId: string; result: QCResultType; notes?: string }>({
    mutationFn: ({ sessionId, result, notes }: { sessionId: string; result: QCResultType; notes?: string }) =>
      productionService.completeQC(sessionId, result, notes).then(() => {}),
    onSuccess: () => {
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to get WOs pending QC
 */
export function useWOsPendingQC() {
  return useQuery({
    queryKey: [...queryKeys.all, "pending-qc"],
    queryFn: () => productionService.getWOsPendingQC(),
    staleTime: 30000,
  }) as { data: WorkOrder[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to get work orders by plan
 */
export function useWorkOrdersByPlan(planId: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: [...queryKeys.all, "plan", planId],
    queryFn: () => productionService.getWorkOrdersByPlan(planId),
    enabled: enabled && !!planId,
    staleTime: 30000,
  }) as { data: WorkOrder[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}