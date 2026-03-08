/**
 * Warehouse Service
 * Handles all warehouse operations: Stock, GR, GI, Inspection, DO, BAST
 * Automatically switches between mock data and real API based on environment
 */

import type {
  Stock,
  StockAlert,
  StockFilters,
  GoodsReceipt,
  GRItem,
  GRStatusType,
  GRFilters,
  GRFormData,
  UpdateGRRequest,
  CancelGRRequest,
  GoodsIssue,
  GIItem,
  GIStatusType,
  GIFilters,
  GIFormData,
  FinishedGoodsReceipt,
  DeliveryOrder,
  WarehouseDOItem,
  WDOStatusType,
  DOFilters,
  Inspection,
  InspectionStatusType,
  BASTInbound,
  BASTOutbound,
} from "@/types/warehouse";
import { StockCategory, GRStatus, GIStatus, WDOStatus, InspectionStatus, BASTStatus } from "@/types/warehouse";
import { apiClient } from "@/lib/apiClient";

// Check if using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// ============================================
// MOCK DATA (for development)
// ============================================

const mockProducts = [
  { id: "prod-001", code: "MOTOR-X1", name: "Electric Motor Type X1", type: "FG" as const, baseUnit: "Unit", status: "active" as const },
  { id: "prod-002", code: "MOTOR-X2", name: "Electric Motor Type X2", type: "FG" as const, baseUnit: "Unit", status: "active" as const },
  { id: "prod-003", code: "COPPER-WIRE-001", name: "Copper Wire 2mm", type: "RAW" as const, baseUnit: "Meter", status: "active" as const },
  { id: "prod-004", code: "STEEL-ROD-001", name: "Steel Rod Standard", type: "RAW" as const, baseUnit: "Unit", status: "active" as const },
  { id: "prod-005", code: "BEARING-001", name: "Bearing Standard Type", type: "RAW" as const, baseUnit: "Unit", status: "active" as const },
  { id: "prod-006", code: "GREASE-001", name: "Industrial Grease", type: "SUPPORT" as const, baseUnit: "Kg", status: "active" as const },
];

let mockStocks: Stock[] = [
  { id: "stock-001", productId: "prod-001", product: mockProducts[0], quantity: 500, safetyStock: 100, location: "WH-A-01", lastUpdated: new Date().toISOString() },
  { id: "stock-002", productId: "prod-002", product: mockProducts[1], quantity: 300, safetyStock: 50, location: "WH-A-02", lastUpdated: new Date().toISOString() },
  { id: "stock-003", productId: "prod-003", product: mockProducts[2], quantity: 1000, safetyStock: 200, location: "WH-B-01", lastUpdated: new Date().toISOString() },
  { id: "stock-004", productId: "prod-004", product: mockProducts[3], quantity: 30, safetyStock: 100, location: "WH-B-02", lastUpdated: new Date().toISOString() },
  { id: "stock-005", productId: "prod-005", product: mockProducts[4], quantity: 150, safetyStock: 50, location: "WH-B-03", lastUpdated: new Date().toISOString() },
  { id: "stock-006", productId: "prod-006", product: mockProducts[5], quantity: 20, safetyStock: 30, location: "WH-B-04", lastUpdated: new Date().toISOString() },
];

let mockStockAlerts: StockAlert[] = [
  { id: "alert-001", productId: "prod-004", productCode: "STEEL-ROD-001", productName: "Steel Rod Standard", currentQty: 30, safetyStock: 100, shortageAmount: 70, category: StockCategory.RAW_MATERIAL, lastUpdated: new Date().toISOString() },
  { id: "alert-002", productId: "prod-006", productCode: "GREASE-001", productName: "Industrial Grease", currentQty: 20, safetyStock: 30, shortageAmount: 10, category: StockCategory.CONSUMABLE, lastUpdated: new Date().toISOString() },
];

