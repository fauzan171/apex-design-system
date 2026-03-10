/**
 * Dashboard API Hooks
 * Custom hooks for fetching dashboard data from the backend API
 */

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/apiClient";
import type {
  ProductionKPIs,
  DeliveryKPIs,
  InventoryKPIs,
  PurchasingKPIs,
  Project,
  Alert,
  ComparisonData,
} from "../types/index";

// ============================================
// Types
// ============================================

interface DashboardSummary {
  production?: ProductionKPIs;
  delivery?: DeliveryKPIs;
  inventory?: InventoryKPIs;
  purchasing?: PurchasingKPIs;
  projects?: Project[];
  alerts?: Alert[];
  lastUpdated?: string;
}

interface HookResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

interface ComparisonParams {
  currentStart: string;
  currentEnd: string;
  previousStart: string;
  previousEnd: string;
  planId?: string;
}

// ============================================
// useDashboardSummary
// ============================================

interface DashboardSummaryParams {
  startDate?: string;
  endDate?: string;
  planId?: string;
  periodComparison?: boolean;
}

export function useDashboardSummary(
  params?: DashboardSummaryParams
): HookResult<DashboardSummary> {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.planId) query.set("planId", params.planId);
    if (params?.periodComparison !== undefined)
      query.set("periodComparison", params.periodComparison.toString());

    const response = await apiClient.getDashboardSummary(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch dashboard summary");
    }
    setIsLoading(false);
  }, [params?.startDate, params?.endDate, params?.planId, params?.periodComparison]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// useProductionKPIs
// ============================================

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
  planId?: string;
}

export function useProductionKPIs(params?: DateRangeParams): HookResult<ProductionKPIs> {
  const [data, setData] = useState<ProductionKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.planId) query.set("planId", params.planId);

    const response = await apiClient.getProductionKPIs(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch production KPIs");
    }
    setIsLoading(false);
  }, [params?.startDate, params?.endDate, params?.planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// useDeliveryKPIs
// ============================================

export function useDeliveryKPIs(params?: DateRangeParams): HookResult<DeliveryKPIs> {
  const [data, setData] = useState<DeliveryKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.planId) query.set("planId", params.planId);

    const response = await apiClient.getDeliveryKPIs(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch delivery KPIs");
    }
    setIsLoading(false);
  }, [params?.startDate, params?.endDate, params?.planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// useInventoryKPIs
// ============================================

interface InventoryKPIsParams {
  category?: string;
}

export function useInventoryKPIs(params?: InventoryKPIsParams): HookResult<InventoryKPIs> {
  const [data, setData] = useState<InventoryKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);

    const response = await apiClient.getInventoryKPIs(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch inventory KPIs");
    }
    setIsLoading(false);
  }, [params?.category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// usePurchasingKPIs
// ============================================

interface PurchasingKPIsParams {
  startDate?: string;
  endDate?: string;
}

export function usePurchasingKPIs(params?: PurchasingKPIsParams): HookResult<PurchasingKPIs> {
  const [data, setData] = useState<PurchasingKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);

    const response = await apiClient.getPurchasingKPIs(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch purchasing KPIs");
    }
    setIsLoading(false);
  }, [params?.startDate, params?.endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// useProjects
// ============================================

interface ProjectItem {
  id: string;
  name: string;
  status: string;
  progress: number;
}

interface ProjectsParams {
  status?: string;
  stage?: string;
  page?: number;
  limit?: number;
}

export function useProjects(params?: ProjectsParams): HookResult<ProjectItem[]> {
  const [data, setData] = useState<ProjectItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.stage) query.set("stage", params.stage);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const response = await apiClient.getDashboardProjects(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch projects");
    }
    setIsLoading(false);
  }, [params?.status, params?.stage, params?.page, params?.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// useAlerts
// ============================================

interface AlertItem extends Alert {
  id: string;
  category: "production" | "inventory" | "purchasing" | "quality";
  createdAt: string;
}

interface AlertsParams {
  category?: "production" | "inventory" | "purchasing" | "quality";
  severity?: "low" | "medium" | "high" | "critical";
}

export function useAlerts(params?: AlertsParams): HookResult<AlertItem[]> {
  const [data, setData] = useState<AlertItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.severity) query.set("severity", params.severity);

    const response = await apiClient.getDashboardAlerts(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch alerts");
    }
    setIsLoading(false);
  }, [params?.category, params?.severity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ============================================
// useComparison
// ============================================

interface ComparisonResponse {
  currentPeriod: Record<string, number>;
  previousPeriod: Record<string, number>;
  comparison: ComparisonData[];
}

export function useComparison(params: ComparisonParams): HookResult<ComparisonResponse> {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!params.currentStart || !params.currentEnd || !params.previousStart || !params.previousEnd) {
      setError("All comparison date parameters are required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    query.set("currentStart", params.currentStart);
    query.set("currentEnd", params.currentEnd);
    query.set("previousStart", params.previousStart);
    query.set("previousEnd", params.previousEnd);
    if (params.planId) query.set("planId", params.planId);

    const response = await apiClient.getDashboardComparison(query.toString());
    if (response.success && response.data) {
      setData(response.data);
    } else {
      setError(response.message || "Failed to fetch comparison data");
    }
    setIsLoading(false);
  }, [params.currentStart, params.currentEnd, params.previousStart, params.previousEnd, params.planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}