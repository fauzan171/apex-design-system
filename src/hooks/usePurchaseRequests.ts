/**
 * Purchase Requests Hooks
 * Custom hooks for Purchase Request (PR) management
 */

import { useQuery, clearQueryCache } from "./useQuery";
import { useMutation } from "./useMutation";
import { purchasingService } from "@/services/purchasingService";
import type {
  PurchaseRequest,
  PRFilters,
  CreatePRRequest,
  UpdatePRRequest,
  PRStatusType,
} from "@/types/purchasing";

// ============================================
// Query Keys
// ============================================

const queryKeys = {
  all: ["purchase-requests"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters?: PRFilters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  stats: () => [...queryKeys.all, "stats"] as const,
  statusSummary: () => [...queryKeys.all, "status-summary"] as const,
  aging: () => [...queryKeys.all, "aging"] as const,
};

// ============================================
// Query Hooks
// ============================================

/**
 * Hook to fetch list of purchase requests with optional filters
 *
 * @example
 * ```tsx
 * const { data: prs, isLoading, refetch } = usePurchaseRequests({
 *   filters: { status: "pending" },
 *   refetchInterval: 30000,
 * });
 * ```
 */
export function usePurchaseRequests(options?: {
  filters?: PRFilters;
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}) {
  const { filters, enabled = true, staleTime = 30000, refetchInterval } = options || {};

  return useQuery({
    queryKey: queryKeys.list(filters),
    queryFn: () => purchasingService.getPRs(filters),
    enabled,
    staleTime,
    refetchInterval,
  }) as { data: PurchaseRequest[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch a single purchase request by ID
 *
 * @example
 * ```tsx
 * const { data: pr, isLoading } = usePurchaseRequest(prId);
 * ```
 */
export function usePurchaseRequest(id: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => purchasingService.getPRById(id),
    enabled: enabled && !!id,
  }) as { data: PurchaseRequest | null | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch PR status summary for dashboard
 *
 * @example
 * ```tsx
 * const { data: summary } = usePRStatusSummary();
 * ```
 */
export function usePRStatusSummary(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.statusSummary(),
    queryFn: () => purchasingService.getPRStatusSummary(),
    staleTime: 60000,
    refetchInterval: options?.refetchInterval,
  }) as { data: { status: PRStatusType; count: number }[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch PR aging report
 */
export function usePRAging() {
  return useQuery({
    queryKey: queryKeys.aging(),
    queryFn: () => purchasingService.getPRAgingReport(),
    staleTime: 60000,
  }) as { data: { ageBucket: string; count: number; prs: string[] }[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

/**
 * Hook to fetch PR statistics
 */
export function usePRStats() {
  return useQuery({
    queryKey: queryKeys.stats(),
    queryFn: () => purchasingService.getPRStatistics(),
    staleTime: 60000,
  }) as { data: { total: number; byStatus: Record<PRStatusType, number>; avgLeadTime: number; pendingApproval: number } | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook to create a new purchase request
 *
 * @example
 * ```tsx
 * const createPR = useCreatePR();
 *
 * createPR.mutate(prData, {
 *   onSuccess: (pr) => {
 *     toast.success(`PR ${pr.prNumber} created`);
 *   },
 * });
 * ```
 */
export function useCreatePR(options?: {
  onSuccess?: (data: PurchaseRequest) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<PurchaseRequest, CreatePRRequest>({
    mutationFn: (data: CreatePRRequest) => purchasingService.createPR(data),
    onSuccess: (data: PurchaseRequest) => {
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to update a purchase request
 */
export function useUpdatePR(options?: {
  onSuccess?: (data: PurchaseRequest) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<PurchaseRequest, { id: string; data: UpdatePRRequest }>({
    mutationFn: ({ id, data }: { id: string; data: UpdatePRRequest }) =>
      purchasingService.updatePR(id, data),
    onSuccess: (data: PurchaseRequest, variables: { id: string; data: UpdatePRRequest }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * Hook to delete a purchase request
 */
export function useDeletePR(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, string>({
    mutationFn: (id: string) => purchasingService.deletePR(id),
    onSuccess: (_, id: string) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to submit a purchase request for approval
 */
export function useSubmitPR(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, string>({
    mutationFn: (id: string) => purchasingService.submitPR(id),
    onSuccess: (_, id: string) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.statusSummary()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to approve a purchase request
 */
export function useApprovePR(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, string>({
    mutationFn: (id: string) => purchasingService.approvePR(id),
    onSuccess: (_, id: string) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.statusSummary()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to reject a purchase request
 */
export function useRejectPR(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { id: string; reason: string }>({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      purchasingService.rejectPR(id, { reason }),
    onSuccess: (_, variables: { id: string; reason: string }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.statusSummary()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to cancel a purchase request
 */
export function useCancelPR(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { id: string; reason?: string }>({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      purchasingService.cancelPR(id, reason),
    onSuccess: (_, variables: { id: string; reason?: string }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.statusSummary()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to update PR status
 */
export function useUpdatePRStatus(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<void, { id: string; status: PRStatusType }>({
    mutationFn: ({ id, status }: { id: string; status: PRStatusType }) => {
      switch (status) {
        case "submitted":
          return purchasingService.submitPR(id);
        case "approved":
          return purchasingService.approvePR(id);
        case "rejected":
          return purchasingService.rejectPR(id, { reason: "Status changed" });
        case "cancelled":
          return purchasingService.cancelPR(id);
        case "processing":
          return purchasingService.markAsProcessing(id);
        case "do_issued":
          return purchasingService.markAsDOIssued(id, { do_number: "" });
        default:
          return Promise.resolve();
      }
    },
    onSuccess: (_, variables: { id: string; status: PRStatusType }) => {
      clearQueryCache(JSON.stringify(queryKeys.detail(variables.id)));
      clearQueryCache(JSON.stringify(queryKeys.lists()));
      clearQueryCache(JSON.stringify(queryKeys.statusSummary()));
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Hook to get PRs pending approval
 */
export function usePRsPendingApproval() {
  return useQuery({
    queryKey: [...queryKeys.all, "pending-approval"],
    queryFn: () => purchasingService.getPRsPendingApproval(),
    staleTime: 30000,
  }) as { data: PurchaseRequest[] | undefined; isLoading: boolean; isFetching: boolean; error: Error | null; refetch: () => Promise<void>; isStale: boolean; dataUpdatedAt: Date | null };
}