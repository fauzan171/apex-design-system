/**
 * Production Module Mock Data
 * Based on PRD-06-PRODUCTION.md
 *
 * This data is for frontend development and QA testing.
 * Will be replaced with API calls in production.
 */

import type {
  WorkOrder,
  WOStep,
  WOProgress,
  ProgressPhoto,
  QCSession,
  WOStatusSummary,
  ProductionMetrics,
} from "@/types/production";
import {
  WOStatus,
  WOStepStatus,
  QCResult,
  QCFindingStatus,
  canWOTransitionTo,
} from "@/types/production";

// ============================================
// WORK ORDERS
// ============================================

export const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-001",
    woNumber: "WO-2024-0001",
    planId: "plan-001",
    planNumber: "PP-2024-0001",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Motor Electric X1",
    quantity: 100,
    status: WOStatus.COMPLETED,
    startDate: "2024-01-20",
    targetDate: "2024-01-25",
    endDate: "2024-01-24",
    steps: [
      {
        id: "step-001-1",
        woId: "wo-001",
        sequence: 1,
        operationName: "Winding",
        estimatedTime: 30,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-20T08:00:00Z",
        actualEnd: "2024-01-20T12:00:00Z",
      },
      {
        id: "step-001-2",
        woId: "wo-001",
        sequence: 2,
        operationName: "Assembly Base",
        estimatedTime: 20,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-20T13:00:00Z",
        actualEnd: "2024-01-20T16:00:00Z",
      },
      {
        id: "step-001-3",
        woId: "wo-001",
        sequence: 3,
        operationName: "Install Bearing",
        estimatedTime: 15,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-21T08:00:00Z",
        actualEnd: "2024-01-21T11:00:00Z",
      },
      {
        id: "step-001-4",
        woId: "wo-001",
        sequence: 4,
        operationName: "Final Assembly",
        estimatedTime: 25,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-21T13:00:00Z",
        actualEnd: "2024-01-22T10:00:00Z",
      },
      {
        id: "step-001-5",
        woId: "wo-001",
        sequence: 5,
        operationName: "Testing",
        estimatedTime: 10,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-22T11:00:00Z",
        actualEnd: "2024-01-22T14:00:00Z",
      },
    ],
    progress: [
      {
        id: "prog-001-1",
        woId: "wo-001",
        stepId: "step-001-1",
        quantityDone: 100,
        notes: "All units completed",
        photos: [
          {
            id: "photo-001-1",
            progressId: "prog-001-1",
            filePath: "/photos/winding-001.jpg",
            caption: "Winding completed",
            uploadedAt: "2024-01-20T12:00:00Z",
            uploadedBy: "user-003",
            uploadedByName: "Cahyo Operator",
          },
        ],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-20T12:00:00Z",
      },
      {
        id: "prog-001-2",
        woId: "wo-001",
        stepId: "step-001-2",
        quantityDone: 100,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-20T16:00:00Z",
      },
      {
        id: "prog-001-3",
        woId: "wo-001",
        stepId: "step-001-3",
        quantityDone: 100,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-21T11:00:00Z",
      },
      {
        id: "prog-001-4",
        woId: "wo-001",
        stepId: "step-001-4",
        quantityDone: 100,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-22T10:00:00Z",
      },
      {
        id: "prog-001-5",
        woId: "wo-001",
        stepId: "step-001-5",
        quantityDone: 100,
        photos: [
          {
            id: "photo-001-5",
            progressId: "prog-001-5",
            filePath: "/photos/testing-001.jpg",
            caption: "Testing passed",
            uploadedAt: "2024-01-22T14:00:00Z",
            uploadedBy: "user-003",
            uploadedByName: "Cahyo Operator",
          },
        ],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-22T14:00:00Z",
      },
    ],
    qcSessions: [
      {
        id: "qc-001",
        woId: "wo-001",
        qcBy: "user-005",
        qcByName: "Eko QC",
        qcAt: "2024-01-23T09:00:00Z",
        result: QCResult.PASS,
        findings: [],
      },
    ],
    createdBy: "user-004",
    createdByName: "Dedi Supervisor",
    createdAt: "2024-01-19T10:00:00Z",
    releasedAt: "2024-01-20T07:00:00Z",
    releasedBy: "user-004",
    completedAt: "2024-01-24T10:00:00Z",
    completedBy: "user-005",
  },
  {
    id: "wo-002",
    woNumber: "WO-2024-0002",
    planId: "plan-001",
    planNumber: "PP-2024-0001",
    productId: "prod-002",
    productCode: "MOTOR-X2",
    productName: "Motor Electric X2",
    quantity: 50,
    status: WOStatus.IN_PROGRESS,
    startDate: "2024-01-22",
    targetDate: "2024-01-28",
    steps: [
      {
        id: "step-002-1",
        woId: "wo-002",
        sequence: 1,
        operationName: "Winding",
        estimatedTime: 30,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-22T08:00:00Z",
        actualEnd: "2024-01-22T11:00:00Z",
      },
      {
        id: "step-002-2",
        woId: "wo-002",
        sequence: 2,
        operationName: "Assembly Base",
        estimatedTime: 20,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-22T13:00:00Z",
        actualEnd: "2024-01-22T15:00:00Z",
      },
      {
        id: "step-002-3",
        woId: "wo-002",
        sequence: 3,
        operationName: "Install Bearing",
        estimatedTime: 15,
        status: WOStepStatus.IN_PROGRESS,
        actualStart: "2024-01-23T08:00:00Z",
      },
      {
        id: "step-002-4",
        woId: "wo-002",
        sequence: 4,
        operationName: "Final Assembly",
        estimatedTime: 25,
        status: WOStepStatus.PENDING,
      },
      {
        id: "step-002-5",
        woId: "wo-002",
        sequence: 5,
        operationName: "Testing",
        estimatedTime: 10,
        status: WOStepStatus.PENDING,
      },
    ],
    progress: [
      {
        id: "prog-002-1",
        woId: "wo-002",
        stepId: "step-002-1",
        quantityDone: 50,
        photos: [
          {
            id: "photo-002-1",
            progressId: "prog-002-1",
            filePath: "/photos/winding-002.jpg",
            uploadedAt: "2024-01-22T11:00:00Z",
            uploadedBy: "user-003",
            uploadedByName: "Cahyo Operator",
          },
        ],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-22T11:00:00Z",
      },
      {
        id: "prog-002-2",
        woId: "wo-002",
        stepId: "step-002-2",
        quantityDone: 50,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-22T15:00:00Z",
      },
      {
        id: "prog-002-3",
        woId: "wo-002",
        stepId: "step-002-3",
        quantityDone: 30,
        notes: "20 more units to go",
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-23T12:00:00Z",
      },
    ],
    qcSessions: [],
    createdBy: "user-004",
    createdByName: "Dedi Supervisor",
    createdAt: "2024-01-21T10:00:00Z",
    releasedAt: "2024-01-22T07:00:00Z",
    releasedBy: "user-004",
  },
  {
    id: "wo-003",
    woNumber: "WO-2024-0003",
    planId: "plan-002",
    planNumber: "PP-2024-0002",
    productId: "prod-003",
    productCode: "GEN-5KVA",
    productName: "Generator 5KVA",
    quantity: 25,
    status: WOStatus.QC,
    startDate: "2024-01-18",
    targetDate: "2024-01-25",
    steps: [
      {
        id: "step-003-1",
        woId: "wo-003",
        sequence: 1,
        operationName: "Frame Assembly",
        estimatedTime: 45,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-18T08:00:00Z",
        actualEnd: "2024-01-18T14:00:00Z",
      },
      {
        id: "step-003-2",
        woId: "wo-003",
        sequence: 2,
        operationName: "Engine Installation",
        estimatedTime: 60,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-19T08:00:00Z",
        actualEnd: "2024-01-19T16:00:00Z",
      },
      {
        id: "step-003-3",
        woId: "wo-003",
        sequence: 3,
        operationName: "Electrical Wiring",
        estimatedTime: 40,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-20T08:00:00Z",
        actualEnd: "2024-01-20T14:00:00Z",
      },
      {
        id: "step-003-4",
        woId: "wo-003",
        sequence: 4,
        operationName: "Testing & QC",
        estimatedTime: 30,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-21T08:00:00Z",
        actualEnd: "2024-01-21T12:00:00Z",
      },
    ],
    progress: [
      {
        id: "prog-003-1",
        woId: "wo-003",
        stepId: "step-003-1",
        quantityDone: 25,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-18T14:00:00Z",
      },
      {
        id: "prog-003-2",
        woId: "wo-003",
        stepId: "step-003-2",
        quantityDone: 25,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-19T16:00:00Z",
      },
      {
        id: "prog-003-3",
        woId: "wo-003",
        stepId: "step-003-3",
        quantityDone: 25,
        photos: [
          {
            id: "photo-003-3",
            progressId: "prog-003-3",
            filePath: "/photos/wiring-003.jpg",
            caption: "Wiring completed",
            uploadedAt: "2024-01-20T14:00:00Z",
            uploadedBy: "user-003",
            uploadedByName: "Cahyo Operator",
          },
        ],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-20T14:00:00Z",
      },
      {
        id: "prog-003-4",
        woId: "wo-003",
        stepId: "step-003-4",
        quantityDone: 25,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-21T12:00:00Z",
      },
    ],
    qcSessions: [],
    createdBy: "user-004",
    createdByName: "Dedi Supervisor",
    createdAt: "2024-01-17T10:00:00Z",
    releasedAt: "2024-01-18T07:00:00Z",
    releasedBy: "user-004",
  },
  {
    id: "wo-004",
    woNumber: "WO-2024-0004",
    planId: "plan-002",
    planNumber: "PP-2024-0002",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Motor Electric X1",
    quantity: 75,
    status: WOStatus.IN_PROGRESS,
    startDate: "2024-01-24",
    targetDate: "2024-01-30",
    reworkNotes: "Perbaiki goresan pada housing unit 10-15",
    steps: [
      {
        id: "step-004-1",
        woId: "wo-004",
        sequence: 1,
        operationName: "Winding",
        estimatedTime: 30,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-24T08:00:00Z",
        actualEnd: "2024-01-24T14:00:00Z",
      },
      {
        id: "step-004-2",
        woId: "wo-004",
        sequence: 2,
        operationName: "Assembly Base",
        estimatedTime: 20,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-24T15:00:00Z",
        actualEnd: "2024-01-24T18:00:00Z",
      },
      {
        id: "step-004-3",
        woId: "wo-004",
        sequence: 3,
        operationName: "Install Bearing",
        estimatedTime: 15,
        status: WOStepStatus.DONE,
        actualStart: "2024-01-25T08:00:00Z",
        actualEnd: "2024-01-25T11:00:00Z",
      },
      {
        id: "step-004-4",
        woId: "wo-004",
        sequence: 4,
        operationName: "Final Assembly",
        estimatedTime: 25,
        status: WOStepStatus.IN_PROGRESS,
        actualStart: "2024-01-25T13:00:00Z",
      },
      {
        id: "step-004-5",
        woId: "wo-004",
        sequence: 5,
        operationName: "Testing",
        estimatedTime: 10,
        status: WOStepStatus.PENDING,
      },
    ],
    progress: [
      {
        id: "prog-004-1",
        woId: "wo-004",
        stepId: "step-004-1",
        quantityDone: 75,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-24T14:00:00Z",
      },
      {
        id: "prog-004-2",
        woId: "wo-004",
        stepId: "step-004-2",
        quantityDone: 75,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-24T18:00:00Z",
      },
      {
        id: "prog-004-3",
        woId: "wo-004",
        stepId: "step-004-3",
        quantityDone: 75,
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-25T11:00:00Z",
      },
      {
        id: "prog-004-4",
        woId: "wo-004",
        stepId: "step-004-4",
        quantityDone: 45,
        notes: "Rework in progress for units 10-15",
        photos: [],
        createdBy: "user-003",
        createdByName: "Cahyo Operator",
        createdAt: "2024-01-25T16:00:00Z",
      },
    ],
    qcSessions: [
      {
        id: "qc-004",
        woId: "wo-004",
        qcBy: "user-005",
        qcByName: "Eko QC",
        qcAt: "2024-01-25T10:00:00Z",
        result: QCResult.FAIL,
        findings: [
          {
            id: "finding-004-1",
            qcSessionId: "qc-004",
            description: "Scratches on housing",
            reworkNotes: "Repolish affected area on units 10-15",
            status: QCFindingStatus.OPEN,
            photos: [
              {
                id: "photo-finding-004-1",
                findingId: "finding-004-1",
                filePath: "/photos/scratch-004.jpg",
                uploadedAt: "2024-01-25T10:00:00Z",
              },
            ],
            createdAt: "2024-01-25T10:00:00Z",
          },
        ],
      },
    ],
    createdBy: "user-004",
    createdByName: "Dedi Supervisor",
    createdAt: "2024-01-23T10:00:00Z",
    releasedAt: "2024-01-24T07:00:00Z",
    releasedBy: "user-004",
  },
  {
    id: "wo-005",
    woNumber: "WO-2024-0005",
    planId: "plan-003",
    planNumber: "PP-2024-0003",
    productId: "prod-002",
    productCode: "MOTOR-X2",
    productName: "Motor Electric X2",
    quantity: 200,
    status: WOStatus.RELEASED,
    targetDate: "2024-02-05",
    steps: [
      {
        id: "step-005-1",
        woId: "wo-005",
        sequence: 1,
        operationName: "Winding",
        estimatedTime: 30,
        status: WOStepStatus.PENDING,
      },
      {
        id: "step-005-2",
        woId: "wo-005",
        sequence: 2,
        operationName: "Assembly Base",
        estimatedTime: 20,
        status: WOStepStatus.PENDING,
      },
      {
        id: "step-005-3",
        woId: "wo-005",
        sequence: 3,
        operationName: "Install Bearing",
        estimatedTime: 15,
        status: WOStepStatus.PENDING,
      },
      {
        id: "step-005-4",
        woId: "wo-005",
        sequence: 4,
        operationName: "Final Assembly",
        estimatedTime: 25,
        status: WOStepStatus.PENDING,
      },
      {
        id: "step-005-5",
        woId: "wo-005",
        sequence: 5,
        operationName: "Testing",
        estimatedTime: 10,
        status: WOStepStatus.PENDING,
      },
    ],
    progress: [],
    qcSessions: [],
    createdBy: "user-004",
    createdByName: "Dedi Supervisor",
    createdAt: "2024-01-25T10:00:00Z",
    releasedAt: "2024-01-25T14:00:00Z",
    releasedBy: "user-004",
  },
  {
    id: "wo-006",
    woNumber: "WO-2024-0006",
    planId: "plan-003",
    planNumber: "PP-2024-0003",
    productId: "prod-003",
    productCode: "GEN-5KVA",
    productName: "Generator 5KVA",
    quantity: 30,
    status: WOStatus.DRAFT,
    targetDate: "2024-02-10",
    steps: [
      {
        id: "step-006-1",
        woId: "wo-006",
        sequence: 1,
        operationName: "Frame Assembly",
        estimatedTime: 45,
        status: WOStepStatus.PENDING,
      },
      {
        id: "step-006-2",
        woId: "wo-006",
        sequence: 2,
        operationName: "Engine Installation",
        estimatedTime: 60,
        status: WOStepStatus.PENDING,
      },
      {
        id: "step-006-3",
        woId: "wo-006",
        sequence: 3,
        operationName: "Electrical Wiring",
        estimatedTime: 40,
        status: WOStepStatus.PENDING,
      },
    ],
    progress: [],
    qcSessions: [],
    createdBy: "user-004",
    createdByName: "Dedi Supervisor",
    createdAt: "2024-01-26T10:00:00Z",
  },
  {
    id: "wo-007",
    woNumber: "WO-2024-0007",
    planId: "plan-004",
    planNumber: "PP-2024-0004",
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Motor Electric X1",
    quantity: 150,
    status: WOStatus.CANCELLED,
    targetDate: "2024-02-01",
    steps: [],
    progress: [],
    qcSessions: [],
    createdBy: "user-004",
    createdByName: "Dedi Supervisor",
    createdAt: "2024-01-20T10:00:00Z",
    cancelledAt: "2024-01-21T09:00:00Z",
    cancelledBy: "user-004",
    cancellationReason: "Plan changed by customer",
  },
];

