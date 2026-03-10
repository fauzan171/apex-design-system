/**
 * useMutation Hook
 * A hook for handling data mutations (create, update, delete) with callback support.
 */

import { useState, useCallback, useRef } from "react";

interface MutationOptions<TData, TVariables, TContext = unknown> {
  /** Function to perform the mutation */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Callback called before mutation, returns context passed to onSettled */
  onMutate?: (variables: TVariables) => Promise<TContext | undefined> | TContext | undefined;
  /** Callback called on successful mutation */
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  /** Callback called on mutation error */
  onError?: (error: Error, variables: TVariables, context: TContext | undefined) => void;
  /** Callback called after mutation completes (success or error) */
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables,
    context: TContext | undefined
  ) => void;
}

interface MutationResult<TData, TVariables> {
  /** Result of the mutation */
  data: TData | undefined;
  /** True while mutation is in progress */
  isLoading: boolean;
  /** Error if mutation failed */
  error: Error | null;
  /** Function to trigger the mutation */
  mutate: (variables: TVariables, options?: Partial<MutationOptions<TData, TVariables>>) => Promise<TData | undefined>;
  /** Async version of mutate that returns a promise */
  mutateAsync: (variables: TVariables) => Promise<TData>;
  /** Reset mutation state */
  reset: () => void;
  /** True if mutation succeeded */
  isSuccess: boolean;
  /** True if mutation failed */
  isError: boolean;
  /** Current status */
  status: "idle" | "loading" | "success" | "error";
}

type MutationState<TData> = {
  data: TData | undefined;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
  status: "idle" | "loading" | "success" | "error";
};

/**
 * Hook for handling mutations with callback support
 *
 * @example
 * ```tsx
 * const createPRMutation = useMutation({
 *   mutationFn: (data: CreatePRRequest) => purchasingService.createPR(data),
 *   onSuccess: (data) => {
 *     toast.success(`PR ${data.prNumber} created`);
 *     navigate(`/purchasing/${data.id}`);
 *   },
 *   onError: (error) => {
 *     toast.error(`Failed to create PR: ${error.message}`);
 *   },
 * });
 *
 * // In component
 * const handleSubmit = (formData) => {
 *   createPRMutation.mutate(formData);
 * };
 * ```
 */
export function useMutation<TData, TVariables, TContext = unknown>(
  options: MutationOptions<TData, TVariables, TContext>
): MutationResult<TData, TVariables> {
  const { mutationFn, onMutate, onSuccess, onError, onSettled } = options;

  const [state, setState] = useState<MutationState<TData>>({
    data: undefined,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
    status: "idle",
  });

  // Use refs for callbacks to avoid stale closures
  const onMutateRef = useRef(onMutate);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onSettledRef = useRef(onSettled);

  onMutateRef.current = onMutate;
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;
  onSettledRef.current = onSettled;

  const reset = useCallback(() => {
    setState({
      data: undefined,
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false,
      status: "idle",
    });
  }, []);

  const mutate = useCallback(
    async (
      variables: TVariables,
      overrideOptions?: Partial<MutationOptions<TData, TVariables>>
    ) => {
      // Merge options
      const mergedOnSuccess = overrideOptions?.onSuccess ?? onSuccessRef.current;
      const mergedOnError = overrideOptions?.onError ?? onErrorRef.current;
      const mergedOnSettled = overrideOptions?.onSettled ?? onSettledRef.current;

      // Reset state
      setState({
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
        status: "loading",
      });

      // Call onMutate and get context
      let context: TContext | undefined;
      try {
        context = await onMutateRef.current?.(variables);
      } catch (error) {
        console.error("Error in onMutate callback:", error);
      }

      try {
        const data = await mutationFn(variables);

        setState({
          data,
          isLoading: false,
          error: null,
          isSuccess: true,
          isError: false,
          status: "success",
        });

        mergedOnSuccess?.(data, variables, context);
        mergedOnSettled?.(data, null, variables, context);

        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        setState({
          data: undefined,
          isLoading: false,
          error,
          isSuccess: false,
          isError: true,
          status: "error",
        });

        mergedOnError?.(error, variables, context);
        mergedOnSettled?.(undefined, error, variables, context);

        return undefined;
      }
    },
    [mutationFn]
  );

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      return new Promise((resolve, reject) => {
        mutate(variables, {
          onSuccess: (data) => resolve(data as TData),
          onError: (error) => reject(error),
        });
      });
    },
    [mutate]
  );

  return {
    ...state,
    mutate,
    mutateAsync,
    reset,
  };
}

export type { MutationOptions, MutationResult };