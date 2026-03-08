/**
 * Delivery Service
 * Handles all Delivery Order (outbound to HO) and BAST operations
 * Automatically switches between mock data and real API based on environment
 */

import type {
  DeliveryOrder,
  DOItem,
  DOStatusType,
  DOFilters,
  DOFormData,
  UpdateDORequest,
  DOItemFormData,
  BASTOutbound,
  BASTStatusType,
  FinishedGoodStock,
} from "@/types/delivery";
import { DOStatus, BASTStatus } from "@/types/delivery";
import { apiClient } from "@/lib/apiClient";

// Check if using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// ============================================
// MOCK DATA (for development)
// ============================================

const mockProducts = [
  { id: "prod-001", code: "MOTOR-X1", name: "Electric Motor Type X1", type: "FG" as const, baseUnit: "Unit", status: "active" as const },
  { id: "prod-002", code: "MOTOR-X2", name: "Electric Motor Type X2", type: "FG" as const, baseUnit: "Unit", status: "active" as const },
  { id: "prod-003", code: "GENERATOR-G1", name: "Industrial Generator G1", type: "FG" as const, baseUnit: "Unit", status: "active" as const },
];

let mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: "do-001",
    do_number: "DO-2024-001",
    do_date: "2024-01-25",
    status: DOStatus.RECEIVED,
    items: [
      { id: "doi-001-1", doId: "do-001", productId: "prod-001", product: mockProducts[0], quantity: 50, quantityDelivered: 50, unit: "Unit" },
    ],
    bastOutbound: {
      id: "bast-001",
      doId: "do-001",
      bast_number: "BAST-2024-001",
      bast_date: "2024-01-26",
      fileUrl: "/documents/bast/BAST-2024-001.pdf",
      uploadedAt: "2024-01-26T10:00:00Z",
    },
    createdAt: "2024-01-24T08:00:00Z",
    updatedAt: "2024-01-26T10:00:00Z",
    releasedAt: "2024-01-25T08:00:00Z",
    deliveredAt: "2024-01-26T09:00:00Z",
    receivedAt: "2024-01-26T10:00:00Z",
  },
  {
    id: "do-002",
    do_number: "DO-2024-002",
    do_date: "2024-01-28",
    status: DOStatus.DELIVERED,
    items: [
      { id: "doi-002-1", doId: "do-002", productId: "prod-002", product: mockProducts[1], quantity: 30, quantityDelivered: 30, unit: "Unit" },
      { id: "doi-002-2", doId: "do-002", productId: "prod-001", product: mockProducts[0], quantity: 20, quantityDelivered: 20, unit: "Unit" },
    ],
    createdAt: "2024-01-26T10:00:00Z",
    updatedAt: "2024-01-28T16:00:00Z",
    releasedAt: "2024-01-27T08:00:00Z",
    deliveredAt: "2024-01-28T16:00:00Z",
  },
  {
    id: "do-003",
    do_number: "DO-2024-003",
    do_date: "2024-01-30",
    status: DOStatus.IN_TRANSIT,
    items: [
      { id: "doi-003-1", doId: "do-003", productId: "prod-003", product: mockProducts[2], quantity: 10, unit: "Unit" },
    ],
    notes: "Priority delivery - urgent",
    createdAt: "2024-01-27T14:00:00Z",
    updatedAt: "2024-01-29T08:00:00Z",
    releasedAt: "2024-01-29T08:00:00Z",
  },
  {
    id: "do-004",
    do_number: "DO-2024-004",
    do_date: "2024-02-01",
    status: DOStatus.RELEASED,
    items: [
      { id: "doi-004-1", doId: "do-004", productId: "prod-001", product: mockProducts[0], quantity: 40, unit: "Unit" },
    ],
    createdAt: "2024-01-28T09:00:00Z",
    updatedAt: "2024-01-29T10:00:00Z",
    releasedAt: "2024-01-29T10:00:00Z",
  },
  {
    id: "do-005",
    do_number: "DO-2024-005",
    do_date: "2024-02-05",
    status: DOStatus.DRAFT,
    items: [
      { id: "doi-005-1", doId: "do-005", productId: "prod-002", product: mockProducts[1], quantity: 25, unit: "Unit" },
    ],
    notes: "Draft - pending review",
    createdAt: "2024-01-29T11:00:00Z",
    updatedAt: "2024-01-29T11:00:00Z",
  },
  {
    id: "do-006",
    do_number: "DO-2024-006",
    do_date: "2024-01-22",
    status: DOStatus.CANCELLED,
    items: [],
    notes: "Cancelled - order postponed by HO",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
    cancelledAt: "2024-01-21T10:00:00Z",
    cancelReason: "Order postponed by HO",
  },
];