// ============================================
// SERVICE FUNCTIONS
// ============================================

export const productionService = {
  /**
   * Get all work orders with optional filters
   */
  getWOs: async (filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<WorkOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let wos = [...mockWorkOrders];

    if (filters?.status && filters.status !== "all") {
      wos = wos.filter((wo) => wo.status === filters.status);
    }

    if (filters?.dateFrom) {
      wos = wos.filter((wo) => wo.targetDate >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      wos = wos.filter((wo) => wo.targetDate <= filters.dateTo!);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      wos = wos.filter(
        (wo) =>
          wo.woNumber.toLowerCase().includes(search) ||
          wo.productName.toLowerCase().includes(search) ||
          wo.planNumber?.toLowerCase().includes(search)
      );
    }

    return wos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  /**
   * Get a single work order by ID
   */
  getWOById: async (id: string): Promise<WorkOrder | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockWorkOrders.find((wo) => wo.id === id) || null;
  },

  /**
   * Create a new work order
   */
  createWO: async (data: {
    planId: string;
    planNumber: string;
    productId: string;
    productCode: string;
    productName: string;
    quantity: number;
    targetDate: string;
    notes?: string;
    steps: {
      operationName: string;
      estimatedTime: number;
      sequence: number;
    }[];
  }): Promise<WorkOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const woNumber = `WO-2024-${String(mockWorkOrders.length + 1).padStart(4, "0")}`;
    const newId = `wo-${Date.now()}`;

    const steps: WOStep[] = data.steps.map((step, idx) => ({
      id: `step-${newId}-${idx}`,
      woId: newId,
      sequence: step.sequence,
      operationName: step.operationName,
      estimatedTime: step.estimatedTime,
      status: WOStepStatus.PENDING,
    }));

    const newWO: WorkOrder = {
      id: newId,
      woNumber,
      planId: data.planId,
      planNumber: data.planNumber,
      productId: data.productId,
      productCode: data.productCode,
      productName: data.productName,
      quantity: data.quantity,
      status: WOStatus.DRAFT,
      targetDate: data.targetDate,
      steps,
      progress: [],
      qcSessions: [],
      createdBy: "user-004",
      createdByName: "Dedi Supervisor",
      createdAt: new Date().toISOString(),
    };

    mockWorkOrders.unshift(newWO);
    return newWO;
  },

  /**
   * Update WO (only Draft status)
   */
  updateWO: async (
    id: string,
    data: {
      targetDate?: string;
      notes?: string;
      steps?: {
        id?: string;
        operationName: string;
        estimatedTime: number;
        sequence: number;
      }[];
    }
  ): Promise<WorkOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const wo = mockWorkOrders.find((w) => w.id === id);
    if (!wo) throw new Error("WO not found");
    if (wo.status !== WOStatus.DRAFT) throw new Error("Can only edit Draft WO");

    if (data.targetDate) wo.targetDate = data.targetDate;

    if (data.steps) {
      wo.steps = data.steps.map((step, idx) => ({
        id: step.id || `step-${id}-${idx}`,
        woId: id,
        sequence: step.sequence,
        operationName: step.operationName,
        estimatedTime: step.estimatedTime,
        status: WOStepStatus.PENDING,
      }));
    }

    return wo;
  },

  /**
   * Delete WO (only Draft status)
   */
  deleteWO: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockWorkOrders.findIndex((wo) => wo.id === id);
    if (index === -1) throw new Error("WO not found");

    const wo = mockWorkOrders[index];
    if (wo.status !== WOStatus.DRAFT) throw new Error("Can only delete Draft WO");

    mockWorkOrders.splice(index, 1);
  },

  /**
   * Update WO status
   */
  updateWOStatus: async (
    id: string,
    newStatus: WOStatus,
    notes?: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const wo = mockWorkOrders.find((w) => w.id === id);
    if (!wo) throw new Error("WO not found");

    // Validate transition
    const allowedTransitions = canWOTransitionTo[wo.status];
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(`Cannot transition from ${wo.status} to ${newStatus}`);
    }

    wo.status = newStatus;

    if (newStatus === WOStatus.RELEASED) {
      wo.releasedAt = new Date().toISOString();
      wo.releasedBy = "user-004";
    }

    if (newStatus === WOStatus.IN_PROGRESS && !wo.startDate) {
      wo.startDate = new Date().toISOString().split("T")[0];
    }

    if (newStatus === WOStatus.COMPLETED) {
      wo.completedAt = new Date().toISOString();
      wo.completedBy = "user-005";
      wo.endDate = new Date().toISOString().split("T")[0];
    }

    if (newStatus === WOStatus.CANCELLED) {
      wo.cancelledAt = new Date().toISOString();
      wo.cancelledBy = "user-004";
      wo.cancellationReason = notes;
    }
  },

  /**
   * Release WO
   */
  releaseWO: async (id: string): Promise<void> => {
    await productionService.updateWOStatus(id, WOStatus.RELEASED);
  },

  /**
   * Start WO
   */
  startWO: async (id: string): Promise<void> => {
    await productionService.updateWOStatus(id, WOStatus.IN_PROGRESS);
  },

  /**
   * Cancel WO
   */
  cancelWO: async (id: string, reason?: string): Promise<void> => {
    await productionService.updateWOStatus(id, WOStatus.CANCELLED, reason);
  },

  /**
   * Mark WO for QC
   */
  markForQC: async (id: string): Promise<void> => {
    await productionService.updateWOStatus(id, WOStatus.QC);
  },

  /**
   * Update step progress
   */
  updateStepProgress: async (
    woId: string,
    stepId: string,
    data: {
      quantityDone: number;
      notes?: string;
      photos?: File[];
      captions?: string[];
    }
  ): Promise<WOProgress> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const wo = mockWorkOrders.find((w) => w.id === woId);
    if (!wo) throw new Error("WO not found");

    const step = wo.steps.find((s) => s.id === stepId);
    if (!step) throw new Error("Step not found");

    // Update step status
    if (step.status === WOStepStatus.PENDING) {
      step.status = WOStepStatus.IN_PROGRESS;
      step.actualStart = new Date().toISOString();
    }

    if (data.quantityDone >= wo.quantity) {
      step.status = WOStepStatus.DONE;
      step.actualEnd = new Date().toISOString();
    }

    const progressPhotos: ProgressPhoto[] =
      data.photos?.map((file, idx) => ({
        id: `photo-${Date.now()}-${idx}`,
        progressId: `prog-${woId}-${stepId}`,
        filePath: URL.createObjectURL(file),
        caption: data.captions?.[idx],
        uploadedAt: new Date().toISOString(),
        uploadedBy: "user-003",
        uploadedByName: "Cahyo Operator",
      })) || [];

    const progress: WOProgress = {
      id: `prog-${woId}-${stepId}-${Date.now()}`,
      woId,
      stepId,
      quantityDone: data.quantityDone,
      notes: data.notes,
      photos: progressPhotos,
      createdBy: "user-003",
      createdByName: "Cahyo Operator",
      createdAt: new Date().toISOString(),
    };

    wo.progress.push(progress);

    return progress;
  },

  /**
   * Submit QC result
   */
  submitQC: async (
    woId: string,
    data: {
      result: QCResult;
      findings: {
        description: string;
        reworkNotes: string;
        photos?: File[];
      }[];
    }
  ): Promise<QCSession> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const wo = mockWorkOrders.find((w) => w.id === woId);
    if (!wo) throw new Error("WO not found");

    const qcSession: QCSession = {
      id: `qc-${Date.now()}`,
      woId,
      qcBy: "user-005",
      qcByName: "Eko QC",
      qcAt: new Date().toISOString(),
      result: data.result,
      findings: data.findings.map((finding, idx) => ({
        id: `finding-${Date.now()}-${idx}`,
        qcSessionId: `qc-${Date.now()}`,
        description: finding.description,
        reworkNotes: finding.reworkNotes,
        status: QCFindingStatus.OPEN,
        photos:
          finding.photos?.map((file, pidx) => ({
            id: `finding-photo-${Date.now()}-${idx}-${pidx}`,
            findingId: `finding-${Date.now()}-${idx}`,
            filePath: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
          })) || [],
        createdAt: new Date().toISOString(),
      })),
    };

    wo.qcSessions.push(qcSession);

    if (data.result === QCResult.PASS) {
      wo.status = WOStatus.COMPLETED;
      wo.completedAt = new Date().toISOString();
      wo.completedBy = "user-005";
      wo.endDate = new Date().toISOString().split("T")[0];
    } else {
      wo.status = WOStatus.IN_PROGRESS;
      wo.reworkNotes = data.findings.map((f) => f.reworkNotes).join("; ");
    }

    return qcSession;
  },

  /**
   * Get WO status summary
   */
  getWOStatusSummary: async (): Promise<WOStatusSummary[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const summary: Record<WOStatus, number> = {
      [WOStatus.DRAFT]: 0,
      [WOStatus.RELEASED]: 0,
      [WOStatus.IN_PROGRESS]: 0,
      [WOStatus.QC]: 0,
      [WOStatus.COMPLETED]: 0,
      [WOStatus.CANCELLED]: 0,
    };

    mockWorkOrders.forEach((wo) => {
      summary[wo.status]++;
    });

    return Object.entries(summary).map(([status, count]) => ({
      status: status as WOStatus,
      count,
    }));
  },

  /**
   * Get production metrics
   */
  getProductionMetrics: async (): Promise<ProductionMetrics> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const totalWOs = mockWorkOrders.filter(
      (wo) => wo.status !== WOStatus.CANCELLED
    ).length;
    const completedWOs = mockWorkOrders.filter(
      (wo) => wo.status === WOStatus.COMPLETED
    ).length;
    const inProgressWOs = mockWorkOrders.filter(
      (wo) => wo.status === WOStatus.IN_PROGRESS
    ).length;
    const qcPendingWOs = mockWorkOrders.filter(
      (wo) => wo.status === WOStatus.QC
    ).length;

    // Calculate on-time rate
    const completed = mockWorkOrders.filter(
      (wo) => wo.status === WOStatus.COMPLETED && wo.endDate && wo.targetDate
    );
    const onTime = completed.filter(
      (wo) => wo.endDate! <= wo.targetDate
    ).length;
    const onTimeRate = completed.length > 0 ? (onTime / completed.length) * 100 : 0;

    // Calculate QC first pass rate
    const woWithQC = mockWorkOrders.filter((wo) => wo.qcSessions.length > 0);
    const firstPass = woWithQC.filter(
      (wo) =>
        wo.qcSessions.length === 1 && wo.qcSessions[0].result === QCResult.PASS
    ).length;
    const qcFirstPassRate =
      woWithQC.length > 0 ? (firstPass / woWithQC.length) * 100 : 0;

    return {
      totalWOs,
      completedWOs,
      inProgressWOs,
      qcPendingWOs,
      onTimeRate: Math.round(onTimeRate),
      qcFirstPassRate: Math.round(qcFirstPassRate),
    };
  },

  /**
   * Check if all steps are done for a WO
   */
  areAllStepsDone: (woId: string): boolean => {
    const wo = mockWorkOrders.find((w) => w.id === woId);
    if (!wo) return false;

    return wo.steps.length > 0 && wo.steps.every((step) => step.status === WOStepStatus.DONE);
  },

  /**
   * Calculate overall progress percentage
   */
  calculateProgress: (woId: string): number => {
    const wo = mockWorkOrders.find((w) => w.id === woId);
    if (!wo || wo.steps.length === 0) return 0;

    const totalSteps = wo.steps.length;
    const completedSteps = wo.steps.filter(
      (step) => step.status === WOStepStatus.DONE
    ).length;
    const inProgressSteps = wo.steps.filter(
      (step) => step.status === WOStepStatus.IN_PROGRESS
    ).length;

    // Calculate based on step completion
    const stepProgress =
      (completedSteps + inProgressSteps * 0.5) / totalSteps;

    // Calculate based on quantity
    const totalQtyPossible = wo.quantity * totalSteps;
    const totalQtyDone = wo.progress.reduce((sum, p) => sum + p.quantityDone, 0);
    const qtyProgress = totalQtyPossible > 0 ? totalQtyDone / totalQtyPossible : 0;

    // Average of both
    return Math.round(((stepProgress + qtyProgress) / 2) * 100);
  },
};
