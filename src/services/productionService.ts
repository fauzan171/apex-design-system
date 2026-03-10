/**
 * Production Service
 * Handles all Work Order (WO), Steps, Progress, QC operations
 * Real API integration
 *
 * OpenAPI endpoints (base: /api/v1):
 * - /production/work-orders/*
 * - /production/progress/*
 * - /production/qc-sessions/*
 * - /production/qc-findings/*
 */

import type {
  WorkOrder,
  WOStep,
  WOProgress,
  WOStatusType,
  QCSession,
  QCFinding,
  QCResultType,
  WOFilters,
  WOFormData,
  UpdateWORequest,
  CancelWORequest,
  ProgressUpdateFormData,
  QCFindingFormData,
  ProductionMetrics,
  WOStatusSummary,
} from "@/types/production";
import { apiClient } from "@/lib/apiClient";

// ============================================
// PRODUCTION SERVICE
// ============================================

export const productionService = {
  // ============================================
  // WORK ORDERS
  // ============================================

  getWOs: async (filters?: WOFilters): Promise<WorkOrder[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.productId) params.append("product_id", filters.productId);
    if (filters?.planId) params.append("plan_id", filters.planId);
    const response = await apiClient.get<WorkOrder[]>(`/production/work-orders?${params.toString()}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getWOById: async (id: string): Promise<WorkOrder | null> => {
    const response = await apiClient.get<WorkOrder>(`/production/work-orders/${id}`);
    return response.data || null;
  },

  createWO: async (data: WOFormData): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>("/production/work-orders", data);
    if (!response.data) throw new Error("Failed to create work order");
    return response.data;
  },

  updateWO: async (id: string, data: UpdateWORequest): Promise<WorkOrder> => {
    const response = await apiClient.put<WorkOrder>(`/production/work-orders/${id}`, data);
    if (!response.data) throw new Error("Failed to update work order");
    return response.data;
  },

  deleteWO: async (id: string): Promise<void> => {
    await apiClient.delete(`/production/work-orders/${id}`);
  },

  /**
   * Get available plans for WO creation
   * GET /production/work-orders/available-plans
   */
  getAvailablePlansForWO: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>("/production/work-orders/available-plans");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  // ============================================
  // STATUS TRANSITIONS
  // ============================================

  releaseWO: async (id: string): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>(`/production/work-orders/${id}/release`);
    if (!response.data) throw new Error("Failed to release work order");
    return response.data;
  },

  startWO: async (id: string): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>(`/production/work-orders/${id}/start`);
    if (!response.data) throw new Error("Failed to start work order");
    return response.data;
  },

  markForQC: async (id: string): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>(`/production/work-orders/${id}/mark-qc`);
    if (!response.data) throw new Error("Failed to mark work order for QC");
    return response.data;
  },

  completeWO: async (id: string): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>(`/production/work-orders/${id}/complete`);
    if (!response.data) throw new Error("Failed to complete work order");
    return response.data;
  },

  cancelWO: async (id: string, data: CancelWORequest): Promise<WorkOrder> => {
    const response = await apiClient.post<WorkOrder>(`/production/work-orders/${id}/cancel`, data);
    if (!response.data) throw new Error("Failed to cancel work order");
    return response.data;
  },

  // ============================================
  // STEPS
  // ============================================

  /**
   * Get steps for a work order
   * GET /production/work-orders/{woId}/steps
   */
  getWOSteps: async (woId: string): Promise<WOStep[]> => {
    const response = await apiClient.get<WOStep[]>(`/production/work-orders/${woId}/steps`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Add a step to a work order
   * POST /production/work-orders/{woId}/steps
   */
  addWOStep: async (woId: string, data: { name: string; description?: string; estimatedDuration?: number }): Promise<WOStep> => {
    const response = await apiClient.post<WOStep>(`/production/work-orders/${woId}/steps`, data);
    if (!response.data) throw new Error("Failed to add step");
    return response.data;
  },

  /**
   * Update a step
   * PUT /production/work-orders/{woId}/steps/{stepId}
   */
  updateWOStep: async (woId: string, stepId: string, data: Partial<{ name: string; description: string; estimatedDuration: number }>): Promise<WOStep> => {
    const response = await apiClient.put<WOStep>(`/production/work-orders/${woId}/steps/${stepId}`, data);
    if (!response.data) throw new Error("Failed to update step");
    return response.data;
  },

  /**
   * Delete a step
   * DELETE /production/work-orders/{woId}/steps/{stepId}
   */
  deleteWOStep: async (woId: string, stepId: string): Promise<void> => {
    await apiClient.delete(`/production/work-orders/${woId}/steps/${stepId}`);
  },

  /**
   * Reorder steps
   * POST /production/work-orders/{woId}/steps/reorder
   */
  reorderWOSteps: async (woId: string, stepIds: string[]): Promise<void> => {
    await apiClient.post(`/production/work-orders/${woId}/steps/reorder`, { stepIds });
  },

  /**
   * Start a specific step
   * POST /production/work-orders/{woId}/steps/{stepId}/start
   */
  startStep: async (woId: string, stepId: string): Promise<WOStep> => {
    const response = await apiClient.post<WOStep>(`/production/work-orders/${woId}/steps/${stepId}/start`);
    if (!response.data) throw new Error("Failed to start step");
    return response.data;
  },

  /**
   * Complete a specific step
   * POST /production/work-orders/{woId}/steps/{stepId}/complete
   */
  completeStep: async (woId: string, stepId: string): Promise<WOStep> => {
    const response = await apiClient.post<WOStep>(`/production/work-orders/${woId}/steps/${stepId}/complete`);
    if (!response.data) throw new Error("Failed to complete step");
    return response.data;
  },

  // ============================================
  // PROGRESS
  // ============================================

  /**
   * Get work order progress
   * GET /production/work-orders/{woId}/progress
   */
  getWorkOrderProgress: async (woId: string): Promise<WOProgress | null> => {
    const response = await apiClient.get<WOProgress>(`/production/work-orders/${woId}/progress`);
    return response.data || null;
  },

  /**
   * Update work order progress
   * POST /production/work-orders/{woId}/progress
   */
  updateProgress: async (woId: string, data: ProgressUpdateFormData): Promise<WOProgress> => {
    const response = await apiClient.post<WOProgress>(`/production/work-orders/${woId}/progress`, data);
    if (!response.data) throw new Error("Failed to update progress");
    return response.data;
  },

  /**
   * Get progress history
   * GET /production/work-orders/{woId}/progress/history
   */
  getProgressHistory: async (woId: string): Promise<WOProgress[]> => {
    const response = await apiClient.get<WOProgress[]>(`/production/work-orders/${woId}/progress/history`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Upload photo to a progress record
   * POST /production/progress/{progressId}/photos
   */
  uploadProgressPhoto: async (progressId: string, file: File, caption?: string): Promise<any> => {
    const formData = new FormData();
    formData.append("photo", file);
    if (caption) formData.append("caption", caption);
    const response = await apiClient.post<any>(`/production/progress/${progressId}/photos`, formData);
    return response.data;
  },

  /**
   * Delete a progress photo
   * DELETE /production/progress/{progressId}/photos/{photoId}
   */
  deleteProgressPhoto: async (progressId: string, photoId: string): Promise<void> => {
    await apiClient.delete(`/production/progress/${progressId}/photos/${photoId}`);
  },

  // ============================================
  // QC (Quality Control)
  // ============================================

  /**
   * Start QC session for a work order
   * POST /production/work-orders/{woId}/qc/start
   */
  startQC: async (woId: string): Promise<QCSession> => {
    const response = await apiClient.post<QCSession>(`/production/work-orders/${woId}/qc/start`);
    if (!response.data) throw new Error("Failed to start QC session");
    return response.data;
  },

  startQCSession: async (woId: string): Promise<QCSession> => {
    return productionService.startQC(woId);
  },

  /**
   * Get a QC session by ID
   * GET /production/qc-sessions/{sessionId}
   */
  getQCSession: async (sessionId: string): Promise<QCSession | null> => {
    const response = await apiClient.get<QCSession>(`/production/qc-sessions/${sessionId}`);
    return response.data || null;
  },

  /**
   * Pass QC
   * POST /production/qc-sessions/{sessionId}/pass
   */
  passQC: async (sessionId: string, notes?: string): Promise<QCSession> => {
    const response = await apiClient.post<QCSession>(`/production/qc-sessions/${sessionId}/pass`, { notes });
    if (!response.data) throw new Error("Failed to pass QC");
    return response.data;
  },

  /**
   * Fail QC
   * POST /production/qc-sessions/{sessionId}/fail
   */
  failQC: async (sessionId: string, notes?: string): Promise<QCSession> => {
    const response = await apiClient.post<QCSession>(`/production/qc-sessions/${sessionId}/fail`, { notes });
    if (!response.data) throw new Error("Failed to fail QC");
    return response.data;
  },

  /**
   * Complete QC (pass or fail) - legacy method
   */
  completeQC: async (sessionId: string, result: QCResultType, notes?: string): Promise<QCSession> => {
    if (result === "pass") {
      return productionService.passQC(sessionId, notes);
    }
    return productionService.failQC(sessionId, notes);
  },

  /**
   * Get QC findings
   * GET /production/qc-sessions/{sessionId}/findings
   */
  getQCFindings: async (sessionId: string): Promise<QCFinding[]> => {
    const response = await apiClient.get<QCFinding[]>(`/production/qc-sessions/${sessionId}/findings`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Add a QC finding
   * POST /production/qc-sessions/{sessionId}/findings
   */
  addQCFinding: async (sessionId: string, data: QCFindingFormData): Promise<QCFinding> => {
    const response = await apiClient.post<QCFinding>(`/production/qc-sessions/${sessionId}/findings`, data);
    if (!response.data) throw new Error("Failed to add QC finding");
    return response.data;
  },

  /**
   * Resolve a QC finding
   * POST /production/qc-findings/{findingId}/resolve
   */
  resolveQCFinding: async (findingId: string, notes?: string): Promise<QCFinding> => {
    const response = await apiClient.post<QCFinding>(`/production/qc-findings/${findingId}/resolve`, { notes });
    if (!response.data) throw new Error("Failed to resolve QC finding");
    return response.data;
  },

  /**
   * Get rework notes for a WO
   * GET /production/work-orders/{woId}/rework-notes
   */
  getReworkNotes: async (woId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/production/work-orders/${woId}/rework-notes`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  /**
   * Get completion status for a WO
   * GET /production/work-orders/{woId}/completion-status
   */
  getCompletionStatus: async (woId: string): Promise<any> => {
    const response = await apiClient.get(`/production/work-orders/${woId}/completion-status`);
    return response.data || {};
  },

  // ============================================
  // STATISTICS / REPORTS
  // ============================================

  getProductionMetrics: async (): Promise<ProductionMetrics> => {
    const response = await apiClient.get<ProductionMetrics>("/dashboard/production-kpis");
    return response.data || { totalWOs: 0, completedWOs: 0, inProgressWOs: 0, qcPendingWOs: 0, onTimeRate: 0, qcFirstPassRate: 0 };
  },

  getWOStatusSummary: async (): Promise<WOStatusSummary[]> => {
    const response = await apiClient.get<WorkOrder[]>("/production/work-orders");
    const responseData = response.data as any;
    const wos: WorkOrder[] = Array.isArray(responseData)
      ? responseData
      : responseData && Array.isArray(responseData.items)
      ? responseData.items
      : [];

    const statusMap = new Map<string, number>();
    wos.forEach(wo => {
      if (!wo.status) return;
      const count = statusMap.get(wo.status) || 0;
      statusMap.set(wo.status, count + 1);
    });

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      status: status as WOStatusType,
      count,
    }));
  },

  getWOsPendingQC: async (): Promise<WorkOrder[]> => {
    const response = await apiClient.get<WorkOrder[]>("/production/work-orders?status=qc_pending");
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getWOsByStatus: async (status: WOStatusType): Promise<WorkOrder[]> => {
    const response = await apiClient.get<WorkOrder[]>(`/production/work-orders?status=${status}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  getWorkOrdersByPlan: async (planId: string): Promise<WorkOrder[]> => {
    const response = await apiClient.get<WorkOrder[]>(`/production/work-orders?plan_id=${planId}`);
    const data = response.data as any;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },

  // Legacy alias
  getAvailableWorkOrders: async (): Promise<WorkOrder[]> => {
    return productionService.getAvailablePlansForWO() as any;
  },

  getActiveQCSession: async (woId: string): Promise<QCSession | null> => {
    // Try to find the active session through the work order
    const wo = await productionService.getWOById(woId);
    if (wo && (wo as any).activeQCSessionId) {
      return productionService.getQCSession((wo as any).activeQCSessionId);
    }
    return null;
  },
};