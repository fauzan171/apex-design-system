/**
 * Delivery Module Mock Data
 * Based on PRD-05-WAREHOUSE.md - Delivery Order (Outbound to HO)
 *
 * This data is for frontend development and QA testing.
 * Will be replaced with API calls in production.
 */

import type {
  DeliveryOrder,
  DOItem,
  FinishedGoodStock,
  BASTOutbound,
} from "@/types/delivery";
import { DOStatus, BASTStatus } from "@/types/delivery";

// ============================================
// FINISHED GOODS STOCK (Mock Data)
// ============================================

export const mockFinishedGoodsStock: FinishedGoodStock[] = [
  {
    productId: "prod-001",
    productCode: "MOTOR-X1",
    productName: "Electric Motor Type X1",
    quantity: 50,
    unit: "Unit",
    availableForDO: 50,
    lastUpdated: "2024-01-20T10:00:00Z",
  },
  {
    productId: "prod-002",
    productCode: "MOTOR-X2",
    productName: "Electric Motor Type X2",
    quantity: 35,
    unit: "Unit",
    availableForDO: 35,
    lastUpdated: "2024-01-19T14:00:00Z",
  },
  {
    productId: "prod-003",
    productCode: "GENERATOR-G1",
    productName: "Industrial Generator G1",
    quantity: 20,
    unit: "Unit",
    availableForDO: 20,
    lastUpdated: "2024-01-18T09:00:00Z",
  },
];

// ============================================
// DELIVERY ORDERS
// ============================================

