/**
 * Custom Hooks Barrel Export
 * Export all hooks from a single entry point
 */

// Base Hooks
export * from "./useQuery";
export * from "./useMutation";

// Entity Hooks
export * from "./usePurchaseRequests";
export * from "./useProductionOrders";
export * from "./useWarehouseStock";
export * from "./useDeliveryOrders";
export * from "./useMasterData";

// Dashboard Hooks (existing)
export * from "./useDashboard";

// Re-export commonly used types
export type {
  QueryOptions,
  QueryResult,
} from "./useQuery";

export type {
  MutationOptions,
  MutationResult,
} from "./useMutation";