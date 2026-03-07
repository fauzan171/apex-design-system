/**
 * Purchasing Module Mock Data
 * Based on PRD-04-PURCHASING.md
 *
 * This data is for frontend development and QA testing.
 * Will be replaced with API calls in production.
 */

import type {
  PurchaseRequest,
  PRItem,
  DeliveryOrderFromHO,
  PRAgingReport,
  PRStatusSummary,
} from "@/types/purchasing";
import { PRStatus, PRItemStatus, canTransitionTo } from "@/types/purchasing";

// ============================================
// PURCHASE REQUESTS
// ============================================

export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: "pr-001",
    prNumber: "PR-2024-0001",
    requestDate: "2024-01-16",
    requiredDate: "2024-01-25",
    status: PRStatus.DO_ISSUED,
    sourcePlanId: "plan-001",
    sourcePlanNumber: "PP-2024-0001",
    planId: "plan-001",
    planNumber: "PP-2024-0001",
    notes: "Urgent materials for Q1 production",
    leadTimeEstimate: "2024-01-22",
    items: [
      {
        id: "pri-001-1",
        prId: "pr-001",
        materialId: "prod-004",
        materialCode: "COPPER-WIRE-001",
        materialName: "Copper Wire 2mm",
        quantity: 4500,
        unit: "Meter",
        receivedQty: 4500,
        status: PRItemStatus.RECEIVED,
      },
      {
        id: "pri-001-2",
        prId: "pr-001",
        materialId: "prod-006",
        materialCode: "GREASE-001",
        materialName: "Industrial Grease",
        quantity: 55,
        unit: "Kg",
        receivedQty: 30,
        status: PRItemStatus.PARTIAL,
      },
      {
        id: "pri-001-3",
        prId: "pr-001",
        materialId: "prod-007",
        materialCode: "BEARING-001",
        materialName: "Bearing Standard Type",
        quantity: 400,
        unit: "Unit",
        receivedQty: 0,
        status: PRItemStatus.PENDING,
      },
    ],
    deliveryOrders: [
      {
        id: "do-ho-001",
        doNumber: "DO-HO-2024-0089",
        prId: "pr-001",
        doDate: "2024-01-20",
        documentPath: "/documents/do/DO-HO-2024-0089.pdf",
        documentName: "DO-HO-2024-0089.pdf",
        items: [
          {
            id: "doi-001-1",
            doId: "do-ho-001",
            prItemId: "pri-001-1",
            materialCode: "COPPER-WIRE-001",
            materialName: "Copper Wire 2mm",
            quantity: 4500,
            unit: "Meter",
          },
          {
            id: "doi-001-2",
            doId: "do-ho-001",
            prItemId: "pri-001-2",
            materialCode: "GREASE-001",
            materialName: "Industrial Grease",
            quantity: 30,
            unit: "Kg",
          },
        ],
        createdBy: "user-001",
        createdAt: "2024-01-20T10:00:00Z",
        notes: "First delivery",
      },
    ],
    statusLogs: [
      {
        id: "log-001-1",
        prId: "pr-001",
        newStatus: PRStatus.DRAFT,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-16T08:00:00Z",
        notes: "Created from MR",
      },
      {
        id: "log-001-2",
        prId: "pr-001",
        oldStatus: PRStatus.DRAFT,
        newStatus: PRStatus.SUBMITTED,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-16T09:00:00Z",
        notes: "Submitted for approval",
      },
      {
        id: "log-001-3",
        prId: "pr-001",
        oldStatus: PRStatus.SUBMITTED,
        newStatus: PRStatus.APPROVED,
        changedBy: "user-002",
        changedByName: "Budi Manager",
        changedAt: "2024-01-16T11:00:00Z",
        notes: "Approved",
      },
      {
        id: "log-001-4",
        prId: "pr-001",
        oldStatus: PRStatus.APPROVED,
        newStatus: PRStatus.PROCESSING,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-17T10:00:00Z",
        notes: "HO confirmed processing via email",
      },
      {
        id: "log-001-5",
        prId: "pr-001",
        oldStatus: PRStatus.PROCESSING,
        newStatus: PRStatus.DO_ISSUED,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-20T10:00:00Z",
        notes: "DO-HO-2024-0089 received",
      },
    ],
    createdBy: "user-001",
    createdByName: "Ahmad Supervisor",
    createdAt: "2024-01-16T08:00:00Z",
    approvedBy: "user-002",
    approvedByName: "Budi Manager",
    approvedAt: "2024-01-16T11:00:00Z",
  },
  {
    id: "pr-002",
    prNumber: "PR-2024-0002",
    requestDate: "2024-01-18",
    requiredDate: "2024-01-28",
    status: PRStatus.SUBMITTED,
    sourcePlanId: "plan-001",
    sourcePlanNumber: "PP-2024-0001",
    notes: "Additional materials for MOTOR-X2 production",
    items: [
      {
        id: "pri-002-1",
        prId: "pr-002",
        materialId: "prod-005",
        materialCode: "STEEL-ROD-001",
        materialName: "Steel Rod Standard",
        quantity: 200,
        unit: "Unit",
        receivedQty: 0,
        status: PRItemStatus.PENDING,
      },
    ],
    deliveryOrders: [],
    statusLogs: [
      {
        id: "log-002-1",
        prId: "pr-002",
        newStatus: PRStatus.DRAFT,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-18T08:00:00Z",
        notes: "Created from MR",
      },
      {
        id: "log-002-2",
        prId: "pr-002",
        oldStatus: PRStatus.DRAFT,
        newStatus: PRStatus.SUBMITTED,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-18T09:00:00Z",
        notes: "Submitted for approval",
      },
    ],
    createdBy: "user-001",
    createdByName: "Ahmad Supervisor",
    createdAt: "2024-01-18T08:00:00Z",
  },
  {
    id: "pr-003",
    prNumber: "PR-2024-0003",
    requestDate: "2024-01-19",
    requiredDate: "2024-01-29",
    status: PRStatus.APPROVED,
    sourcePlanId: "plan-002",
    sourcePlanNumber: "PP-2024-0002",
    notes: "Materials for standard production batch",
    leadTimeEstimate: "2024-01-25",
    items: [
      {
        id: "pri-003-1",
        prId: "pr-003",
        materialId: "prod-004",
        materialCode: "COPPER-WIRE-001",
        materialName: "Copper Wire 2mm",
        quantity: 3000,
        unit: "Meter",
        receivedQty: 0,
        status: PRItemStatus.PENDING,
      },
      {
        id: "pri-003-2",
        prId: "pr-003",
        materialId: "prod-007",
        materialCode: "BEARING-001",
        materialName: "Bearing Standard Type",
        quantity: 300,
        unit: "Unit",
        receivedQty: 0,
        status: PRItemStatus.PENDING,
      },
    ],
    deliveryOrders: [],
    statusLogs: [
      {
        id: "log-003-1",
        prId: "pr-003",
        newStatus: PRStatus.DRAFT,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-19T08:00:00Z",
      },
      {
        id: "log-003-2",
        prId: "pr-003",
        oldStatus: PRStatus.DRAFT,
        newStatus: PRStatus.SUBMITTED,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-19T09:00:00Z",
      },
      {
        id: "log-003-3",
        prId: "pr-003",
        oldStatus: PRStatus.SUBMITTED,
        newStatus: PRStatus.APPROVED,
        changedBy: "user-002",
        changedByName: "Budi Manager",
        changedAt: "2024-01-19T14:00:00Z",
      },
    ],
    createdBy: "user-001",
    createdByName: "Ahmad Supervisor",
    createdAt: "2024-01-19T08:00:00Z",
    approvedBy: "user-002",
    approvedByName: "Budi Manager",
    approvedAt: "2024-01-19T14:00:00Z",
  },
  {
    id: "pr-004",
    prNumber: "PR-2024-0004",
    requestDate: "2024-01-10",
    requiredDate: "2024-01-20",
    status: PRStatus.CLOSED,
    sourcePlanId: "plan-003",
    sourcePlanNumber: "PP-2024-0003",
    items: [
      {
        id: "pri-004-1",
        prId: "pr-004",
        materialId: "prod-005",
        materialCode: "STEEL-ROD-001",
        materialName: "Steel Rod Standard",
        quantity: 100,
        unit: "Unit",
        receivedQty: 100,
        status: PRItemStatus.RECEIVED,
      },
    ],
    deliveryOrders: [
      {
        id: "do-ho-002",
        doNumber: "DO-HO-2024-0070",
        prId: "pr-004",
        doDate: "2024-01-15",
        documentPath: "/documents/do/DO-HO-2024-0070.pdf",
        documentName: "DO-HO-2024-0070.pdf",
        items: [
          {
            id: "doi-004-1",
            doId: "do-ho-002",
            prItemId: "pri-004-1",
            materialCode: "STEEL-ROD-001",
            materialName: "Steel Rod Standard",
            quantity: 100,
            unit: "Unit",
          },
        ],
        createdBy: "user-001",
        createdAt: "2024-01-15T10:00:00Z",
      },
    ],
    statusLogs: [
      {
        id: "log-004-1",
        prId: "pr-004",
        newStatus: PRStatus.DRAFT,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-10T08:00:00Z",
      },
      {
        id: "log-004-2",
        prId: "pr-004",
        oldStatus: PRStatus.DRAFT,
        newStatus: PRStatus.SUBMITTED,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-10T09:00:00Z",
      },
      {
        id: "log-004-3",
        prId: "pr-004",
        oldStatus: PRStatus.SUBMITTED,
        newStatus: PRStatus.APPROVED,
        changedBy: "user-002",
        changedByName: "Budi Manager",
        changedAt: "2024-01-10T11:00:00Z",
      },
      {
        id: "log-004-4",
        prId: "pr-004",
        oldStatus: PRStatus.APPROVED,
        newStatus: PRStatus.PROCESSING,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-11T10:00:00Z",
      },
      {
        id: "log-004-5",
        prId: "pr-004",
        oldStatus: PRStatus.PROCESSING,
        newStatus: PRStatus.DO_ISSUED,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "log-004-6",
        prId: "pr-004",
        oldStatus: PRStatus.DO_ISSUED,
        newStatus: PRStatus.CLOSED,
        changedBy: "system",
        changedByName: "System",
        changedAt: "2024-01-16T14:00:00Z",
        notes: "All items received via GR",
      },
    ],
    createdBy: "user-001",
    createdByName: "Ahmad Supervisor",
    createdAt: "2024-01-10T08:00:00Z",
    approvedBy: "user-002",
    approvedByName: "Budi Manager",
    approvedAt: "2024-01-10T11:00:00Z",
  },
  {
    id: "pr-005",
    prNumber: "PR-2024-0005",
    requestDate: "2024-01-17",
    requiredDate: "2024-01-27",
    status: PRStatus.REJECTED,
    sourcePlanId: "plan-002",
    sourcePlanNumber: "PP-2024-0002",
    notes: "Duplicate request - please revise",
    items: [
      {
        id: "pri-005-1",
        prId: "pr-005",
        materialId: "prod-008",
        materialCode: "SCREW-001",
        materialName: "Screw M8x20",
        quantity: 1000,
        unit: "Unit",
        receivedQty: 0,
        status: PRItemStatus.PENDING,
      },
    ],
    deliveryOrders: [],
    statusLogs: [
      {
        id: "log-005-1",
        prId: "pr-005",
        newStatus: PRStatus.DRAFT,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-17T08:00:00Z",
      },
      {
        id: "log-005-2",
        prId: "pr-005",
        oldStatus: PRStatus.DRAFT,
        newStatus: PRStatus.SUBMITTED,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-17T09:00:00Z",
      },
      {
        id: "log-005-3",
        prId: "pr-005",
        oldStatus: PRStatus.SUBMITTED,
        newStatus: PRStatus.REJECTED,
        changedBy: "user-002",
        changedByName: "Budi Manager",
        changedAt: "2024-01-17T14:00:00Z",
        notes: "Duplicate request - already covered in PR-2024-0003",
      },
    ],
    createdBy: "user-001",
    createdByName: "Ahmad Supervisor",
    createdAt: "2024-01-17T08:00:00Z",
    rejectedBy: "user-002",
    rejectedByName: "Budi Manager",
    rejectedAt: "2024-01-17T14:00:00Z",
    rejectionReason: "Duplicate request - already covered in PR-2024-0003",
  },
  {
    id: "pr-006",
    prNumber: "PR-2024-0006",
    requestDate: "2024-01-20",
    requiredDate: "2024-01-30",
    status: PRStatus.DRAFT,
    sourcePlanId: "plan-005",
    sourcePlanNumber: "PP-2024-0005",
    notes: "Draft PR for Generator production",
    items: [
      {
        id: "pri-006-1",
        prId: "pr-006",
        materialId: "prod-004",
        materialCode: "COPPER-WIRE-001",
        materialName: "Copper Wire 2mm",
        quantity: 2500,
        unit: "Meter",
        receivedQty: 0,
        status: PRItemStatus.PENDING,
      },
    ],
    deliveryOrders: [],
    statusLogs: [
      {
        id: "log-006-1",
        prId: "pr-006",
        newStatus: PRStatus.DRAFT,
        changedBy: "user-001",
        changedByName: "Ahmad Supervisor",
        changedAt: "2024-01-20T08:00:00Z",
        notes: "Created from MR",
      },
    ],
    createdBy: "user-001",
    createdByName: "Ahmad Supervisor",
    createdAt: "2024-01-20T08:00:00Z",
  },
];

