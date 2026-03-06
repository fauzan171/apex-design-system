/**
 * Purchasing Module Types (for MR to PR conversion)
 */

export enum PurchaseRequestStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PROCESSING = "Processing",
  DO_ISSUED = "DO Issued",
  CLOSED = "Closed",
}

export interface PRItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  requestDate: string;
  requiredDate: string;
  status: PurchaseRequestStatus;
  sourcePlanId?: string;
  sourcePlanNumber?: string;
  items: PRItem[];
  notes?: string;
  createdBy: string;
  createdAt: string;
}