let mockGoodsReceipts: GoodsReceipt[] = [
  { id: "gr-001", prId: "pr-001", do_number: "DO-HO-2024-0089", gr_date: "2024-01-20", status: GRStatus.COMPLETED, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "gr-002", prId: "pr-003", do_number: "DO-HO-2024-0090", gr_date: "2024-01-22", status: GRStatus.INSPECTION_PENDING, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "gr-003", prId: "pr-002", do_number: "DO-HO-2024-0091", gr_date: "2024-01-23", status: GRStatus.DRAFT, items: [], notes: "Awaiting inspection", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockGoodsIssues: GoodsIssue[] = [
  { id: "gi-001", woId: "wo-001", status: GIStatus.ISSUED, items: [], notes: "Materials issued for WO-2024-0001", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "gi-002", woId: "wo-002", status: GIStatus.APPROVED, items: [], notes: "Pending issuance", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "gi-003", woId: "wo-003", status: GIStatus.DRAFT, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockDeliveryOrders: DeliveryOrder[] = [
  { id: "do-001", do_number: "DO-2024-001", do_date: "2024-01-25", status: WDOStatus.DELIVERED, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "do-002", do_number: "DO-2024-002", do_date: "2024-01-26", status: WDOStatus.RELEASED, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "do-003", do_number: "DO-2024-003", do_date: "2024-01-27", status: WDOStatus.DRAFT, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockInspections: Inspection[] = [
  { id: "insp-001", grId: "gr-002", status: InspectionStatus.PENDING, photos: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

let mockFinishedGoodsReceipts: FinishedGoodsReceipt[] = [
  { id: "fgr-001", woId: "wo-006", quantity: 40, status: "received", receivedAt: "2024-01-18T16:00:00Z", createdAt: new Date().toISOString() },
];

// ============================================
// WAREHOUSE SERVICE
// ============================================

export const warehouseService = {
  // ============================================
  // STOCK MANAGEMENT
  // ============================================

  getStocks: async (filters?: StockFilters): Promise<Stock[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let results = [...mockStocks];
      if (filters?.lowStock) results = results.filter((s) => s.quantity < s.safetyStock);
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        results = results.filter((s) => s.product.code.toLowerCase().includes(search) || s.product.name.toLowerCase().includes(search));
      }
      return results;
    }
    const params = new URLSearchParams();
    if (filters?.lowStock) params.append("low_stock", "true");
    if (filters?.search) params.append("search", filters.search);
    const response = await apiClient.get<Stock[]>(`/stock?${params.toString()}`);
    return response.data || [];
  },

  getStockById: async (productId: string): Promise<Stock | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockStocks.find((s) => s.productId === productId) || null;
    }
    const response = await apiClient.get<Stock>(`/stock/${productId}`);
    return response.data || null;
  },

  getLowStockAlerts: async (): Promise<StockAlert[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockStockAlerts;
    }
    const response = await apiClient.get<StockAlert[]>("/stock/alerts");
    return response.data || [];
  },

  updateSafetyStock: async (productId: string, safetyStock: number): Promise<Stock> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const stock = mockStocks.find((s) => s.productId === productId);
      if (!stock) throw new Error("Stock not found");
      stock.safetyStock = safetyStock;
      stock.lastUpdated = new Date().toISOString();
      return stock;
    }
    const response = await apiClient.patch<Stock>(`/stock/${productId}/safety-stock`, { safety_stock: safetyStock });
    if (!response.data) throw new Error("Failed to update safety stock");
    return response.data;
  },

  // ============================================
  // GOODS RECEIPT (INBOUND)
  // ============================================

  getGoodsReceipts: async (filters?: GRFilters): Promise<GoodsReceipt[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let results = [...mockGoodsReceipts];
      if (filters?.status) results = results.filter((gr) => gr.status === filters.status);
      if (filters?.prId) results = results.filter((gr) => gr.prId === filters.prId);
      if (filters?.startDate || filters?.dateFrom) results = results.filter((gr) => gr.gr_date >= (filters.startDate || filters.dateFrom)!);
      if (filters?.endDate || filters?.dateTo) results = results.filter((gr) => gr.gr_date <= (filters.endDate || filters.dateTo)!);
      return results;
    }
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.prId) params.append("pr_id", filters.prId);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    const response = await apiClient.get<GoodsReceipt[]>(`/goods-receipts?${params.toString()}`);
    return response.data || [];
  },

  getGoodsReceiptById: async (id: string): Promise<GoodsReceipt | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockGoodsReceipts.find((gr) => gr.id === id) || null;
    }
    const response = await apiClient.get<GoodsReceipt>(`/goods-receipts/${id}`);
    return response.data || null;
  },

  createGoodsReceipt: async (data: GRFormData): Promise<GoodsReceipt> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newGR: GoodsReceipt = {
        id: `gr-${Date.now()}`,
        prId: data.pr_id,
        do_number: data.do_number,
        gr_date: data.gr_date,
        status: GRStatus.DRAFT,
        notes: data.notes,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockGoodsReceipts.unshift(newGR);
      return newGR;
    }
    const response = await apiClient.post<GoodsReceipt>("/goods-receipts", data);
    if (!response.data) throw new Error("Failed to create goods receipt");
    return response.data;
  },

  updateGoodsReceipt: async (id: string, data: UpdateGRRequest): Promise<GoodsReceipt> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gr = mockGoodsReceipts.find((g) => g.id === id);
      if (!gr) throw new Error("Goods receipt not found");
      if (data.gr_date) gr.gr_date = data.gr_date;
      if (data.notes !== undefined) gr.notes = data.notes;
      gr.updatedAt = new Date().toISOString();
      return gr;
    }
    const response = await apiClient.put<GoodsReceipt>(`/goods-receipts/${id}`, data);
    if (!response.data) throw new Error("Failed to update goods receipt");
    return response.data;
  },

  submitGoodsReceipt: async (id: string): Promise<GoodsReceipt> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gr = mockGoodsReceipts.find((g) => g.id === id);
      if (!gr) throw new Error("Goods receipt not found");
      if (gr.status !== GRStatus.DRAFT) throw new Error("Can only submit draft goods receipts");
      gr.status = GRStatus.INSPECTION_PENDING;
      gr.updatedAt = new Date().toISOString();
      return gr;
    }
    const response = await apiClient.post<GoodsReceipt>(`/goods-receipts/${id}/submit`);
    if (!response.data) throw new Error("Failed to submit goods receipt");
    return response.data;
  },

  startInspection: async (grId: string): Promise<Inspection> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gr = mockGoodsReceipts.find((g) => g.id === grId);
      if (!gr) throw new Error("Goods receipt not found");
      gr.status = GRStatus.INSPECTION_IN_PROGRESS;
      gr.updatedAt = new Date().toISOString();
      const inspection: Inspection = { id: `insp-${Date.now()}`, grId, status: InspectionStatus.IN_PROGRESS, photos: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockInspections.push(inspection);
      return inspection;
    }
    const response = await apiClient.post<Inspection>(`/goods-receipts/${grId}/inspection/start`);
    if (!response.data) throw new Error("Failed to start inspection");
    return response.data;
  },

  completeInspection: async (grId: string, result: "approved" | "rejected"): Promise<GoodsReceipt> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gr = mockGoodsReceipts.find((g) => g.id === grId);
      if (!gr) throw new Error("Goods receipt not found");
      gr.status = result === "approved" ? GRStatus.INSPECTION_APPROVED : GRStatus.INSPECTION_REJECTED;
      gr.updatedAt = new Date().toISOString();
      return gr;
    }
    const response = await apiClient.post<GoodsReceipt>(`/goods-receipts/${grId}/inspection/complete`, { result });
    if (!response.data) throw new Error("Failed to complete inspection");
    return response.data;
  },

  completeGR: async (id: string): Promise<GoodsReceipt> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gr = mockGoodsReceipts.find((g) => g.id === id);
      if (!gr) throw new Error("Goods receipt not found");
      if (gr.status !== GRStatus.INSPECTION_APPROVED) throw new Error("Can only complete approved goods receipts");
      gr.status = GRStatus.COMPLETED;
      gr.updatedAt = new Date().toISOString();
      return gr;
    }
    const response = await apiClient.post<GoodsReceipt>(`/goods-receipts/${id}/complete`);
    if (!response.data) throw new Error("Failed to complete goods receipt");
    return response.data;
  },

  cancelGR: async (id: string, data: CancelGRRequest): Promise<GoodsReceipt> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gr = mockGoodsReceipts.find((g) => g.id === id);
      if (!gr) throw new Error("Goods receipt not found");
      if (gr.status === GRStatus.COMPLETED || gr.status === GRStatus.CANCELLED) throw new Error("Cannot cancel completed or already cancelled goods receipts");
      gr.status = GRStatus.CANCELLED;
      gr.notes = data.reason;
      gr.updatedAt = new Date().toISOString();
      return gr;
    }
    const response = await apiClient.post<GoodsReceipt>(`/goods-receipts/${id}/cancel`, data);
    if (!response.data) throw new Error("Failed to cancel goods receipt");
    return response.data;
  },

  generateBASTInbound: async (grId: string): Promise<BASTInbound> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const bastNumber = `BAST-IN-${Date.now()}`;
      const bast: BASTInbound = { id: `bast-${Date.now()}`, grId, bast_number: bastNumber, bast_date: new Date().toISOString().split("T")[0], status: BASTStatus.GENERATED, createdAt: new Date().toISOString() };
      return bast;
    }
    const response = await apiClient.post<BASTInbound>(`/goods-receipts/${grId}/bast`);
    if (!response.data) throw new Error("Failed to generate BAST");
    return response.data;
  },

  // ============================================
  // GOODS ISSUE (OUTBOUND FOR WO)
  // ============================================

  getGoodsIssues: async (filters?: GIFilters): Promise<GoodsIssue[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let results = [...mockGoodsIssues];
      if (filters?.status) results = results.filter((gi) => gi.status === filters.status);
      if (filters?.woId) results = results.filter((gi) => gi.woId === filters.woId);
      return results;
    }
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.woId) params.append("wo_id", filters.woId);
    const response = await apiClient.get<GoodsIssue[]>(`/goods-issues?${params.toString()}`);
    return response.data || [];
  },

  getGoodsIssueById: async (id: string): Promise<GoodsIssue | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockGoodsIssues.find((gi) => gi.id === id) || null;
    }
    const response = await apiClient.get<GoodsIssue>(`/goods-issues/${id}`);
    return response.data || null;
  },

  createGoodsIssue: async (data: GIFormData): Promise<GoodsIssue> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newGI: GoodsIssue = { id: `gi-${Date.now()}`, woId: data.woId, status: GIStatus.DRAFT, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockGoodsIssues.unshift(newGI);
      return newGI;
    }
    const response = await apiClient.post<GoodsIssue>("/goods-issues", data);
    if (!response.data) throw new Error("Failed to create goods issue");
    return response.data;
  },

  submitGoodsIssue: async (id: string): Promise<GoodsIssue> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gi = mockGoodsIssues.find((g) => g.id === id);
      if (!gi) throw new Error("Goods issue not found");
      if (gi.status !== GIStatus.DRAFT) throw new Error("Can only submit draft goods issues");
      gi.status = GIStatus.SUBMITTED;
      gi.updatedAt = new Date().toISOString();
      return gi;
    }
    const response = await apiClient.post<GoodsIssue>(`/goods-issues/${id}/submit`);
    if (!response.data) throw new Error("Failed to submit goods issue");
    return response.data;
  },

  approveGoodsIssue: async (id: string): Promise<GoodsIssue> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gi = mockGoodsIssues.find((g) => g.id === id);
      if (!gi) throw new Error("Goods issue not found");
      if (gi.status !== GIStatus.SUBMITTED) throw new Error("Can only approve submitted goods issues");
      gi.status = GIStatus.APPROVED;
      gi.updatedAt = new Date().toISOString();
      return gi;
    }
    const response = await apiClient.post<GoodsIssue>(`/goods-issues/${id}/approve`);
    if (!response.data) throw new Error("Failed to approve goods issue");
    return response.data;
  },

  rejectGoodsIssue: async (id: string, reason?: string): Promise<GoodsIssue> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gi = mockGoodsIssues.find((g) => g.id === id);
      if (!gi) throw new Error("Goods issue not found");
      if (gi.status !== GIStatus.SUBMITTED) throw new Error("Can only reject submitted goods issues");
      gi.status = GIStatus.REJECTED;
      gi.notes = reason;
      gi.updatedAt = new Date().toISOString();
      return gi;
    }
    const response = await apiClient.post<GoodsIssue>(`/goods-issues/${id}/reject`, { reason });
    if (!response.data) throw new Error("Failed to reject goods issue");
    return response.data;
  },

  issueGoods: async (id: string): Promise<GoodsIssue> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gi = mockGoodsIssues.find((g) => g.id === id);
      if (!gi) throw new Error("Goods issue not found");
      if (gi.status !== GIStatus.APPROVED) throw new Error("Can only issue approved goods issues");
      gi.status = GIStatus.ISSUED;
      gi.updatedAt = new Date().toISOString();
      return gi;
    }
    const response = await apiClient.post<GoodsIssue>(`/goods-issues/${id}/issue`);
    if (!response.data) throw new Error("Failed to issue goods");
    return response.data;
  },

  cancelGoodsIssue: async (id: string): Promise<GoodsIssue> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gi = mockGoodsIssues.find((g) => g.id === id);
      if (!gi) throw new Error("Goods issue not found");
      if (gi.status === GIStatus.ISSUED || gi.status === GIStatus.CANCELLED) throw new Error("Cannot cancel issued or already cancelled goods issues");
      gi.status = GIStatus.CANCELLED;
      gi.updatedAt = new Date().toISOString();
      return gi;
    }
    const response = await apiClient.post<GoodsIssue>(`/goods-issues/${id}/cancel`);
    if (!response.data) throw new Error("Failed to cancel goods issue");
    return response.data;
  },

  // ============================================
  // FINISHED GOODS RECEIPT
  // ============================================

  getFinishedGoodsReceipts: async (): Promise<FinishedGoodsReceipt[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockFinishedGoodsReceipts;
    }
    const response = await apiClient.get<FinishedGoodsReceipt[]>("/finished-goods-receipts");
    return response.data || [];
  },

  createFinishedGoodsReceipt: async (woId: string, quantity: number): Promise<FinishedGoodsReceipt> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newFGR: FinishedGoodsReceipt = { id: `fgr-${Date.now()}`, woId, quantity, status: "received", receivedAt: new Date().toISOString(), createdAt: new Date().toISOString() };
      mockFinishedGoodsReceipts.unshift(newFGR);
      return newFGR;
    }
    const response = await apiClient.post<FinishedGoodsReceipt>("/finished-goods-receipts", { wo_id: woId, quantity });
    if (!response.data) throw new Error("Failed to create finished goods receipt");
    return response.data;
  },

  // ============================================
  // WAREHOUSE DELIVERY ORDER
  // ============================================

  getWarehouseDOs: async (filters?: DOFilters): Promise<DeliveryOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let results = [...mockDeliveryOrders];
      if (filters?.status) results = results.filter((do_) => do_.status === filters.status);
      return results;
    }
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    const response = await apiClient.get<DeliveryOrder[]>(`/warehouse-dos?${params.toString()}`);
    return response.data || [];
  },

  getWarehouseDOById: async (id: string): Promise<DeliveryOrder | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDeliveryOrders.find((do_) => do_.id === id) || null;
    }
    const response = await apiClient.get<DeliveryOrder>(`/warehouse-dos/${id}`);
    return response.data || null;
  },

  createWarehouseDO: async (data: { do_number: string; do_date: string; items: { productId: string; quantity: number }[] }): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newDO: DeliveryOrder = { id: `do-${Date.now()}`, do_number: data.do_number, do_date: data.do_date, status: WDOStatus.DRAFT, items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockDeliveryOrders.unshift(newDO);
      return newDO;
    }
    const response = await apiClient.post<DeliveryOrder>("/warehouse-dos", data);
    if (!response.data) throw new Error("Failed to create delivery order");
    return response.data;
  },

  updateWarehouseDO: async (id: string, data: Partial<{ do_number: string; do_date: string }>): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (data.do_number) do_.do_number = data.do_number;
      if (data.do_date) do_.do_date = data.do_date;
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.put<DeliveryOrder>(`/warehouse-dos/${id}`, data);
    if (!response.data) throw new Error("Failed to update delivery order");
    return response.data;
  },

  releaseWarehouseDO: async (id: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status !== WDOStatus.DRAFT) throw new Error("Can only release draft delivery orders");
      do_.status = WDOStatus.RELEASED;
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/warehouse-dos/${id}/release`);
    if (!response.data) throw new Error("Failed to release delivery order");
    return response.data;
  },

  confirmWarehouseDO: async (id: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      do_.status = WDOStatus.DELIVERED;
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/warehouse-dos/${id}/confirm`);
    if (!response.data) throw new Error("Failed to confirm delivery order");
    return response.data;
  },

  cancelWarehouseDO: async (id: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status === WDOStatus.DELIVERED || do_.status === WDOStatus.CANCELLED) throw new Error("Cannot cancel delivered or already cancelled delivery orders");
      do_.status = WDOStatus.CANCELLED;
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/warehouse-dos/${id}/cancel`);
    if (!response.data) throw new Error("Failed to cancel delivery order");
    return response.data;
  },

  uploadBASTOutbound: async (doId: string, file: File): Promise<BASTOutbound> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const bast: BASTOutbound = { id: `bast-${Date.now()}`, doId, bast_number: `BAST-OUT-${Date.now()}`, bast_date: new Date().toISOString().split("T")[0], fileUrl: URL.createObjectURL(file), uploadedAt: new Date().toISOString() };
      return bast;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<BASTOutbound>(`/warehouse-dos/${doId}/bast`, formData);
    if (!response.data) throw new Error("Failed to upload BAST");
    return response.data;
  },

  // ============================================
  // INSPECTION
  // ============================================

  getInspections: async (): Promise<Inspection[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockInspections;
    }
    const response = await apiClient.get<Inspection[]>("/inspections");
    return response.data || [];
  },

  getInspectionById: async (id: string): Promise<Inspection | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockInspections.find((i) => i.id === id) || null;
    }
    const response = await apiClient.get<Inspection>(`/inspections/${id}`);
    return response.data || null;
  },

  submitInspection: async (id: string): Promise<Inspection> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const inspection = mockInspections.find((i) => i.id === id);
      if (!inspection) throw new Error("Inspection not found");
      inspection.status = InspectionStatus.SUBMITTED;
      inspection.updatedAt = new Date().toISOString();
      return inspection;
    }
    const response = await apiClient.post<Inspection>(`/inspections/${id}/submit`);
    if (!response.data) throw new Error("Failed to submit inspection");
    return response.data;
  },

  approveInspection: async (id: string): Promise<Inspection> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const inspection = mockInspections.find((i) => i.id === id);
      if (!inspection) throw new Error("Inspection not found");
      inspection.status = InspectionStatus.APPROVED;
      inspection.updatedAt = new Date().toISOString();
      return inspection;
    }
    const response = await apiClient.post<Inspection>(`/inspections/${id}/approve`);
    if (!response.data) throw new Error("Failed to approve inspection");
    return response.data;
  },

  rejectInspection: async (id: string): Promise<Inspection> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const inspection = mockInspections.find((i) => i.id === id);
      if (!inspection) throw new Error("Inspection not found");
      inspection.status = InspectionStatus.REJECTED;
      inspection.updatedAt = new Date().toISOString();
      return inspection;
    }
    const response = await apiClient.post<Inspection>(`/inspections/${id}/reject`);
    if (!response.data) throw new Error("Failed to reject inspection");
    return response.data;
  },

  uploadInspectionPhoto: async (inspectionId: string, file: File): Promise<{ id: string; url: string }> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const photo = { id: `photo-${Date.now()}`, url: URL.createObjectURL(file) };
      const inspection = mockInspections.find((i) => i.id === inspectionId);
      if (inspection) inspection.photos.push({ id: photo.id, inspectionId, url: photo.url, uploadedAt: new Date().toISOString() });
      return photo;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<{ id: string; url: string }>(`/inspections/${inspectionId}/photos`, formData);
    if (!response.data) throw new Error("Failed to upload photo");
    return response.data;
  },

  // ============================================
  // HELPERS
  // ============================================

  getAvailableStockForDO: async (): Promise<Stock[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockStocks.filter((s) => s.product.type === "FG" && s.quantity > 0);
    }
    const response = await apiClient.get<Stock[]>("/stock/available-for-do");
    return response.data || [];
  },

  getAvailableWOs: async (): Promise<{ id: string; woNumber: string; productName: string }[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [
        { id: "wo-001", woNumber: "WO-2024-0001", productName: "Electric Motor Type X1" },
        { id: "wo-003", woNumber: "WO-2024-0003", productName: "Electric Motor Type X1" },
      ];
    }
    const response = await apiClient.get<{ id: string; woNumber: string; productName: string }[]>("/work-orders/available-for-gi");
    return response.data || [];
  },
};