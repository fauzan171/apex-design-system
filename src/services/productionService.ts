/**
 * Production Service
 * Handles all Work Order (WO) and Quality Control (QC) operations
 * Automatically switches between mock data and real API based on environment
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
  QCNotesRequest,
  ProductionMetrics,
  WOStatusSummary,
} from "@/types/production";
import { WOStatus, WOStepStatus, QCResult, QCSessionStatus, QCFindingStatus } from "@/types/production";
import { apiClient } from "@/lib/apiClient";

// Check if using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// ============================================
// MOCK DATA (for development)
// ============================================

let mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-001",
    woNumber: "WO-2024-0001",
    planId: "plan-001",
    planNumber: "PP-2024-0001",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Electric Motor Type X1",
    quantity: 100,
    quantityCompleted: 45,
    unit: "Unit",
    status: WOStatus.IN_PROGRESS,
    targetDate: "2024-02-10",
    startDate: "2024-01-20",
    steps: [
      { id: "step-001-1", woId: "wo-001", name: "Assembly - Motor Core", sequence: 1, status: WOStepStatus.COMPLETED, startedAt: "2024-01-20T08:00:00Z", completedAt: "2024-01-22T16:00:00Z" },
      { id: "step-001-2", woId: "wo-001", name: "Assembly - Housing", sequence: 2, status: WOStepStatus.IN_PROGRESS, startedAt: "2024-01-23T08:00:00Z" },
      { id: "step-001-3", woId: "wo-001", name: "Testing & Calibration", sequence: 3, status: WOStepStatus.PENDING },
      { id: "step-001-4", woId: "wo-001", name: "Final Assembly", sequence: 4, status: WOStepStatus.PENDING },
    ],
    progress: { id: "prog-001", woId: "wo-001", quantity: 45, notes: "On track", updatedAt: new Date().toISOString() },
    createdBy: "user-001",
    createdAt: "2024-01-18T10:00:00Z",
    releasedAt: "2024-01-20T08:00:00Z",
    releasedBy: "user-002",
  },
  {
    id: "wo-002",
    woNumber: "WO-2024-0002",
    planId: "plan-001",
    planNumber: "PP-2024-0001",
    productId: "prod-002",
    productCode: "MOTOR-X2",
    productName: "Electric Motor Type X2",
    quantity: 50,
    quantityCompleted: 50,
    unit: "Unit",
    status: WOStatus.QC_PASSED,
    targetDate: "2024-02-05",
    startDate: "2024-01-15",
    steps: [
      { id: "step-002-1", woId: "wo-002", name: "Assembly", sequence: 1, status: WOStepStatus.COMPLETED },
      { id: "step-002-2", woId: "wo-002", name: "Testing", sequence: 2, status: WOStepStatus.COMPLETED },
    ],
    progress: { id: "prog-002", woId: "wo-002", quantity: 50, updatedAt: new Date().toISOString() },
    qcSessions: [{ id: "qc-001", woId: "wo-002", status: QCSessionStatus.COMPLETED, result: QCResult.PASS, notes: "All tests passed", createdAt: "2024-01-25T10:00:00Z", qcBy: "user-010", qcByName: "Tono Prasetyo", qcAt: "2024-01-25T14:00:00Z" }],
    createdBy: "user-001",
    createdAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "wo-003",
    woNumber: "WO-2024-0003",
    planId: "plan-003",
    planNumber: "PP-2024-0003",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Electric Motor Type X1",
    quantity: 80,
    unit: "Unit",
    status: WOStatus.RELEASED,
    targetDate: "2024-01-28",
    steps: [{ id: "step-003-1", woId: "wo-003", name: "Assembly", sequence: 1, status: WOStepStatus.PENDING }],
    createdBy: "user-001",
    createdAt: "2024-01-19T11:00:00Z",
    releasedAt: "2024-01-20T09:00:00Z",
  },
  {
    id: "wo-004",
    woNumber: "WO-2024-0004",
    planId: "plan-002",
    planNumber: "PP-2024-0002",
    productId: "prod-003",
    productCode: "GENERATOR-G1",
    productName: "Industrial Generator G1",
    quantity: 25,
    unit: "Unit",
    status: WOStatus.DRAFT,
    targetDate: "2024-02-20",
    steps: [],
    createdBy: "user-001",
    createdAt: "2024-01-20T15:00:00Z",
  },
  {
    id: "wo-005",
    woNumber: "WO-2024-0005",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Electric Motor Type X1",
    quantity: 30,
    quantityCompleted: 30,
    unit: "Unit",
    status: WOStatus.MARKED_QC,
    targetDate: "2024-01-22",
    steps: [],
    progress: { id: "prog-005", woId: "wo-005", quantity: 30, updatedAt: new Date().toISOString() },
    createdBy: "user-001",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "wo-006",
    woNumber: "WO-2024-0006",
    productId: "prod-002",
    productCode: "MOTOR-X2",
    productName: "Electric Motor Type X2",
    quantity: 40,
    quantityCompleted: 40,
    unit: "Unit",
    status: WOStatus.COMPLETED,
    targetDate: "2024-01-18",
    steps: [],
    progress: { id: "prog-006", woId: "wo-006", quantity: 40, updatedAt: new Date().toISOString() },
    qcSessions: [{ id: "qc-002", woId: "wo-006", status: QCSessionStatus.COMPLETED, result: QCResult.PASS, createdAt: "2024-01-17T10:00:00Z" }],
    completedAt: "2024-01-18T16:00:00Z",
    completedBy: "user-008",
    createdBy: "user-001",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "wo-007",
    woNumber: "WO-2024-0007",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Electric Motor Type X1",
    quantity: 20,
    quantityCompleted: 15,
    unit: "Unit",
    status: WOStatus.QC_FAILED,
    targetDate: "2024-01-20",
    steps: [],
    progress: { id: "prog-007", woId: "wo-007", quantity: 15, notes: "5 units failed QC", updatedAt: new Date().toISOString() },
    qcSessions: [{ id: "qc-003", woId: "wo-007", status: QCSessionStatus.COMPLETED, result: QCResult.FAIL, notes: "5 units failed vibration test", findings: [{ id: "finding-001", sessionId: "qc-003", description: "Excessive vibration in 5 units", reworkNotes: "Rebalance motor shaft", status: QCFindingStatus.OPEN, createdAt: "2024-01-19T14:00:00Z" }], createdAt: "2024-01-19T14:00:00Z" }],
    reworkNotes: "Reworking 5 failed units",
    createdBy: "user-001",
    createdAt: "2024-01-12T09:00:00Z",
  },
  {
    id: "wo-008",
    woNumber: "WO-2024-0008",
    productId: "prod-003",
    productCode: "GENERATOR-G1",
    productName: "Industrial Generator G1",
    quantity: 10,
    unit: "Unit",
    status: WOStatus.CANCELLED,
    targetDate: "2024-01-25",
    cancellationReason: "Order cancelled by customer",
    cancelledAt: "2024-01-15T10:00:00Z",
    cancelledBy: "user-002",
    createdBy: "user-001",
    createdAt: "2024-01-13T11:00:00Z",
  },
];

let mockQCSessions: QCSession[] = [];

// ============================================
// PRODUCTION SERVICE
// ============================================

export const productionService = {
  // Work Orders
  getWOs: async (filters?: WOFilters): Promise<WorkOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let wos = [...mockWorkOrders];
      if (filters?.status && filters.status !== "all") wos = wos.filter((wo) => wo.status === filters.status);
      if (filters?.startDate) wos = wos.filter((wo) => wo.createdAt && wo.createdAt >= filters.startDate!);
      if (filters?.endDate) wos = wos.filter((wo) => wo.createdAt && wo.createdAt <= filters.endDate!);
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        wos = wos.filter((wo) => wo.woNumber?.toLowerCase().includes(search) || wo.productCode?.toLowerCase().includes(search) || wo.productName?.toLowerCase().includes(search) || wo.planNumber?.toLowerCase().includes(search));
      }
      if (filters?.productId) wos = wos.filter((wo) => wo.productId === filters.productId);
      if (filters?.planId) wos = wos.filter((wo) => wo.planId === filters.planId);
      return wos.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.productId) params.append("product_id", filters.productId);
    if (filters?.planId) params.append("plan_id", filters.planId);
    const response = await apiClient.get<WorkOrder[]>(`/work-orders?${params.toString()}`);
    return response.data || [];
  },

  getWOById: async (id: string): Promise<WorkOrder | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockWorkOrders.find((wo) => wo.id === id) || null;
    }
    const response = await apiClient.get<WorkOrder>(`/work-orders/${id}`);
    return response.data || null;
  },

  createWO: async (data: WOFormData): Promise<WorkOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const woNumber = `WO-2024-${String(mockWorkOrders.length + 1).padStart(4, "0")}`;
      const newId = `wo-${Date.now()}`;
      const steps: WOStep[] = (data.steps || []).map((step, idx) => ({ id: `step-${newId}-${idx}`, woId: newId, name: step.name, sequence: step.sequence, status: WOStepStatus.PENDING }));
      const newWO: WorkOrder = { id: newId, woNumber, planId: data.plan_id, productId: data.product_id, productCode: data.productCode, productName: data.productName, quantity: data.quantity, unit: "Unit", status: WOStatus.DRAFT, targetDate: data.target_date, notes: data.notes, steps, createdBy: "user-001", createdAt: new Date().toISOString() };
      mockWorkOrders.unshift(newWO);
      return newWO;
    }
    const response = await apiClient.post<WorkOrder>("/work-orders", data);
    if (!response.data) throw new Error("Failed to create work order");
    return response.data;
  },

  updateWO: async (id: string, data: UpdateWORequest): Promise<WorkOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === id);
      if (!wo) throw new Error("Work order not found");
      if (wo.status !== WOStatus.DRAFT) throw new Error("Can only edit draft work orders");
      if (data.target_date) wo.targetDate = data.target_date;
      if (data.notes !== undefined) wo.notes = data.notes;
      return wo;
    }
    const response = await apiClient.put<WorkOrder>(`/work-orders/${id}`, data);
    if (!response.data) throw new Error("Failed to update work order");
    return response.data;
  },

  deleteWO: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockWorkOrders.findIndex((wo) => wo.id === id);
      if (index === -1) throw new Error("Work order not found");
      const wo = mockWorkOrders[index];
      if (wo.status !== WOStatus.DRAFT) throw new Error("Can only delete draft work orders");
      mockWorkOrders.splice(index, 1);
      return;
    }
    await apiClient.delete(`/work-orders/${id}`);
  },

  // Status transitions
  releaseWO: async (id: string): Promise<WorkOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === id);
      if (!wo) throw new Error("Work order not found");
      if (wo.status !== WOStatus.DRAFT && wo.status !== WOStatus.NOT_STARTED) throw new Error("Can only release draft or not started work orders");
      wo.status = WOStatus.RELEASED;
      wo.releasedAt = new Date().toISOString();
      wo.releasedBy = "user-002";
      return wo;
    }
    const response = await apiClient.post<WorkOrder>(`/work-orders/${id}/release`);
    if (!response.data) throw new Error("Failed to release work order");
    return response.data;
  },

  startWO: async (id: string): Promise<WorkOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === id);
      if (!wo) throw new Error("Work order not found");
      if (wo.status !== WOStatus.RELEASED) throw new Error("Can only start released work orders");
      wo.status = WOStatus.IN_PROGRESS;
      wo.startDate = new Date().toISOString().split("T")[0];
      if (wo.steps && wo.steps.length > 0) { wo.steps[0].status = WOStepStatus.IN_PROGRESS; wo.steps[0].startedAt = new Date().toISOString(); }
      return wo;
    }
    const response = await apiClient.post<WorkOrder>(`/work-orders/${id}/start`);
    if (!response.data) throw new Error("Failed to start work order");
    return response.data;
  },

  markForQC: async (id: string): Promise<WorkOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === id);
      if (!wo) throw new Error("Work order not found");
      if (wo.status !== WOStatus.IN_PROGRESS) throw new Error("Can only mark in-progress work orders for QC");
      wo.status = WOStatus.MARKED_QC;
      return wo;
    }
    const response = await apiClient.post<WorkOrder>(`/work-orders/${id}/mark-qc`);
    if (!response.data) throw new Error("Failed to mark work order for QC");
    return response.data;
  },

  completeWO: async (id: string): Promise<WorkOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === id);
      if (!wo) throw new Error("Work order not found");
      if (wo.status !== WOStatus.QC_PASSED) throw new Error("Can only complete QC-passed work orders");
      wo.status = WOStatus.COMPLETED;
      wo.completedAt = new Date().toISOString();
      wo.completedBy = "user-008";
      return wo;
    }
    const response = await apiClient.post<WorkOrder>(`/work-orders/${id}/complete`);
    if (!response.data) throw new Error("Failed to complete work order");
    return response.data;
  },

  cancelWO: async (id: string, data: CancelWORequest): Promise<WorkOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === id);
      if (!wo) throw new Error("Work order not found");
      if (wo.status === WOStatus.COMPLETED || wo.status === WOStatus.CANCELLED) throw new Error("Cannot cancel completed or already cancelled work orders");
      wo.status = WOStatus.CANCELLED;
      wo.cancellationReason = data.reason;
      wo.cancelledAt = new Date().toISOString();
      wo.cancelledBy = "user-002";
      return wo;
    }
    const response = await apiClient.post<WorkOrder>(`/work-orders/${id}/cancel`, data);
    if (!response.data) throw new Error("Failed to cancel work order");
    return response.data;
  },

  // Progress
  updateProgress: async (id: string, data: ProgressUpdateFormData): Promise<WOProgress> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === id);
      if (!wo) throw new Error("Work order not found");
      if (wo.status !== WOStatus.IN_PROGRESS) throw new Error("Can only update progress on in-progress work orders");
      if (data.stepId && wo.steps) {
        const step = wo.steps.find((s) => s.id === data.stepId);
        if (step && step.status === WOStepStatus.PENDING) { step.status = WOStepStatus.IN_PROGRESS; step.startedAt = new Date().toISOString(); }
      }
      const progress: WOProgress = { id: `prog-${id}`, woId: id, currentStepId: data.stepId, quantity: data.quantity, notes: data.notes, updatedAt: new Date().toISOString() };
      wo.progress = progress;
      wo.quantityCompleted = data.quantity;
      return progress;
    }
    const response = await apiClient.post<WOProgress>(`/work-orders/${id}/progress`, data);
    if (!response.data) throw new Error("Failed to update progress");
    return response.data;
  },

  completeStep: async (woId: string, stepId: string): Promise<WOStep> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === woId);
      if (!wo) throw new Error("Work order not found");
      const step = wo.steps?.find((s) => s.id === stepId);
      if (!step) throw new Error("Step not found");
      step.status = WOStepStatus.COMPLETED;
      step.completedAt = new Date().toISOString();
      const nextStep = wo.steps?.find((s) => s.sequence === (step.sequence || 0) + 1);
      if (nextStep) { nextStep.status = WOStepStatus.IN_PROGRESS; nextStep.startedAt = new Date().toISOString(); }
      return step;
    }
    const response = await apiClient.post<WOStep>(`/work-orders/${woId}/steps/${stepId}/complete`);
    if (!response.data) throw new Error("Failed to complete step");
    return response.data;
  },

  // QC
  startQC: async (woId: string): Promise<QCSession> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === woId);
      if (!wo) throw new Error("Work order not found");
      if (wo.status !== WOStatus.MARKED_QC && wo.status !== WOStatus.QC) throw new Error("Work order is not marked for QC");
      wo.status = WOStatus.QC_IN_PROGRESS;
      const session: QCSession = { id: `qc-${Date.now()}`, woId, status: QCSessionStatus.IN_PROGRESS, result: QCResult.PENDING, createdAt: new Date().toISOString(), qcBy: "user-010", qcByName: "Tono Prasetyo" };
      wo.qcSessions = wo.qcSessions || [];
      wo.qcSessions.push(session);
      mockQCSessions.push(session);
      return session;
    }
    const response = await apiClient.post<QCSession>(`/work-orders/${woId}/qc/start`);
    if (!response.data) throw new Error("Failed to start QC session");
    return response.data;
  },

  getActiveQCSession: async (woId: string): Promise<QCSession | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === woId);
      if (!wo || !wo.qcSessions) return null;
      return wo.qcSessions.find((s) => s.status === QCSessionStatus.IN_PROGRESS) || null;
    }
    const response = await apiClient.get<QCSession>(`/work-orders/${woId}/qc/active`);
    return response.data || null;
  },

  completeQC: async (sessionId: string, result: QCResultType, notes?: string): Promise<QCSession> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const session = mockQCSessions.find((s) => s.id === sessionId);
      if (!session) throw new Error("QC session not found");
      session.status = QCSessionStatus.COMPLETED;
      session.result = result;
      session.notes = notes;
      session.updatedAt = new Date().toISOString();
      const wo = mockWorkOrders.find((w) => w.id === session.woId);
      if (wo) wo.status = result === QCResult.PASS ? WOStatus.QC_PASSED : WOStatus.QC_FAILED;
      return session;
    }
    const response = await apiClient.post<QCSession>(`/qc-sessions/${sessionId}/complete`, { result, notes });
    if (!response.data) throw new Error("Failed to complete QC session");
    return response.data;
  },

  addQCFinding: async (sessionId: string, data: QCFindingFormData): Promise<QCFinding> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const session = mockQCSessions.find((s) => s.id === sessionId);
      if (!session) throw new Error("QC session not found");
      const finding: QCFinding = { id: `finding-${Date.now()}`, sessionId, description: data.description, reworkNotes: data.reworkNotes, status: QCFindingStatus.OPEN, createdAt: new Date().toISOString() };
      session.findings = session.findings || [];
      session.findings.push(finding);
      return finding;
    }
    const response = await apiClient.post<QCFinding>(`/qc-sessions/${sessionId}/findings`, data);
    if (!response.data) throw new Error("Failed to add QC finding");
    return response.data;
  },

  resolveQCFinding: async (findingId: string, notes?: string): Promise<QCFinding> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let finding: QCFinding | undefined;
      for (const session of mockQCSessions) { finding = session.findings?.find((f) => f.id === findingId); if (finding) break; }
      if (!finding) throw new Error("QC finding not found");
      finding.status = QCFindingStatus.RESOLVED;
      finding.reworkNotes = notes || finding.reworkNotes;
      finding.resolvedAt = new Date().toISOString();
      return finding;
    }
    const response = await apiClient.post<QCFinding>(`/qc-findings/${findingId}/resolve`, { notes });
    if (!response.data) throw new Error("Failed to resolve QC finding");
    return response.data;
  },

  // Reports
  getProductionMetrics: async (): Promise<ProductionMetrics> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { totalWOs: mockWorkOrders.length, completedWOs: mockWorkOrders.filter((wo) => wo.status === WOStatus.COMPLETED).length, inProgressWOs: mockWorkOrders.filter((wo) => wo.status === WOStatus.IN_PROGRESS).length, qcPendingWOs: mockWorkOrders.filter((wo) => [WOStatus.MARKED_QC, WOStatus.QC_IN_PROGRESS, WOStatus.QC, WOStatus.QC_PASSED, WOStatus.QC_FAILED].includes(wo.status || WOStatus.DRAFT)).length, onTimeRate: 85, qcFirstPassRate: 92 };
    }
    const response = await apiClient.get<ProductionMetrics>("/reports/production-metrics");
    return response.data || { totalWOs: 0, completedWOs: 0, inProgressWOs: 0, qcPendingWOs: 0, onTimeRate: 0, qcFirstPassRate: 0 };
  },

  getWOStatusSummary: async (): Promise<WOStatusSummary[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const summary: Partial<Record<WOStatusType, number>> = {};
      mockWorkOrders.forEach((wo) => { if (wo.status) summary[wo.status] = (summary[wo.status] || 0) + 1; });
      return Object.entries(summary).map(([status, count]) => ({ status: status as WOStatusType, count: count || 0 }));
    }
    const response = await apiClient.get<WOStatusSummary[]>("/reports/wo-status-summary");
    return response.data || [];
  },

  getWOsPendingQC: async (): Promise<WorkOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockWorkOrders.filter((wo) => wo.status === WOStatus.MARKED_QC || wo.status === WOStatus.QC);
    }
    const response = await apiClient.get<WorkOrder[]>("/work-orders/pending-qc");
    return response.data || [];
  },

  getWOsByStatus: async (status: WOStatusType): Promise<WorkOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockWorkOrders.filter((wo) => wo.status === status);
    }
    const response = await apiClient.get<WorkOrder[]>(`/work-orders?status=${status}`);
    return response.data || [];
  },

  getWorkOrdersByPlan: async (planId: string): Promise<WorkOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockWorkOrders.filter((wo) => wo.planId === planId);
    }
    const response = await apiClient.get<WorkOrder[]>(`/work-orders?plan_id=${planId}`);
    return response.data || [];
  },

  getAvailableWorkOrders: async (): Promise<WorkOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockWorkOrders.filter((wo) => wo.status === WOStatus.RELEASED || wo.status === WOStatus.IN_PROGRESS);
    }
    const response = await apiClient.get<WorkOrder[]>("/work-orders/available");
    return response.data || [];
  },

  getWorkOrderProgress: async (woId: string): Promise<WOProgress | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const wo = mockWorkOrders.find((w) => w.id === woId);
      return wo?.progress || null;
    }
    const response = await apiClient.get<WOProgress>(`/work-orders/${woId}/progress`);
    return response.data || null;
  },

  getQCFindings: async (sessionId: string): Promise<QCFinding[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const session = mockQCSessions.find((s) => s.id === sessionId);
      return session?.findings || [];
    }
    const response = await apiClient.get<QCFinding[]>(`/qc-sessions/${sessionId}/findings`);
    return response.data || [];
  },

  startQCSession: async (woId: string): Promise<QCSession> => {
    return productionService.startQC(woId);
  },
};