// ============================================
// SERVICE FUNCTIONS
// ============================================

export const purchasingService = {
  /**
   * Get all purchase requests with optional filters
   */
  getPRs: async (filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<PurchaseRequest[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let prs = [...mockPurchaseRequests];

    if (filters?.status && filters.status !== "all") {
      prs = prs.filter((pr) => pr.status === filters.status);
    }

    if (filters?.dateFrom) {
      prs = prs.filter((pr) => pr.requestDate >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      prs = prs.filter((pr) => pr.requestDate <= filters.dateTo!);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      prs = prs.filter(
        (pr) =>
          pr.prNumber.toLowerCase().includes(search) ||
          pr.sourcePlanNumber?.toLowerCase().includes(search)
      );
    }

    return prs.sort((a, b) => b.requestDate.localeCompare(a.requestDate));
  },

  /**
   * Get a single purchase request by ID
   */
  getPRById: async (id: string): Promise<PurchaseRequest | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPurchaseRequests.find((pr) => pr.id === id) || null;
  },

  /**
   * Create a new purchase request
   */
  createPR: async (data: {
    requestDate: string;
    requiredDate: string;
    notes?: string;
    sourcePlanId?: string;
    sourcePlanNumber?: string;
    items: {
      materialId: string;
      materialCode: string;
      materialName: string;
      quantity: number;
      unit: string;
      notes?: string;
    }[];
  }): Promise<PurchaseRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const prNumber = `PR-2024-${String(mockPurchaseRequests.length + 1).padStart(4, "0")}`;
    const newId = `pr-${Date.now()}`;

    const items: PRItem[] = data.items.map((item, idx) => ({
      id: `pri-${newId}-${idx}`,
      prId: newId,
      materialId: item.materialId,
      materialCode: item.materialCode,
      materialName: item.materialName,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes,
      receivedQty: 0,
      status: PRItemStatus.PENDING,
    }));

    const newPR: PurchaseRequest = {
      id: newId,
      prNumber,
      requestDate: data.requestDate,
      requiredDate: data.requiredDate,
      status: PRStatus.DRAFT,
      sourcePlanId: data.sourcePlanId,
      sourcePlanNumber: data.sourcePlanNumber,
      planId: data.sourcePlanId,
      planNumber: data.sourcePlanNumber,
      notes: data.notes,
      items,
      deliveryOrders: [],
      statusLogs: [
        {
          id: `log-${newId}-1`,
          prId: newId,
          newStatus: PRStatus.DRAFT,
          changedBy: "user-001",
          changedByName: "Ahmad Supervisor",
          changedAt: new Date().toISOString(),
          notes: "Created from MR",
        },
      ],
      createdBy: "user-001",
      createdByName: "Ahmad Supervisor",
      createdAt: new Date().toISOString(),
    };

    mockPurchaseRequests.unshift(newPR);
    return newPR;
  },

  /**
   * Update PR (only Draft status)
   */
  updatePR: async (
    id: string,
    data: {
      requestDate?: string;
      requiredDate?: string;
      notes?: string;
      items?: {
        id?: string;
        materialId: string;
        materialCode: string;
        materialName: string;
        quantity: number;
        unit: string;
        notes?: string;
      }[];
    }
  ): Promise<PurchaseRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const pr = mockPurchaseRequests.find((p) => p.id === id);
    if (!pr) throw new Error("PR not found");
    if (pr.status !== PRStatus.DRAFT) throw new Error("Can only edit Draft PR");

    if (data.requestDate) pr.requestDate = data.requestDate;
    if (data.requiredDate) pr.requiredDate = data.requiredDate;
    if (data.notes !== undefined) pr.notes = data.notes;

    if (data.items) {
      pr.items = data.items.map((item, idx) => ({
        id: item.id || `pri-${id}-${idx}`,
        prId: id,
        materialId: item.materialId,
        materialCode: item.materialCode,
        materialName: item.materialName,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
        receivedQty: 0,
        status: PRItemStatus.PENDING,
      }));
    }

    return pr;
  },

  /**
   * Delete PR (only Draft status)
   */
  deletePR: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockPurchaseRequests.findIndex((pr) => pr.id === id);
    if (index === -1) throw new Error("PR not found");

    const pr = mockPurchaseRequests[index];
    if (pr.status !== PRStatus.DRAFT) throw new Error("Can only delete Draft PR");

    mockPurchaseRequests.splice(index, 1);
  },

  /**
   * Update PR status
   */
  updatePRStatus: async (
    id: string,
    newStatus: PRStatus,
    notes?: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const pr = mockPurchaseRequests.find((p) => p.id === id);
    if (!pr) throw new Error("PR not found");

    // Validate transition
    const allowedTransitions = canTransitionTo[pr.status];
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(`Cannot transition from ${pr.status} to ${newStatus}`);
    }

    const oldStatus = pr.status;
    pr.status = newStatus;

    // Add status log
    pr.statusLogs.push({
      id: `log-${id}-${Date.now()}`,
      prId: id,
      oldStatus,
      newStatus,
      changedBy: newStatus === PRStatus.APPROVED || newStatus === PRStatus.REJECTED ? "user-002" : "user-001",
      changedByName: newStatus === PRStatus.APPROVED || newStatus === PRStatus.REJECTED ? "Budi Manager" : "Ahmad Supervisor",
      changedAt: new Date().toISOString(),
      notes,
    });

    // Update approval/rejection info
    if (newStatus === PRStatus.APPROVED) {
      pr.approvedBy = "user-002";
      pr.approvedByName = "Budi Manager";
      pr.approvedAt = new Date().toISOString();
    }

    if (newStatus === PRStatus.REJECTED) {
      pr.rejectedBy = "user-002";
      pr.rejectedByName = "Budi Manager";
      pr.rejectedAt = new Date().toISOString();
      pr.rejectionReason = notes;
    }
  },

  /**
   * Submit PR for approval
   */
  submitPR: async (id: string): Promise<void> => {
    await purchasingService.updatePRStatus(id, PRStatus.SUBMITTED, "Submitted for approval");
  },

  /**
   * Approve PR
   */
  approvePR: async (id: string, notes?: string): Promise<void> => {
    await purchasingService.updatePRStatus(id, PRStatus.APPROVED, notes || "Approved");
  },

  /**
   * Reject PR
   */
  rejectPR: async (id: string, reason: string): Promise<void> => {
    await purchasingService.updatePRStatus(id, PRStatus.REJECTED, reason);
  },

  /**
   * Update lead time estimate
   */
  updateLeadTime: async (id: string, leadTime: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const pr = mockPurchaseRequests.find((p) => p.id === id);
    if (!pr) throw new Error("PR not found");

    pr.leadTimeEstimate = leadTime;
  },

  /**
   * Add DO to PR
   */
  addDO: async (
    prId: string,
    data: {
      doNumber: string;
      doDate: string;
      notes?: string;
      document?: File;
      items: {
        prItemId: string;
        quantity: number;
      }[];
    }
  ): Promise<DeliveryOrderFromHO> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pr = mockPurchaseRequests.find((p) => p.id === prId);
    if (!pr) throw new Error("PR not found");

    const newDO: DeliveryOrderFromHO = {
      id: `do-ho-${Date.now()}`,
      doNumber: data.doNumber,
      prId,
      doDate: data.doDate,
      documentPath: data.document ? URL.createObjectURL(data.document) : undefined,
      documentName: data.document?.name,
      items: data.items.map((item) => {
        const prItem = pr.items.find((i) => i.id === item.prItemId);
        return {
          id: `doi-${Date.now()}-${item.prItemId}`,
          doId: `do-ho-${Date.now()}`,
          prItemId: item.prItemId,
          materialCode: prItem?.materialCode || "",
          materialName: prItem?.materialName || "",
          quantity: item.quantity,
          unit: prItem?.unit || "Unit",
        };
      }),
      createdBy: "user-001",
      createdAt: new Date().toISOString(),
      notes: data.notes,
    };

    pr.deliveryOrders.push(newDO);

    // Update status if first DO
    if (pr.status === PRStatus.PROCESSING) {
      await purchasingService.updatePRStatus(prId, PRStatus.DO_ISSUED, `DO ${data.doNumber} added`);
    }

    return newDO;
  },

  /**
   * Get PR aging report
   */
  getPRAgingReport: async (): Promise<PRAgingReport[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const now = new Date();
    const groups: PRAgingReport[] = [
      { ageGroup: "0-3 days", count: 0, prs: [] },
      { ageGroup: "4-7 days", count: 0, prs: [] },
      { ageGroup: ">7 days", count: 0, prs: [] },
    ];

    mockPurchaseRequests.forEach((pr) => {
      const createdDate = new Date(pr.createdAt);
      const ageDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

      if (ageDays <= 3) {
        groups[0].prs.push(pr);
        groups[0].count++;
      } else if (ageDays <= 7) {
        groups[1].prs.push(pr);
        groups[1].count++;
      } else {
        groups[2].prs.push(pr);
        groups[2].count++;
      }
    });

    return groups;
  },

  /**
   * Get PR status summary
   */
  getPRStatusSummary: async (): Promise<PRStatusSummary[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const summary: Record<PRStatus, number> = {
      [PRStatus.DRAFT]: 0,
      [PRStatus.SUBMITTED]: 0,
      [PRStatus.APPROVED]: 0,
      [PRStatus.REJECTED]: 0,
      [PRStatus.PROCESSING]: 0,
      [PRStatus.DO_ISSUED]: 0,
      [PRStatus.CLOSED]: 0,
    };

    mockPurchaseRequests.forEach((pr) => {
      summary[pr.status]++;
    });

    return Object.entries(summary).map(([status, count]) => ({
      status: status as PRStatus,
      count,
    }));
  },

  /**
   * Export PR report to CSV
   */
  exportPRReport: async (format: "csv" | "pdf"): Promise<void> => {
    const headers = [
      "PR Number",
      "Request Date",
      "Required Date",
      "Status",
      "Source Plan",
      "Items",
      "Lead Time",
      "Created By",
    ];

    const rows = mockPurchaseRequests.map((pr) => [
      pr.prNumber,
      pr.requestDate,
      pr.requiredDate,
      pr.status,
      pr.sourcePlanNumber || "-",
      `${pr.items.length} items`,
      pr.leadTimeEstimate || "-",
      pr.createdByName,
    ]);

    if (format === "csv") {
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `PR-Report-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
    } else {
      // PDF - simple print
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>PR Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 18px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Purchase Request Report</h1>
          <p>Generated: ${new Date().toLocaleString("id-ID")}</p>
          <table>
            <thead>
              <tr>
                ${headers.map((h) => `<th>${h}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  },
};