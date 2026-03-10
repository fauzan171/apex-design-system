/**
 * useQuery Hook
 * A flexible hook for fetching data with caching, stale-time, and auto-refresh support.
 */

import { useState, useEffect, useCallback, useRef } from "react";

interface QueryOptions<T> {
  /** Function to fetch data */
  queryFn: () => Promise<T>;
  /** Enable/disable the query */
  enabled?: boolean;
  /** Time in ms before data is considered stale (default: 0 = always stale) */
  staleTime?: number;
  /** Interval in ms for auto-refetch (default: 0 = disabled) */
  refetchInterval?: number;
  /** Callback when data is successfully fetched */
  onSuccess?: (data: T) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Initial data before fetch completes */
  initialData?: T;
}

interface QueryResult<T> {
  /** The fetched data */
  data: T | undefined;
  /** True during the initial fetch */
  isLoading: boolean;
  /** True during any fetch (including refetch) */
  isFetching: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Manual refetch function */
  refetch: () => Promise<void>;
  /** True if data is stale */
  isStale: boolean;
  /** Time when data was last fetched */
  dataUpdatedAt: Date | null;
}

// Cache for storing query results
const queryCache = new Map<string, { data: unknown; updatedAt: number }>();

/**
 * Hook for fetching data with caching and auto-refresh support
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useQuery({
 *   queryKey: ['purchase-requests', filters],
 *   queryFn: () => purchasingService.getPRs(filters),
 *   staleTime: 30000, // 30 seconds
 *   refetchInterval: 60000, // 1 minute
 * });
 * ```
 */
export function useQuery<T, TQueryKey extends readonly unknown[] = readonly unknown[]>(
  options: {
    queryKey: TQueryKey;
  } & QueryOptions<T>
): QueryResult<T> {
  const {
    queryKey,
    queryFn,
    enabled = true,
    staleTime = 0,
    refetchInterval = 0,
    onSuccess,
    onError,
    initialData,
  } = options;

  // Serialize query key for caching
  const queryKeyStr = JSON.stringify(queryKey);

  // State
  const [data, setData] = useState<T | undefined>(() => {
    // Check cache first
    const cached = queryCache.get(queryKeyStr);
    if (cached && (staleTime === Infinity || Date.now() - cached.updatedAt < staleTime)) {
      return cached.data as T;
    }
    return initialData;
  });
  const [isLoading, setIsLoading] = useState(!data && enabled);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataUpdatedAt, setDataUpdatedAt] = useState<Date | null>(() => {
    const cached = queryCache.get(queryKeyStr);
    return cached ? new Date(cached.updatedAt) : null;
  });

  // Refs for callbacks (to avoid re-renders)
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  // Fetch function
  const fetchData = useCallback(async (isRefetch = false) => {
    if (!enabled) return;

    if (isRefetch) {
      setIsFetching(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const result = await queryFn();

      // Update cache
      queryCache.set(queryKeyStr, { data: result, updatedAt: Date.now() });

      setData(result);
      setDataUpdatedAt(new Date());

      onSuccessRef.current?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onErrorRef.current?.(error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [queryFn, enabled, queryKeyStr]);

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    // Check if data is stale
    const cached = queryCache.get(queryKeyStr);
    const isDataStale = !cached || (staleTime > 0 && Date.now() - cached.updatedAt >= staleTime);

    if (enabled && isDataStale) {
      fetchData();
    }
  }, [queryKeyStr, enabled, staleTime, fetchData]);

  // Auto-refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const intervalId = setInterval(() => {
      fetchData(true);
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [refetchInterval, enabled, fetchData]);

  // Check if stale
  const isStale = (() => {
    if (staleTime === 0) return true;
    if (!dataUpdatedAt) return true;
    return Date.now() - dataUpdatedAt.getTime() >= staleTime;
  })();

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    isStale,
    dataUpdatedAt,
  };
}

/**
 * Clear the query cache
 */
export function clearQueryCache(key?: string) {
  if (key) {
    queryCache.delete(key);
  } else {
    queryCache.clear();
  }
}

/**
 * Invalidate queries by partial key match
 */
export function invalidateQueries(partialKey: string) {
  for (const key of queryCache.keys()) {
    if (key.includes(partialKey)) {
      queryCache.delete(key);
    }
  }
}

export type { QueryOptions, QueryResult };