export const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: "do-001",
    doNumber: "DO-2024-0001",
    doDate: "2024-01-20",
    status: DOStatus.RECEIVED,
    items: [
      {
        id: "doi-001",
        doId: "do-001",
        productId: "prod-001",
        productCode: "MOTOR-X1",
        productName: "Electric Motor Type X1",
        quantity: 30,
        unit: "Unit",
        stockBefore: 80,
        stockAfter: 50,
      },
    ],
    bast: {
      id: "bast-001",
      doId: "do-001",
      doNumber: "DO-2024-0001",
      bastNumber: "BAST-OUT-2024-0001",
      documentPath: "/documents/bast/BAST-OUT-2024-0001.pdf",
      uploadedAt: "2024-01-23T10:00:00Z",
      receivedDate: "2024-01-23",
      status: BASTStatus.UPLOADED,
    },
    statusHistory: [
      {
        id: "sh-001-1",
        doId: "do-001",
        status: DOStatus.DRAFT,
        timestamp: "2024-01-20T08:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
      {
        id: "sh-001-2",
        doId: "do-001",
        status: DOStatus.RELEASED,
        timestamp: "2024-01-20T09:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
      {
        id: "sh-001-3",
        doId: "do-001",
        status: DOStatus.IN_TRANSIT,
        timestamp: "2024-01-20T10:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
      {
        id: "sh-001-4",
        doId: "do-001",
        status: DOStatus.DELIVERED,
        timestamp: "2024-01-22T14:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
      {
        id: "sh-001-5",
        doId: "do-001",
        status: DOStatus.RECEIVED,
        timestamp: "2024-01-23T10:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
        notes: "BAST uploaded from HO",
      },
    ],
    notes: "Priority delivery for Q1 order",
    createdBy: "user-001",
    createdAt: "2024-01-20T08:00:00Z",
    releasedAt: "2024-01-20T09:00:00Z",
    releasedBy: "user-001",
    deliveredAt: "2024-01-22T14:00:00Z",
    receivedAt: "2024-01-23T10:00:00Z",
  },
  {
    id: "do-002",
    doNumber: "DO-2024-0002",
    doDate: "2024-01-21",
    status: DOStatus.IN_TRANSIT,
    items: [
      {
        id: "doi-002-1",
        doId: "do-002",
        productId: "prod-002",
        productCode: "MOTOR-X2",
        productName: "Electric Motor Type X2",
        quantity: 20,
        unit: "Unit",
        stockBefore: 55,
        stockAfter: 35,
      },
      {
        id: "doi-002-2",
        doId: "do-002",
        productId: "prod-003",
        productCode: "GENERATOR-G1",
        productName: "Industrial Generator G1",
        quantity: 5,
        unit: "Unit",
        stockBefore: 25,
        stockAfter: 20,
      },
    ],
    statusHistory: [
      {
        id: "sh-002-1",
        doId: "do-002",
        status: DOStatus.DRAFT,
        timestamp: "2024-01-21T07:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
      {
        id: "sh-002-2",
        doId: "do-002",
        status: DOStatus.RELEASED,
        timestamp: "2024-01-21T08:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
      {
        id: "sh-002-3",
        doId: "do-002",
        status: DOStatus.IN_TRANSIT,
        timestamp: "2024-01-21T09:30:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
    ],
    notes: "Standard batch delivery",
    createdBy: "user-001",
    createdAt: "2024-01-21T07:00:00Z",
    releasedAt: "2024-01-21T08:00:00Z",
    releasedBy: "user-001",
  },
  {
    id: "do-003",
    doNumber: "DO-2024-0003",
    doDate: "2024-01-22",
    status: DOStatus.DRAFT,
    items: [
      {
        id: "doi-003-1",
        doId: "do-003",
        productId: "prod-001",
        productCode: "MOTOR-X1",
        productName: "Electric Motor Type X1",
        quantity: 10,
        unit: "Unit",
      },
    ],
    statusHistory: [
      {
        id: "sh-003-1",
        doId: "do-003",
        status: DOStatus.DRAFT,
        timestamp: "2024-01-22T14:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
    ],
    createdBy: "user-001",
    createdAt: "2024-01-22T14:00:00Z",
  },
  {
    id: "do-004",
    doNumber: "DO-2024-0004",
    doDate: "2024-01-18",
    status: DOStatus.CANCELLED,
    items: [
      {
        id: "doi-004-1",
        doId: "do-004",
        productId: "prod-002",
        productCode: "MOTOR-X2",
        productName: "Electric Motor Type X2",
        quantity: 15,
        unit: "Unit",
      },
    ],
    statusHistory: [
      {
        id: "sh-004-1",
        doId: "do-004",
        status: DOStatus.DRAFT,
        timestamp: "2024-01-18T10:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
      },
      {
        id: "sh-004-2",
        doId: "do-004",
        status: DOStatus.CANCELLED,
        timestamp: "2024-01-18T11:00:00Z",
        userId: "user-001",
        userName: "Ahmad Operator",
        notes: "Order cancelled by HO due to priority change",
      },
    ],
    cancelReason: "Order cancelled by HO due to priority change",
    createdBy: "user-001",
    createdAt: "2024-01-18T10:00:00Z",
    cancelledAt: "2024-01-18T11:00:00Z",
  },
];

// ============================================
// BAST DOCUMENTS
// ============================================

export const mockBASTDocuments: BASTOutbound[] = [
  {
    id: "bast-001",
    doId: "do-001",
    doNumber: "DO-2024-0001",
    bastNumber: "BAST-OUT-2024-0001",
    documentPath: "/documents/bast/BAST-OUT-2024-0001.pdf",
    uploadedAt: "2024-01-23T10:00:00Z",
    receivedDate: "2024-01-23",
    status: BASTStatus.UPLOADED,
  },
];

// ============================================
// SERVICE FUNCTIONS
// ============================================

export const deliveryService = {
  /**
   * Get all delivery orders with optional filters
   */
  getDOs: async (filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<DeliveryOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let dos = [...mockDeliveryOrders];

    if (filters?.status && filters.status !== "all") {
      dos = dos.filter((d) => d.status === filters.status);
    }

    if (filters?.dateFrom) {
      dos = dos.filter((d) => d.doDate >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      dos = dos.filter((d) => d.doDate <= filters.dateTo!);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      dos = dos.filter((d) => d.doNumber.toLowerCase().includes(search));
    }

    return dos.sort((a, b) => b.doDate.localeCompare(a.doDate));
  },

  /**
   * Get a single delivery order by ID
   */
  getDOById: async (id: string): Promise<DeliveryOrder | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDeliveryOrders.find((d) => d.id === id) || null;
  },

  /**
   * Get finished goods stock
   */
  getFinishedGoodsStock: async (): Promise<FinishedGoodStock[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockFinishedGoodsStock;
  },

  /**
   * Create a new delivery order
   */
  createDO: async (data: {
    doDate: string;
    notes?: string;
    items: { productId: string; quantity: number }[];
  }): Promise<DeliveryOrder> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const doNumber = `DO-2024-${String(mockDeliveryOrders.length + 1).padStart(4, "0")}`;
    const newId = `do-${Date.now()}`;

    const items: DOItem[] = data.items.map((item, idx) => {
      const stock = mockFinishedGoodsStock.find((s) => s.productId === item.productId);
      return {
        id: `doi-${newId}-${idx}`,
        doId: newId,
        productId: item.productId,
        productCode: stock?.productCode || "",
        productName: stock?.productName || "",
        quantity: item.quantity,
        unit: stock?.unit || "Unit",
      };
    });

    const newDO: DeliveryOrder = {
      id: newId,
      doNumber,
      doDate: data.doDate,
      status: DOStatus.DRAFT,
      items,
      statusHistory: [
        {
          id: `sh-${newId}-1`,
          doId: newId,
          status: DOStatus.DRAFT,
          timestamp: new Date().toISOString(),
          userId: "user-001",
          userName: "Ahmad Operator",
        },
      ],
      notes: data.notes,
      createdBy: "user-001",
      createdAt: new Date().toISOString(),
    };

    mockDeliveryOrders.unshift(newDO);
    return newDO;
  },

  /**
   * Update DO status
   */
  updateDOStatus: async (
    doId: string,
    newStatus: DOStatus,
    notes?: string
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const do_ = mockDeliveryOrders.find((d) => d.id === doId);
    if (!do_) throw new Error("DO not found");

    // Update stock when releasing
    if (newStatus === DOStatus.RELEASED && do_.status === DOStatus.DRAFT) {
      do_.items.forEach((item) => {
        const stock = mockFinishedGoodsStock.find((s) => s.productId === item.productId);
        if (stock) {
          item.stockBefore = stock.quantity;
          stock.quantity -= item.quantity;
          stock.availableForDO -= item.quantity;
          item.stockAfter = stock.quantity;
        }
      });
      do_.releasedAt = new Date().toISOString();
      do_.releasedBy = "user-001";
    }

    // Update status
    do_.status = newStatus;

    // Add status history
    do_.statusHistory.push({
      id: `sh-${doId}-${Date.now()}`,
      doId,
      status: newStatus,
      timestamp: new Date().toISOString(),
      userId: "user-001",
      userName: "Ahmad Operator",
      notes,
    });

    // Update timestamps
    if (newStatus === DOStatus.DELIVERED) {
      do_.deliveredAt = new Date().toISOString();
    }
    if (newStatus === DOStatus.RECEIVED) {
      do_.receivedAt = new Date().toISOString();
    }
    if (newStatus === DOStatus.CANCELLED) {
      do_.cancelledAt = new Date().toISOString();
      do_.cancelReason = notes;

      // Return stock if cancelling from released state
      do_.items.forEach((item) => {
        const stock = mockFinishedGoodsStock.find((s) => s.productId === item.productId);
        if (stock && item.stockBefore !== undefined) {
          stock.quantity += item.quantity;
          stock.availableForDO += item.quantity;
        }
      });
    }
  },

  /**
   * Cancel DO
   */
  cancelDO: async (doId: string, reason: string): Promise<void> => {
    await deliveryService.updateDOStatus(doId, DOStatus.CANCELLED, reason);
  },

  /**
   * Upload BAST
   */
  uploadBAST: async (
    doId: string,
    file: File,
    receivedDate: string,
    notes?: string
  ): Promise<BASTOutbound> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const do_ = mockDeliveryOrders.find((d) => d.id === doId);
    if (!do_) throw new Error("DO not found");

    const bastNumber = `BAST-OUT-2024-${String(mockBASTDocuments.length + 1).padStart(4, "0")}`;

    const bast: BASTOutbound = {
      id: `bast-${Date.now()}`,
      doId,
      doNumber: do_.doNumber,
      bastNumber,
      documentPath: URL.createObjectURL(file), // In real app, this would be server path
      uploadedAt: new Date().toISOString(),
      receivedDate,
      status: BASTStatus.UPLOADED,
      notes,
    };

    do_.bast = bast;
    do_.status = DOStatus.RECEIVED;
    do_.receivedAt = new Date().toISOString();

    do_.statusHistory.push({
      id: `sh-${doId}-${Date.now()}`,
      doId,
      status: DOStatus.RECEIVED,
      timestamp: new Date().toISOString(),
      userId: "user-001",
      userName: "Ahmad Operator",
      notes: `BAST uploaded: ${bastNumber}`,
    });

    mockBASTDocuments.push(bast);
    return bast;
  },

  /**
   * Delete DO item (only in Draft status)
   */
  deleteDOItem: async (doId: string, itemId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const do_ = mockDeliveryOrders.find((d) => d.id === doId);
    if (!do_) throw new Error("DO not found");
    if (do_.status !== DOStatus.DRAFT) {
      throw new Error("Cannot delete item from non-Draft DO");
    }

    do_.items = do_.items.filter((item) => item.id !== itemId);
  },

  /**
   * Update DO item quantity (only in Draft status)
   */
  updateDOItemQuantity: async (
    doId: string,
    itemId: string,
    quantity: number
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const do_ = mockDeliveryOrders.find((d) => d.id === doId);
    if (!do_) throw new Error("DO not found");
    if (do_.status !== DOStatus.DRAFT) {
      throw new Error("Cannot update item in non-Draft DO");
    }

    const item = do_.items.find((i) => i.id === itemId);
    if (!item) throw new Error("Item not found");

    item.quantity = quantity;
  },

  /**
   * Add item to DO (only in Draft status)
   */
  addDOItem: async (
    doId: string,
    productId: string,
    quantity: number
  ): Promise<DOItem> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const do_ = mockDeliveryOrders.find((d) => d.id === doId);
    if (!do_) throw new Error("DO not found");
    if (do_.status !== DOStatus.DRAFT) {
      throw new Error("Cannot add item to non-Draft DO");
    }

    const stock = mockFinishedGoodsStock.find((s) => s.productId === productId);
    if (!stock) throw new Error("Product not found in stock");

    // Check if item already exists
    const existingItem = do_.items.find((i) => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem;
    }

    const newItem: DOItem = {
      id: `doi-${Date.now()}`,
      doId,
      productId,
      productCode: stock.productCode,
      productName: stock.productName,
      quantity,
      unit: stock.unit,
    };

    do_.items.push(newItem);
    return newItem;
  },

  /**
   * Export packing list
   */
  exportPackingList: async (doId: string): Promise<void> => {
    const do_ = mockDeliveryOrders.find((d) => d.id === doId);
    if (!do_) throw new Error("DO not found");

    // Generate packing list CSV
    const headers = ["No", "Product Code", "Product Name", "Quantity", "Unit"];
    const rows = do_.items.map((item, idx) => [
      idx + 1,
      item.productCode,
      `"${item.productName}"`,
      item.quantity,
      item.unit,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Packing-List-${do_.doNumber}.csv`;
    link.click();
  },

  /**
   * Print DO document
   */
  printDO: (do_: DeliveryOrder): void => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Delivery Order - ${do_.doNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { font-size: 18px; margin-bottom: 10px; }
          .info { margin-bottom: 20px; }
          .info p { margin: 4px 0; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .footer { margin-top: 30px; font-size: 11px; }
          .signature { display: flex; justify-content: space-between; margin-top: 50px; }
          .signature-box { width: 200px; text-align: center; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>DELIVERY ORDER</h1>
        <div class="info">
          <p><strong>DO Number:</strong> ${do_.doNumber}</p>
          <p><strong>DO Date:</strong> ${do_.doDate}</p>
          <p><strong>Status:</strong> ${do_.status}</p>
          ${do_.notes ? `<p><strong>Notes:</strong> ${do_.notes}</p>` : ""}
        </div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            ${do_.items
              .map(
                (item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.quantity.toLocaleString()}</td>
                <td>${item.unit}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="signature">
          <div class="signature-box">
            <p>Prepared By:</p>
            <br /><br />
            <p>_______________</p>
          </div>
          <div class="signature-box">
            <p>Received By:</p>
            <br /><br />
            <p>_______________</p>
          </div>
        </div>
        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString("id-ID")}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  },
};