let mockFinishedGoodStock: FinishedGoodStock[] = [
  { productId: "prod-001", productCode: "MOTOR-X1", productName: "Electric Motor Type X1", quantity: 500, unit: "Unit", availableForDO: 390, lastUpdated: new Date().toISOString() },
  { productId: "prod-002", productCode: "MOTOR-X2", productName: "Electric Motor Type X2", quantity: 300, unit: "Unit", availableForDO: 225, lastUpdated: new Date().toISOString() },
  { productId: "prod-003", productCode: "GENERATOR-G1", productName: "Industrial Generator G1", quantity: 40, unit: "Unit", availableForDO: 30, lastUpdated: new Date().toISOString() },
];

// ============================================
// DELIVERY SERVICE
// ============================================

export const deliveryService = {
  // ============================================
  // DELIVERY ORDER CRUD
  // ============================================

  getDOs: async (filters?: DOFilters): Promise<DeliveryOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let results = [...mockDeliveryOrders];
      if (filters?.status && filters.status !== "all") results = results.filter((do_) => do_.status === filters.status);
      if (filters?.startDate || filters?.dateFrom) results = results.filter((do_) => do_.do_date >= (filters.startDate || filters.dateFrom)!);
      if (filters?.endDate || filters?.dateTo) results = results.filter((do_) => do_.do_date <= (filters.endDate || filters.dateTo)!);
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        results = results.filter((do_) => do_.do_number.toLowerCase().includes(search) || do_.notes?.toLowerCase().includes(search));
      }
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.startDate) params.append("start_date", filters.startDate);
    if (filters?.endDate) params.append("end_date", filters.endDate);
    if (filters?.search) params.append("search", filters.search);
    const response = await apiClient.get<DeliveryOrder[]>(`/delivery-orders?${params.toString()}`);
    return response.data || [];
  },

  getDOById: async (id: string): Promise<DeliveryOrder | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDeliveryOrders.find((do_) => do_.id === id) || null;
    }
    const response = await apiClient.get<DeliveryOrder>(`/delivery-orders/${id}`);
    return response.data || null;
  },

  createDO: async (data: DOFormData): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newId = `do-${Date.now()}`;
      const items: DOItem[] = data.items.map((item, idx) => ({
        id: `doi-${newId}-${idx}`,
        doId: newId,
        productId: item.productId,
        product: mockProducts.find((p) => p.id === item.productId),
        quantity: item.quantity,
        unit: mockProducts.find((p) => p.id === item.productId)?.baseUnit || "Unit",
      }));
      const newDO: DeliveryOrder = {
        id: newId,
        do_number: data.do_number,
        do_date: data.do_date,
        status: DOStatus.DRAFT,
        items,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDeliveryOrders.unshift(newDO);
      return newDO;
    }
    const response = await apiClient.post<DeliveryOrder>("/delivery-orders", data);
    if (!response.data) throw new Error("Failed to create delivery order");
    return response.data;
  },

  updateDO: async (id: string, data: UpdateDORequest): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status !== DOStatus.DRAFT) throw new Error("Can only edit draft delivery orders");
      if (data.do_number) do_.do_number = data.do_number;
      if (data.do_date) do_.do_date = data.do_date;
      if (data.notes !== undefined) do_.notes = data.notes;
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.put<DeliveryOrder>(`/delivery-orders/${id}`, data);
    if (!response.data) throw new Error("Failed to update delivery order");
    return response.data;
  },

  deleteDO: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockDeliveryOrders.findIndex((do_) => do_.id === id);
      if (index === -1) throw new Error("Delivery order not found");
      const do_ = mockDeliveryOrders[index];
      if (do_.status !== DOStatus.DRAFT) throw new Error("Can only delete draft delivery orders");
      mockDeliveryOrders.splice(index, 1);
      return;
    }
    await apiClient.delete(`/delivery-orders/${id}`);
  },

  // ============================================
  // DELIVERY ORDER STATUS TRANSITIONS
  // ============================================

  releaseDO: async (id: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status !== DOStatus.DRAFT) throw new Error("Can only release draft delivery orders");
      do_.status = DOStatus.RELEASED;
      do_.releasedAt = new Date().toISOString();
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/delivery-orders/${id}/release`);
    if (!response.data) throw new Error("Failed to release delivery order");
    return response.data;
  },

  startTransit: async (id: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status !== DOStatus.RELEASED) throw new Error("Can only start transit for released delivery orders");
      do_.status = DOStatus.IN_TRANSIT;
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/delivery-orders/${id}/transit`);
    if (!response.data) throw new Error("Failed to start transit");
    return response.data;
  },

  markDelivered: async (id: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (![DOStatus.IN_TRANSIT, DOStatus.RELEASED, DOStatus.PARTIALLY_DELIVERED].includes(do_.status)) {
        throw new Error("Can only mark in-transit or released delivery orders as delivered");
      }
      do_.status = DOStatus.DELIVERED;
      do_.deliveredAt = new Date().toISOString();
      do_.updatedAt = new Date().toISOString();
      // Update quantityDelivered
      do_.items.forEach((item) => {
        if (!item.quantityDelivered) item.quantityDelivered = item.quantity;
      });
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/delivery-orders/${id}/deliver`);
    if (!response.data) throw new Error("Failed to mark as delivered");
    return response.data;
  },

  markReceived: async (id: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status !== DOStatus.DELIVERED) throw new Error("Can only mark delivered orders as received");
      do_.status = DOStatus.RECEIVED;
      do_.receivedAt = new Date().toISOString();
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/delivery-orders/${id}/receive`);
    if (!response.data) throw new Error("Failed to mark as received");
    return response.data;
  },

  cancelDO: async (id: string, reason?: string): Promise<DeliveryOrder> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === id);
      if (!do_) throw new Error("Delivery order not found");
      if ([DOStatus.RECEIVED, DOStatus.CANCELLED].includes(do_.status)) {
        throw new Error("Cannot cancel received or already cancelled delivery orders");
      }
      do_.status = DOStatus.CANCELLED;
      do_.cancelReason = reason;
      do_.cancelledAt = new Date().toISOString();
      do_.updatedAt = new Date().toISOString();
      return do_;
    }
    const response = await apiClient.post<DeliveryOrder>(`/delivery-orders/${id}/cancel`, { reason });
    if (!response.data) throw new Error("Failed to cancel delivery order");
    return response.data;
  },

  // ============================================
  // DELIVERY ORDER ITEMS
  // ============================================

  addDOItem: async (doId: string, data: DOItemFormData): Promise<DOItem> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === doId);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status !== DOStatus.DRAFT) throw new Error("Can only add items to draft delivery orders");
      const item: DOItem = {
        id: `doi-${Date.now()}`,
        doId,
        productId: data.productId,
        product: mockProducts.find((p) => p.id === data.productId),
        quantity: data.quantity,
        unit: mockProducts.find((p) => p.id === data.productId)?.baseUnit || "Unit",
      };
      do_.items.push(item);
      do_.updatedAt = new Date().toISOString();
      return item;
    }
    const response = await apiClient.post<DOItem>(`/delivery-orders/${doId}/items`, data);
    if (!response.data) throw new Error("Failed to add item");
    return response.data;
  },

  updateDOItem: async (doId: string, itemId: string, data: { quantity?: number }): Promise<DOItem> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === doId);
      if (!do_) throw new Error("Delivery order not found");
      const item = do_.items.find((i) => i.id === itemId);
      if (!item) throw new Error("Item not found");
      if (data.quantity) item.quantity = data.quantity;
      do_.updatedAt = new Date().toISOString();
      return item;
    }
    const response = await apiClient.put<DOItem>(`/delivery-orders/${doId}/items/${itemId}`, data);
    if (!response.data) throw new Error("Failed to update item");
    return response.data;
  },

  removeDOItem: async (doId: string, itemId: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === doId);
      if (!do_) throw new Error("Delivery order not found");
      const index = do_.items.findIndex((i) => i.id === itemId);
      if (index === -1) throw new Error("Item not found");
      do_.items.splice(index, 1);
      do_.updatedAt = new Date().toISOString();
      return;
    }
    await apiClient.delete(`/delivery-orders/${doId}/items/${itemId}`);
  },

  // ============================================
  // BAST (BERITA ACARA SERAH TERIMA)
  // ============================================

  uploadBAST: async (doId: string, file: File): Promise<BASTOutbound> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const do_ = mockDeliveryOrders.find((d) => d.id === doId);
      if (!do_) throw new Error("Delivery order not found");
      if (do_.status !== DOStatus.DELIVERED) throw new Error("Can only upload BAST for delivered orders");
      const bast: BASTOutbound = {
        id: `bast-${Date.now()}`,
        doId,
        bast_number: `BAST-${do_.do_number.replace("DO-", "")}`,
        bast_date: new Date().toISOString().split("T")[0],
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      };
      do_.bastOutbound = bast;
      do_.updatedAt = new Date().toISOString();
      return bast;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<BASTOutbound>(`/delivery-orders/${doId}/bast`, formData);
    if (!response.data) throw new Error("Failed to upload BAST");
    return response.data;
  },

  getBAST: async (doId: string): Promise<BASTOutbound | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const do_ = mockDeliveryOrders.find((d) => d.id === doId);
      return do_?.bastOutbound || null;
    }
    const response = await apiClient.get<BASTOutbound>(`/delivery-orders/${doId}/bast`);
    return response.data || null;
  },

  // ============================================
  // FINISHED GOODS STOCK
  // ============================================

  getFinishedGoodStock: async (): Promise<FinishedGoodStock[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockFinishedGoodStock;
    }
    const response = await apiClient.get<FinishedGoodStock[]>("/stock/finished-goods");
    return response.data || [];
  },

  // ============================================
  // REPORTS
  // ============================================

  getDOStatusSummary: async (): Promise<{ status: DOStatusType; count: number }[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const summary: Partial<Record<DOStatusType, number>> = {};
      mockDeliveryOrders.forEach((do_) => {
        summary[do_.status] = (summary[do_.status] || 0) + 1;
      });
      return Object.entries(summary).map(([status, count]) => ({ status: status as DOStatusType, count: count || 0 }));
    }
    const response = await apiClient.get<{ status: DOStatusType; count: number }[]>("/reports/do-status-summary");
    return response.data || [];
  },

  getDeliveryMetrics: async (): Promise<{
    totalDOs: number;
    deliveredDOs: number;
    inTransitDOs: number;
    avgDeliveryTime: number;
    onTimeRate: number;
  }> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalDOs: mockDeliveryOrders.length,
        deliveredDOs: mockDeliveryOrders.filter((do_) => [DOStatus.DELIVERED, DOStatus.RECEIVED].includes(do_.status)).length,
        inTransitDOs: mockDeliveryOrders.filter((do_) => do_.status === DOStatus.IN_TRANSIT).length,
        avgDeliveryTime: 2.5,
        onTimeRate: 92,
      };
    }
    const response = await apiClient.get<{
      totalDOs: number;
      deliveredDOs: number;
      inTransitDOs: number;
      avgDeliveryTime: number;
      onTimeRate: number;
    }>("/reports/delivery-metrics");
    return response.data || { totalDOs: 0, deliveredDOs: 0, inTransitDOs: 0, avgDeliveryTime: 0, onTimeRate: 0 };
  },

  exportDOReport: async (format: "csv" | "pdf"): Promise<void> => {
    if (USE_MOCK_DATA) {
      const headers = ["DO Number", "Date", "Status", "Items", "Notes", "Created At"];
      const rows = mockDeliveryOrders.map((do_) => [
        do_.do_number,
        do_.do_date,
        do_.status,
        `${do_.items.length} items`,
        do_.notes || "-",
        do_.createdAt,
      ]);
      if (format === "csv") {
        const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `DO-Report-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
      }
      return;
    }
    const url = `${import.meta.env.VITE_API_URL || "http://localhost:8787"}/reports/do/export?format=${format}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `DO-Report-${new Date().toISOString().split("T")[0]}.${format}`;
    link.click();
  },

  // ============================================
  // HELPERS
  // ============================================

  getDOsPendingDelivery: async (): Promise<DeliveryOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDeliveryOrders.filter((do_) => [DOStatus.RELEASED, DOStatus.IN_TRANSIT].includes(do_.status));
    }
    const response = await apiClient.get<DeliveryOrder[]>("/delivery-orders/pending");
    return response.data || [];
  },

  getDOsPendingBAST: async (): Promise<DeliveryOrder[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDeliveryOrders.filter((do_) => do_.status === DOStatus.DELIVERED && !do_.bastOutbound);
    }
    const response = await apiClient.get<DeliveryOrder[]>("/delivery-orders/pending-bast");
    return response.data || [];
  },

  generateDONumber: async (): Promise<string> => {
    if (USE_MOCK_DATA) {
      const count = mockDeliveryOrders.length + 1;
      return `DO-2024-${String(count).padStart(3, "0")}`;
    }
    const response = await apiClient.get<{ do_number: string }>("/delivery-orders/generate-number");
    return response.data?.do_number || `DO-${Date.now()}`;
  },
};

// Export types
export type { DeliveryOrder, DOItem, DOFilters, BASTOutbound, FinishedGoodStock };