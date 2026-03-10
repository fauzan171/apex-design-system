# Custom Hooks Usage Guide

This document provides comprehensive documentation for the custom hooks system in the Apex Ferro ERP Dashboard.

## Table of Contents

1. [Overview](#overview)
2. [Base Hooks](#base-hooks)
3. [Entity Hooks](#entity-hooks)
4. [Usage Patterns](#usage-patterns)
5. [Best Practices](#best-practices)

---

## Overview

The custom hooks system provides a consistent, type-safe way to fetch and mutate data across all modules of the ERP Dashboard. Built on top of React hooks, it offers:

- **Automatic caching** with configurable stale time
- **Auto-refresh** with interval-based refetching
- **Loading states** for better UX
- **Error handling** with callbacks
- **Cache invalidation** on mutations

---

## Base Hooks

### useQuery

The `useQuery` hook is used for data fetching with caching support.

```typescript
import { useQuery } from "@/hooks";

const { data, isLoading, isFetching, error, refetch, isStale } = useQuery({
  queryKey: ["resource-name", filters],
  queryFn: () => service.getResource(filters),
  enabled: true,           // Optional: conditionally enable/disable
  staleTime: 30000,        // Optional: cache validity in ms (default: 0)
  refetchInterval: 60000,  // Optional: auto-refresh interval in ms
  onSuccess: (data) => {}, // Optional: success callback
  onError: (error) => {},  // Optional: error callback
  initialData: [],         // Optional: initial data before fetch
});
```

**Return Values:**

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T \| undefined` | The fetched data |
| `isLoading` | `boolean` | True during initial fetch |
| `isFetching` | `boolean` | True during any fetch (including refetch) |
| `error` | `Error \| null` | Error if fetch failed |
| `refetch` | `() => Promise<void>` | Manual refetch function |
| `isStale` | `boolean` | True if data is stale |
| `dataUpdatedAt` | `Date \| null` | Last fetch timestamp |

### useMutation

The `useMutation` hook is used for create, update, delete operations.

```typescript
import { useMutation } from "@/hooks";

const createItem = useMutation({
  mutationFn: (data: CreateRequest) => service.createItem(data),
  onSuccess: (data, variables, context) => {
    // Handle success
  },
  onError: (error, variables, context) => {
    // Handle error
  },
  onSettled: (data, error, variables, context) => {
    // Always runs after mutation
  },
});

// Trigger mutation
createItem.mutate(newItemData);

// Or async version
const result = await createItem.mutateAsync(newItemData);
```

**Return Values:**

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T \| undefined` | Result of mutation |
| `isLoading` | `boolean` | True while mutating |
| `error` | `Error \| null` | Error if mutation failed |
| `mutate` | `(variables, options?) => Promise<T \| undefined>` | Trigger mutation |
| `mutateAsync` | `(variables) => Promise<T>` | Async mutation |
| `reset` | `() => void` | Reset state |
| `isSuccess` | `boolean` | True if succeeded |
| `isError` | `boolean` | True if failed |
| `status` | `'idle' \| 'loading' \| 'success' \| 'error'` | Current status |

### Cache Management

```typescript
import { clearQueryCache, invalidateQueries } from "@/hooks";

// Clear specific cache
clearQueryCache(JSON.stringify(["purchase-requests", "list"]));

// Clear all cache matching pattern
invalidateQueries("purchase-requests");
```

---

## Entity Hooks

### Purchase Requests (`usePurchaseRequests`)

```typescript
import {
  usePurchaseRequests,
  usePurchaseRequest,
  usePRStatusSummary,
  usePRAging,
  useCreatePR,
  useUpdatePR,
  useSubmitPR,
  useApprovePR,
  useRejectPR,
} from "@/hooks";

// List PRs with filters
const { data: prs, isLoading } = usePurchaseRequests({
  filters: { status: "pending" },
  staleTime: 30000,
  refetchInterval: 60000,
});

// Single PR
const { data: pr } = usePurchaseRequest(prId);

// Status summary
const { data: summary } = usePRStatusSummary();
// Returns: { draft: 5, submitted: 3, approved: 10, ... }

// Create PR
const createPR = useCreatePR({
  onSuccess: (pr) => {
    toast.success(`PR ${pr.prNumber} created`);
    navigate(`/purchasing/${pr.id}`);
  },
});
createPR.mutate(prData);

// Approve PR
const approvePR = useApprovePR({
  onSuccess: () => toast.success("PR approved"),
});
approvePR.mutate(prId);
```

### Production Orders (`useProductionOrders`)

```typescript
import {
  useProductionOrders,
  useProductionOrder,
  useWOStatusSummary,
  useProductionMetrics,
  useCreateWO,
  useReleaseWO,
  useStartWO,
  useMarkWOForQC,
  useCompleteWO,
  useUpdateProgress,
} from "@/hooks";

// List work orders
const { data: wos } = useProductionOrders({
  filters: { status: "in_progress" },
});

// Status summary
const { data: summary } = useWOStatusSummary();

// Metrics for dashboard
const { data: metrics } = useProductionMetrics();
// Returns: { totalWOs, inProgressWOs, completedWOs, onTimeRate, qcPassRate }

// Create WO
const createWO = useCreateWO({
  onSuccess: (wo) => navigate(`/production/${wo.id}`),
});
createWO.mutate(woData);

// Update progress
const updateProgress = useUpdateProgress();
updateProgress.mutate({
  woId: "wo-001",
  stepId: "step-001",
  data: { quantityDone: 100, notes: "Completed" },
});
```

### Warehouse Stock (`useWarehouseStock`)

```typescript
import {
  useWarehouseStock,
  useWarehouseStats,
  useLowStockAlerts,
  useGoodsReceipts,
  useGoodsReceipt,
  useCreateGoodsReceipt,
  useGoodsIssues,
  useGoodsIssue,
  useCreateGoodsIssue,
} from "@/hooks";

// Stock list with filters
const { data: stocks } = useWarehouseStock({
  filters: { category: "Raw Material", lowStock: true },
});

// Warehouse stats
const { data: stats } = useWarehouseStats();
// Returns: { totalItems, totalValue, lowStockCount, byCategory }

// Low stock alerts
const { data: alerts } = useLowStockAlerts();

// Goods receipts
const { data: grs } = useGoodsReceipts({
  filters: { status: "inspection_pending" },
});

// Create goods receipt
const createGR = useCreateGoodsReceipt({
  onSuccess: (gr) => toast.success(`GR created for ${gr.do_number}`),
});
createGR.mutate(grData);
```

### Delivery Orders (`useDeliveryOrders`)

```typescript
import {
  useDeliveryOrders,
  useDeliveryOrder,
  useDeliveryOrderStats,
  useCreateDO,
  useUpdateDO,
  useReleaseDO,
  useMarkInTransit,
  useMarkDelivered,
  useUploadBAST,
  useCancelDO,
} from "@/hooks";

// List DOs
const { data: dos } = useDeliveryOrders({
  filters: { status: "in_transit" },
});

// DO stats
const { data: stats } = useDeliveryOrderStats();

// Create DO
const createDO = useCreateDO({
  onSuccess: (do) => navigate(`/delivery/${do.id}`),
});
createDO.mutate(doData);

// Upload BAST
const uploadBAST = useUploadBAST({
  onSuccess: () => toast.success("BAST uploaded"),
});
uploadBAST.mutate({ doId: "do-001", file: fileObject });
```

### Master Data (`useMasterData`)

```typescript
import {
  useProducts,
  useProduct,
  useProductsByType,
  useProductTypes,
  useUnits,
  useCreateProduct,
  useUpdateProduct,
  useBoM,
  useCreateBoM,
  useFinishedGoods,
  useRawMaterials,
} from "@/hooks";

// List products
const { data: products } = useProducts({
  filters: { type: "fg", status: "active" },
});

// Products by type
const { data: finishedGoods } = useFinishedGoods();
const { data: rawMaterials } = useRawMaterials();

// Single product
const { data: product } = useProduct(productId);

// Dropdown options
const { data: types } = useProductTypes();
const { data: units } = useUnits();

// Create product
const createProduct = useCreateProduct({
  onSuccess: (p) => toast.success(`Product ${p.code} created`),
});
createProduct.mutate(productData);

// BOM management
const { data: bom } = useBoM(productId);

const createBOM = useCreateBoM({
  onSuccess: (bom) => toast.success("BOM created"),
});
createBOM.mutate({ productId, items: bomItems });
```

---

## Usage Patterns

### Page Component Pattern

```typescript
import { useState, useMemo, useCallback } from "react";
import { useEntities, useEntityStats } from "@/hooks";

export function EntityListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Build filters
  const filters = useMemo(() => ({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  }), [search, statusFilter]);

  // Fetch data
  const {
    data: entities = [],
    isLoading,
    isFetching,
    refetch,
  } = useEntities({
    filters,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Stats
  const { data: stats, refetch: refetchStats } = useEntityStats();

  // Refresh handler
  const handleRefresh = useCallback(() => {
    refetch();
    refetchStats();
  }, [refetch, refetchStats]);

  return (
    <div>
      {/* UI components */}
    </div>
  );
}
```

### Mutation with Cache Invalidation

```typescript
const createEntity = useCreateEntity({
  onSuccess: (data) => {
    // Cache is automatically invalidated by the hook
    toast.success("Created successfully");
    navigate(`/entities/${data.id}`);
  },
  onError: (error) => {
    toast.error(`Failed to create: ${error.message}`);
  },
});

// Trigger with data
const handleSubmit = (formData: CreateRequest) => {
  createEntity.mutate(formData);
};
```

### Conditional Queries

```typescript
// Only fetch when ID is available
const { data: entity } = useEntity(entityId, {
  enabled: !!entityId,
});

// Dependent queries
const { data: details } = useEntityDetails(entity?.id, {
  enabled: !!entity?.id,
});
```

---

## Best Practices

### 1. Use Query Keys Factory Pattern

```typescript
// In hook file
const queryKeys = {
  all: ["entities"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters?) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};
```

### 2. Set Appropriate Stale Times

```typescript
// Frequently changing data - short stale time
useQuery({ staleTime: 30000 }); // 30 seconds

// Static data - long stale time
useQuery({ staleTime: Infinity });

// Default - always stale
useQuery({ staleTime: 0 });
```

### 3. Auto-refresh for Real-time Data

```typescript
// Dashboard metrics
useMetrics({ refetchInterval: 30000 }); // Every 30 seconds

// Stock levels
useWarehouseStock({ refetchInterval: 60000 }); // Every minute
```

### 4. Error Handling

```typescript
const { data, error, isError } = useQuery({
  queryKey: ["entities"],
  queryFn: () => service.getEntities(),
  onError: (error) => {
    console.error("Failed to fetch:", error);
    toast.error("Failed to load data");
  },
});

// In component
if (isError) {
  return <ErrorState message={error?.message} />;
}
```

### 5. Loading States

```typescript
const { data, isLoading, isFetching } = useQuery();

// Initial loading
if (isLoading) {
  return <Spinner />;
}

// Background refresh
return (
  <div>
    {isFetching && <RefreshIndicator />}
    {/* Content */}
  </div>
);
```

### 6. Type Safety

```typescript
// Hooks are fully typed
interface Product {
  id: string;
  code: string;
  name: string;
}

// Data is automatically typed
const { data } = useProducts();
// data: Product[] | undefined
```

---

## Migration from Direct Service Calls

### Before (Manual State Management)

```typescript
// Old pattern
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await service.getData();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [dependency]);
```

### After (Using Hooks)

```typescript
// New pattern
const { data = [], isLoading, error, refetch } = useData({
  filters: dependency,
  staleTime: 30000,
});
```

---

## Troubleshooting

### Data Not Refreshing

```typescript
// Ensure cache is invalidated on mutations
const updateEntity = useUpdateEntity({
  onSuccess: () => {
    clearQueryCache(JSON.stringify(queryKeys.lists()));
  },
});

// Or use refetch manually
const { refetch } = useEntities();
const handleUpdate = async () => {
  await service.update(id, data);
  refetch();
};
```

### Stale Data on Page Navigation

```typescript
// Use shorter staleTime for dynamic data
useEntities({ staleTime: 0 }); // Always refetch

// Or manually refetch on mount
const { refetch } = useEntities();
useEffect(() => {
  refetch();
}, []);
```

### Type Errors with Query Keys

```typescript
// Use type assertions if needed
const { data } = useQuery({
  queryKey: queryKeys.list(filters),
  queryFn: () => service.getEntities(filters),
}) as { data: Entity[] | undefined; ... };
```

---

## API Reference

See individual hook files for detailed API reference:

- `src/hooks/useQuery.ts` - Base query hook
- `src/hooks/useMutation.ts` - Base mutation hook
- `src/hooks/usePurchaseRequests.ts` - PR hooks
- `src/hooks/useProductionOrders.ts` - WO hooks
- `src/hooks/useWarehouseStock.ts` - Stock/GR/GI hooks
- `src/hooks/useDeliveryOrders.ts` - DO hooks
- `src/hooks/useMasterData.ts` - Product/BOM hooks