# Apex ERP Dashboard - Complete API Implementation Plan

> **Master Implementation Prompt for removing all mock data and implementing 100% real API integration**
>
> Target API: `https://apex-erp-be-staging.itobsidianmuda.workers.dev/api/v1`
>
> This document contains the complete implementation plan with specific prompts for each module.

---

## 🎯 Primary Objective

**Remove ALL mock data files and implement 100% real API integration across the entire ERP dashboard frontend.**

### Current State

- ✅ Frontend structure complete (React + TypeScript + Vite + Tailwind)
- ✅ Mock data files exist in `src/data/`
- ✅ Services have conditional logic (`USE_MOCK_DATA`)
- ❌ Not connected to real staging API

### Target State

- ❌ Remove all mock data files
- ✅ All services use real API endpoints
- ✅ Complete TypeScript type safety from OpenAPI spec
- ✅ Proper error handling and loading states
- ✅ Production-ready frontend

---

## 📁 Files to DELETE (Mock Data)

Delete these files completely:

```bash
# Navigate to erp-dashboard directory
cd /Users/mekari/apex-design-system/erp-dashboard

# Delete all mock data files
rm src/data/mockData.ts
rm src/data/mockDeliveryData.ts
rm src/data/mockMasterData.ts
rm src/data/mockPlanningData.ts
rm src/data/mockProductionData.ts
rm src/data/mockPurchasingData.ts
rm src/data/mockUserData.ts
rm src/data/mockWarehouseData.ts
```

---

## 🔧 Environment Configuration

Update `.env.local`:

```env
VITE_API_URL=https://apex-erp-be-staging.itobsidianmuda.workers.dev
VITE_USE_MOCK_DATA=false
```

---

## 📋 Implementation Checklist by Module

### Phase 1: Foundation (Priority: CRITICAL)

- [ ] Update `apiClient.ts` with all endpoints
- [ ] Update `AuthContext.tsx` with real auth
- [ ] Delete mock data files
- [ ] Update all TypeScript types

### Phase 2: Core Modules (Priority: HIGH)

- [ ] Planning Module (Production Plans)
- [ ] Production Module (Work Orders + QC)
- [ ] Purchasing Module (PR + DO)
- [ ] Warehouse Module (Stock + GR + GI)

### Phase 3: Supporting Modules (Priority: MEDIUM)

- [ ] Master Data Module (Products + BOM)
- [ ] User Management Module (Users + Roles)
- [ ] Dashboard Module (KPIs + Analytics)
- [ ] Delivery Module

### Phase 4: Polish (Priority: LOW)

- [ ] Import/Export functionality
- [ ] Reports and exports
- [ ] Photo uploads
- [ ] BAST generation

---

## 🚀 Implementation Prompts

Use these prompts with Claude Code (GLM5 model) or delegate to agent swarm.

---

### PROMPT 1: Foundation Setup

````markdown
# TASK: Foundation Setup - API Client & Auth Integration

## CONTEXT

I need to set up the foundation for real API integration in the Apex ERP Dashboard.
The staging API is at: https://apex-erp-be-staging.itobsidianmuda.workers.dev/api/v1

## REQUIREMENTS

1. Update apiClient.ts with complete authentication methods
2. Update AuthContext.tsx to use real API
3. Handle JWT token storage and refresh
4. Implement proper error handling
5. Add request/response interceptors if needed

## FILES TO MODIFY

### 1. src/lib/apiClient.ts

Add/Update these methods:

```typescript
- login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>>
- logout(): Promise<ApiResponse<void>>
- getCurrentUser(): Promise<ApiResponse<User>>
- changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>>
```
````

### 2. src/contexts/AuthContext.tsx

Update to:

- Call real login API
- Store JWT token in localStorage
- Auto-fetch current user on mount
- Handle token expiration
- Implement logout properly

### 3. src/pages/auth/LoginPage.tsx

Update to:

- Use real auth service
- Handle authentication errors
- Redirect to dashboard on success
- Show proper error messages

### 4. src/pages/auth/ChangePasswordPage.tsx

Update to:

- Call real change password API
- Validate passwords match
- Enforce minimum 6 characters

## TYPES NEEDED (from openapi.yaml)

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  department:
    | "GA"
    | "FINANCE"
    | "PURCHASING"
    | "WAREHOUSE"
    | "PRODUCTION"
    | "QC"
    | "PLANNING"
    | "SALES";
  role: string;
  status: "active" | "inactive";
  forceChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## API ENDPOINTS

```
POST /api/v1/auth/login
  Request: { email, password }
  Response: { success: boolean, data: { token: string, user: User } }

POST /api/v1/auth/logout
  Response: { success: boolean }

GET /api/v1/auth/me
  Response: { success: boolean, data: User }

POST /api/v1/auth/change-password
  Request: { currentPassword, newPassword, confirmPassword }
  Response: { success: boolean }
```

## ACCEPTANCE CRITERIA

- [ ] Login persists after page refresh
- [ ] Logout clears auth state and token
- [ ] Protected routes redirect to login when not authenticated
- [ ] Token stored in localStorage
- [ ] Auto-logout on 401 responses
- [ ] Error messages are user-friendly
- [ ] Loading states during auth operations

## EXECUTION

Execute this task now. Show me the complete updated code for each file.

````

---

### PROMPT 2: Planning Module Implementation

```markdown
# TASK: Planning Module - Complete API Integration

## CONTEXT
Implement complete Production Planning module with real API integration.
Remove ALL mock data and use staging API endpoints.

## SCOPE
- Production Plan CRUD operations
- Plan approval workflow
- Material Requirements calculation
- Create PR from MR
- Create WO from plan item

## FILES TO DELETE
- src/data/mockPlanningData.ts

## FILES TO MODIFY

### 1. src/services/planningService.ts
COMPLETE REWRITE required:
- Remove all mock data imports
- Remove USE_MOCK_DATA conditional logic
- Implement all methods using real API
- Add proper error handling

### 2. src/pages/planning/PlanningListPage.tsx
- Fetch from GET /api/v1/production-plans
- Implement server-side pagination
- Implement filters (status, date range, search)
- Add loading skeletons
- Handle empty states

### 3. src/pages/planning/PlanningDetailPage.tsx
- Fetch plan detail
- Show approval history
- Display material requirements
- Action buttons based on status

### 4. src/pages/planning/PlanningFormPage.tsx
- Create/Update plans
- Add plan items
- Manage material priorities
- Fetch products and BOM materials

### 5. src/types/planning.ts
Update all types to match OpenAPI spec exactly

## API ENDPOINTS TO IMPLEMENT

### Production Plans
````

GET /api/v1/production-plans
Query: status, plan_date_from, plan_date_to, page, limit, sortBy, sortOrder

POST /api/v1/production-plans
Body: { plan_date, target_completion_date, ho_order_reference?, notes?, items? }

GET /api/v1/production-plans/{id}

PUT /api/v1/production-plans/{id}
Body: { plan_date?, target_completion_date?, ho_order_reference?, notes? }

DELETE /api/v1/production-plans/{id}

```

### Plan Actions
```

POST /api/v1/production-plans/{id}/submit
Body: { notes? }

POST /api/v1/production-plans/{id}/approve
Body: { notes? }

POST /api/v1/production-plans/{id}/reject
Body: { reason }

POST /api/v1/production-plans/{id}/cancel
Body: { reason }

POST /api/v1/production-plans/{id}/request-edit
Body: { reason }

```

### Plan Items
```

POST /api/v1/production-plans/{id}/items
Body: { product_id, quantity, material_priorities? }

PUT /api/v1/production-plans/{id}/items/{itemId}
Body: { quantity?, material_priorities? }

DELETE /api/v1/production-plans/{id}/items/{itemId}

```

### Material Requirements
```

GET /api/v1/production-plans/{id}/material-requirements

POST /api/v1/production-plans/{id}/create-pr
Body: { items: [{ materialId, quantity }], required_date, priority, notes? }

POST /api/v1/production-plans/{id}/items/{itemId}/create-wo
Body: { target_date, notes? }

````

## TYPES FROM OPENAPI.YAML

```typescript
interface ProductionPlan {
  id: string
  plan_number: string
  plan_date: string
  target_completion_date: string
  ho_order_reference?: string
  notes?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'edit_requested'
  items: ProductionPlanItem[]
  approvalHistory: ApprovalHistory[]
  createdAt: string
  updatedAt: string
}

interface ProductionPlanItem {
  id: string
  planId: string
  productId: string
  product: Product
  quantity: number
  material_priorities?: Record<string, number>
  status: string
  materialRequirements: MaterialRequirement[]
}

interface MaterialRequirement {
  id: string
  itemId: string
  materialId: string
  material: Product
  requiredQuantity: number
  availableStock: number
  shortageQuantity: number
  status: 'pending' | 'allocated' | 'purchased' | 'received' | 'shortage_accepted'
  priority_weight?: number
}

interface ApprovalHistory {
  id: string
  entityType: string
  entityId: string
  approverId: string
  approver: User
  action: 'approve' | 'reject' | 'request_edit'
  notes?: string
  createdAt: string
}
````

## ACCEPTANCE CRITERIA

- [ ] All CRUD operations work with real API
- [ ] Pagination works (page, limit, total, totalPages)
- [ ] Filters apply server-side
- [ ] Approval workflow complete (submit, approve, reject, cancel, request_edit)
- [ ] Material requirements display correctly
- [ ] Can create PR from MR items
- [ ] Can create WO from plan item
- [ ] No mock data references anywhere
- [ ] Proper loading states with skeletons
- [ ] Error handling with toast notifications
- [ ] TypeScript types match OpenAPI exactly

## EXECUTION

Execute this task now. Show complete code for each file.

````

---

### PROMPT 3: Production Module Implementation

```markdown
# TASK: Production Module - Complete API Integration

## CONTEXT
Implement complete Work Order management with progress tracking, step management, and QC workflow.

## SCOPE
- Work Order CRUD
- WO lifecycle (release, start, mark QC, complete, cancel)
- Step management
- Progress tracking with photos
- QC sessions and findings
- Rework workflow

## FILES TO DELETE
- src/data/mockProductionData.ts

## FILES TO MODIFY

### 1. src/services/productionService.ts
COMPLETE REWRITE - Remove all mock data

### 2. src/pages/production/WorkOrderListPage.tsx
- Fetch from GET /api/v1/production/work-orders
- Implement filters and pagination

### 3. src/pages/production/WorkOrderDetailPage.tsx
- Show WO detail with steps and progress
- Display QC sessions
- Action buttons based on status

### 4. src/pages/production/WorkOrderFormPage.tsx
- Create/Update WOs
- Manage steps
- Set target dates

### 5. src/types/production.ts
Update all types from OpenAPI

## API ENDPOINTS

### Work Orders
````

GET /api/v1/production/work-orders
Query: status, planId, page, limit, search

POST /api/v1/production/work-orders
Body: { plan_id?, product_id, quantity, target_date, notes? }

GET /api/v1/production/work-orders/{id}

PUT /api/v1/production/work-orders/{id}
Body: { target_date?, notes? }

DELETE /api/v1/production/work-orders/{id}

```

### WO Lifecycle
```

POST /api/v1/production/work-orders/{id}/release
POST /api/v1/production/work-orders/{id}/start
POST /api/v1/production/work-orders/{id}/mark-qc
POST /api/v1/production/work-orders/{id}/complete
POST /api/v1/production/work-orders/{id}/cancel
Body: { reason }

```

### WO Steps
```

GET /api/v1/production/work-orders/{id}/steps
POST /api/v1/production/work-orders/{id}/steps
Body: { name, sequence }

PUT /api/v1/production/work-orders/{id}/steps/{stepId}
Body: { name?, sequence?, status? }

DELETE /api/v1/production/work-orders/{id}/steps/{stepId}

PUT /api/v1/production/work-orders/{id}/steps/reorder
Body: { stepIds: string[] }

POST /api/v1/production/work-orders/{id}/steps/{stepId}/start
POST /api/v1/production/work-orders/{id}/steps/{stepId}/complete

```

### Progress Tracking
```

GET /api/v1/production/work-orders/{id}/progress
POST /api/v1/production/work-orders/{id}/progress
Body: { quantity, notes?, step_id? }

GET /api/v1/production/work-orders/{id}/progress/history

```

### Progress Photos
```

GET /api/v1/production/progress/{progressId}/photos

POST /api/v1/production/progress/{progressId}/photos
Content-Type: multipart/form-data
Body: { file, caption? }

PATCH /api/v1/production/progress/{progressId}/photos/{photoId}
Body: { caption }

DELETE /api/v1/production/progress/{progressId}/photos/{photoId}

POST /api/v1/production/progress/{progressId}/photos/upload-url
Body: { filename, contentType }

POST /api/v1/production/progress/{progressId}/photos/confirm
Body: { uploadId, key }

```

### QC Sessions
```

GET /api/v1/production/qc-sessions
Query: status, result, page, limit

GET /api/v1/production/qc-sessions/{sessionId}

POST /api/v1/production/work-orders/{id}/qc/start

GET /api/v1/production/qc-sessions/{sessionId}/findings

POST /api/v1/production/qc-sessions/{sessionId}/findings
Body: { description, reworkNotes }

POST /api/v1/production/qc-sessions/{sessionId}/pass
Body: { notes? }

POST /api/v1/production/qc-sessions/{sessionId}/fail
Body: { notes? }

```

### QC Findings
```

GET /api/v1/production/qc-findings/{findingId}

PUT /api/v1/production/qc-findings/{findingId}
Body: { description?, reworkNotes? }

DELETE /api/v1/production/qc-findings/{findingId}

POST /api/v1/production/qc-findings/{findingId}/resolve

GET /api/v1/production/qc-findings/{findingId}/photos

POST /api/v1/production/qc-findings/{findingId}/photos
Content-Type: multipart/form-data
Body: { file, type: 'finding' | 'rework' }

DELETE /api/v1/production/qc-findings/{findingId}/photos/{photoId}

POST /api/v1/production/qc-findings/{findingId}/rework-photos
Content-Type: multipart/form-data
Body: { file }

````

## TYPES FROM OPENAPI.YAML

```typescript
interface WorkOrder {
  id: string
  wo_number: string
  planId?: string
  planNumber?: string
  productId: string
  productCode: string
  productName: string
  quantity: number
  quantityCompleted: number
  unit: string
  status: 'draft' | 'released' | 'in_progress' | 'marked_qc' | 'qc_in_progress' | 'qc_passed' | 'qc_failed' | 'completed' | 'cancelled'
  targetDate: string
  startDate?: string
  steps: WOStep[]
  progress?: WOProgress
  qcSessions?: QCSession[]
  reworkNotes?: string
  cancellationReason?: string
  createdAt: string
  releasedAt?: string
  completedAt?: string
  cancelledAt?: string
}

interface WOStep {
  id: string
  woId: string
  name: string
  sequence: number
  status: 'pending' | 'in_progress' | 'completed'
  startedAt?: string
  completedAt?: string
}

interface WOProgress {
  id: string
  woId: string
  currentStepId?: string
  quantity: number
  notes?: string
  photos?: ProgressPhoto[]
  createdAt: string
  updatedAt: string
}

interface ProgressPhoto {
  id: string
  progressId: string
  url: string
  caption?: string
  uploadedAt: string
}

interface QCSession {
  id: string
  woId: string
  workOrder?: WorkOrder
  status: 'in_progress' | 'completed'
  result: 'pass' | 'fail' | 'pending'
  notes?: string
  findings?: QCFinding[]
  createdAt: string
  updatedAt: string
  qcBy?: string
  qcByName?: string
  qcAt?: string
}

interface QCFinding {
  id: string
  sessionId: string
  description: string
  reworkNotes: string
  status: 'open' | 'resolved'
  photos?: QCFindingPhoto[]
  resolvedAt?: string
  createdAt: string
}

interface QCFindingPhoto {
  id: string
  findingId: string
  url: string
  type: 'finding' | 'rework'
  uploadedAt: string
}
````

## ACCEPTANCE CRITERIA

- [ ] Complete WO lifecycle implemented
- [ ] Step management (add, update, reorder, start, complete)
- [ ] Progress tracking with quantity updates
- [ ] Photo upload for progress
- [ ] QC session workflow complete
- [ ] QC findings with photos
- [ ] Rework workflow (resolve findings)
- [ ] No mock data anywhere
- [ ] Proper loading states
- [ ] Error handling with toast
- [ ] TypeScript types match OpenAPI

## EXECUTION

Execute this task now. Show complete code for each file.

````

---

### PROMPT 4: Purchasing Module Implementation

```markdown
# TASK: Purchasing Module - Complete API Integration

## CONTEXT
Implement complete Purchase Request management with approval workflow and DO tracking.

## SCOPE
- PR CRUD operations
- PR approval workflow
- PR item management
- Delivery Order tracking
- Lead time management
- PR reports

## FILES TO DELETE
- src/data/mockPurchasingData.ts

## FILES TO MODIFY

### 1. src/services/purchasingService.ts
COMPLETE REWRITE - Remove all mock data

### 2. src/pages/purchasing/PurchasingListPage.tsx
- Fetch from GET /api/v1/purchase-requests
- Implement filters and pagination
- Show PR aging

### 3. src/pages/purchasing/PurchasingDetailPage.tsx
- Show PR detail with items
- Display approval history
- Show delivery orders
- Timeline view

### 4. src/pages/purchasing/PurchasingFormPage.tsx
- Create/Update PRs
- Manage PR items
- Calculate from MR

## API ENDPOINTS

### Purchase Requests
````

GET /api/v1/purchase-requests
Query: status, priority, start_date, end_date, sortBy, sortOrder, page, limit

POST /api/v1/purchase-requests
Body: { mr_id?, required_date, priority, notes?, lead_time_estimate?, items }

GET /api/v1/purchase-requests/{id}

PUT /api/v1/purchase-requests/{id}
Body: { required_date?, priority?, notes?, lead_time_estimate?, items? }

DELETE /api/v1/purchase-requests/{id}

```

### PR Actions
```

POST /api/v1/purchase-requests/{id}/submit
Body: { notes? }

POST /api/v1/purchase-requests/{id}/approve
Body: { notes? }

POST /api/v1/purchase-requests/{id}/reject
Body: { reason, notes? }

POST /api/v1/purchase-requests/{id}/resubmit

GET /api/v1/purchase-requests/{id}/approval-history

```

### PR Status Updates
```

PATCH /api/v1/purchase-requests/{id}/lead-time
Body: { lead_time_estimate }

POST /api/v1/purchase-requests/{id}/status/processing
Body: { do_number, do_date }

POST /api/v1/purchase-requests/{id}/status/do-issued
Body: { do_number }

POST /api/v1/purchase-requests/{id}/notes
Body: { note }

GET /api/v1/purchase-requests/{id}/timeline

```

### PR Items
```

POST /api/v1/purchase-requests/{id}/items
Body: { materialId, quantityRequested, notes? }

PUT /api/v1/purchase-requests/{id}/items/{itemId}
Body: { quantityRequested?, notes? }

DELETE /api/v1/purchase-requests/{id}/items/{itemId}

```

### Delivery Orders
```

GET /api/v1/purchase-requests/{id}/delivery-orders

POST /api/v1/purchase-requests/{id}/delivery-orders
Body: { do_number, do_date, items: [{ pr_item_id, quantity }], notes?, document? }

GET /api/v1/delivery-orders/{id}

DELETE /api/v1/delivery-orders/{id}

GET /api/v1/purchase-requests/{id}/items/{itemId}/do-summary

```

### Reports
```

GET /api/v1/reports/pr-aging
Query: start_date, end_date

GET /api/v1/reports/pr-status-summary

````

## TYPES FROM OPENAPI.YAML

```typescript
interface PurchaseRequest {
  id: string
  pr_number: string
  mr_id?: string
  requestDate: string
  required_date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  notes?: string
  lead_time_estimate?: number
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'processing' | 'do_issued' | 'resubmitted' | 'cancelled'
  items: PRItem[]
  approvalHistory: ApprovalHistory[]
  deliveryOrders: DeliveryOrderFromHO[]
  createdAt: string
  updatedAt: string
}

interface PRItem {
  id: string
  prId: string
  materialId: string
  material: Product
  quantityRequested: number
  quantityApproved?: number
  quantityReceived?: number
  unit: string
  notes?: string
}

interface DeliveryOrderFromHO {
  id: string
  prId: string
  do_number: string
  do_date: string
  status: 'draft' | 'released' | 'partially_received' | 'received' | 'cancelled'
  items: DOItem[]
  createdAt: string
  updatedAt: string
}

interface DOItem {
  id: string
  doId: string
  prItemId: string
  materialId: string
  material: Product
  quantity: number
  quantityReceived: number
  unit: string
}
````

## ACCEPTANCE CRITERIA

- [ ] Complete PR lifecycle
- [ ] Approval workflow (submit, approve, reject, resubmit)
- [ ] DO tracking from HO
- [ ] Lead time management
- [ ] PR aging report
- [ ] PR status summary
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
- [ ] TypeScript types match OpenAPI

## EXECUTION

Execute this task now. Show complete code for each file.

````

---

### PROMPT 5: Warehouse Module Implementation

```markdown
# TASK: Warehouse Module - Complete API Integration

## CONTEXT
Implement complete warehouse management including stock, GR, GI, inspection, and DO.

## SCOPE
- Stock management with safety stock alerts
- Goods Receipt (GR) with inspection workflow
- Goods Issue (GI) for production
- Finished Goods Receipt
- Warehouse Delivery Orders
- BAST generation

## FILES TO DELETE
- src/data/mockWarehouseData.ts

## FILES TO MODIFY

### 1. src/services/warehouseService.ts
COMPLETE REWRITE - Remove all mock data

### 2. src/pages/warehouse/WarehouseListPage.tsx
- Fetch stock from GET /api/v1/warehouse/stock
- Show low stock alerts
- Safety stock updates

### 3. src/pages/warehouse/GoodsReceiptFormPage.tsx
- Create GR from available PRs
- Inspection workflow
- BAST generation

### 4. src/pages/warehouse/GoodsIssueFormPage.tsx
- Create GI for WOs
- Approval workflow

### 5. src/pages/warehouse/DeliveryOrderFormPage.tsx
- Create warehouse DO
- Release DO
- BAST outbound

### 6. src/pages/warehouse/StockAlertsPage.tsx
- Show low stock alerts
- Update safety stock

## API ENDPOINTS

### Stock Management
````

GET /api/v1/warehouse/stock
Query: category, lowStock, search, page, limit

GET /api/v1/warehouse/stock/{productId}

GET /api/v1/warehouse/stock/alerts/low-stock

PATCH /api/v1/warehouse/stock/{productId}/safety-stock
Body: { safety_stock }

```

### Goods Receipt
```

GET /api/v1/warehouse/goods-receipts
Query: status, pr_id, start_date, end_date, page, limit

POST /api/v1/warehouse/goods-receipts
Body: { pr_id, do_number, gr_date, notes?, items }

GET /api/v1/warehouse/goods-receipts/available-prs

GET /api/v1/warehouse/goods-receipts/pr-items/{prId}

GET /api/v1/warehouse/goods-receipts/{id}

PUT /api/v1/warehouse/goods-receipts/{id}
Body: { gr_date?, notes? }

PUT /api/v1/warehouse/goods-receipts/{id}/items/{itemId}
Body: { quantityAccepted?, quantityRejected?, inspectionNotes? }

POST /api/v1/warehouse/goods-receipts/{id}/submit

POST /api/v1/warehouse/goods-receipts/{id}/start-inspection

POST /api/v1/warehouse/goods-receipts/{id}/complete

POST /api/v1/warehouse/goods-receipts/{id}/cancel
Body: { reason, notes? }

POST /api/v1/warehouse/goods-receipts/{id}/bast

```

### Inspections
```

GET /api/v1/warehouse/inspections

POST /api/v1/warehouse/inspections
Body: { grId, status, notes? }

GET /api/v1/warehouse/inspections/pending

GET /api/v1/warehouse/inspections/{id}

PUT /api/v1/warehouse/inspections/{id}
Body: { status, notes? }

POST /api/v1/warehouse/inspections/{id}/submit

POST /api/v1/warehouse/inspections/{id}/approve

POST /api/v1/warehouse/inspections/{id}/reject

```

### Goods Issue
```

GET /api/v1/warehouse/goods-issues
Query: status, wo_id, page, limit

POST /api/v1/warehouse/goods-issues
Body: { woId, items }

GET /api/v1/warehouse/goods-issues/{id}

POST /api/v1/warehouse/goods-issues/{id}/submit

POST /api/v1/warehouse/goods-issues/{id}/approve

POST /api/v1/warehouse/goods-issues/{id}/reject
Body: { reason }

POST /api/v1/warehouse/goods-issues/{id}/issue

POST /api/v1/warehouse/goods-issues/{id}/cancel

```

### Finished Goods Receipt
```

GET /api/v1/warehouse/finished-goods-receipts

POST /api/v1/warehouse/finished-goods-receipts
Body: { wo_id, quantity }

```

### Warehouse DO
```

GET /api/v1/warehouse/warehouse-dos
Query: status, start_date, end_date, page, limit

POST /api/v1/warehouse/warehouse-dos
Body: { do_number, do_date, items }

GET /api/v1/warehouse/warehouse-dos/{id}

PUT /api/v1/warehouse/warehouse-dos/{id}
Body: { do_number?, do_date? }

POST /api/v1/warehouse/warehouse-dos/{id}/release

POST /api/v1/warehouse/warehouse-dos/{id}/bast

````

## TYPES FROM OPENAPI.YAML

```typescript
interface Stock {
  id: string
  productId: string
  product: Product
  quantity: number
  safetyStock: number
  location: string
  lastUpdated: string
}

interface StockAlert {
  id: string
  productId: string
  productCode: string
  productName: string
  currentQty: number
  safetyStock: number
  shortageAmount: number
  category: string
  lastUpdated: string
}

interface GoodsReceipt {
  id: string
  prId: string
  do_number: string
  gr_date: string
  status: 'draft' | 'inspection_pending' | 'inspection_in_progress' | 'inspection_approved' | 'inspection_rejected' | 'completed' | 'cancelled'
  notes?: string
  items: GRItem[]
  bastInbound?: BASTInbound
  createdAt: string
  updatedAt: string
}

interface GRItem {
  id: string
  grId: string
  prItemId: string
  materialId: string
  material: Product
  quantityReceived: number
  quantityAccepted: number
  quantityRejected: number
  unit: string
  inspectionNotes?: string
}

interface Inspection {
  id: string
  grId: string
  goodsReceipt?: GoodsReceipt
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected'
  photos: InspectionPhoto[]
  createdAt: string
  updatedAt: string
}

interface GoodsIssue {
  id: string
  woId: string
  workOrder?: WorkOrder
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'issued' | 'cancelled'
  items: GIItem[]
  notes?: string
  createdAt: string
  updatedAt: string
}

interface FinishedGoodsReceipt {
  id: string
  woId: string
  workOrder?: WorkOrder
  quantity: number
  status: 'received'
  receivedAt: string
  createdAt: string
}

interface DeliveryOrder {
  id: string
  do_number: string
  do_date: string
  status: 'draft' | 'released' | 'partially_delivered' | 'delivered' | 'cancelled'
  items: WarehouseDOItem[]
  bastOutbound?: BASTOutbound
  createdAt: string
  updatedAt: string
}

interface BASTInbound {
  id: string
  grId: string
  bast_number: string
  bast_date: string
  status: 'generated' | 'signed'
  pdfUrl?: string
  createdAt: string
}

interface BASTOutbound {
  id: string
  doId: string
  bast_number: string
  bast_date: string
  fileUrl?: string
  uploadedBy?: string
  uploadedAt?: string
}
````

## ACCEPTANCE CRITERIA

- [ ] Stock management complete
- [ ] GR workflow with inspection
- [ ] GI workflow complete
- [ ] FG receipt works
- [ ] Warehouse DO works
- [ ] BAST generation (inbound and outbound)
- [ ] Low stock alerts
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
- [ ] TypeScript types match OpenAPI

## EXECUTION

Execute this task now. Show complete code for each file.

````

---

### PROMPT 6: Master Data Module Implementation

```markdown
# TASK: Master Data Module - Complete API Integration

## CONTEXT
Implement complete master data management for Products and BOM.

## SCOPE
- Product CRUD (all types)
- BOM CRUD with versioning
- Import/Export functionality
- Search and validation

## FILES TO DELETE
- src/data/mockMasterData.ts

## FILES TO MODIFY

### 1. src/services/masterDataService.ts
COMPLETE REWRITE - Remove all mock data

### 2. src/pages/masterData/ProductListPage.tsx
- Fetch products with filters
- Import/export actions
- Product summary

### 3. src/pages/masterData/ProductFormPage.tsx
- Create/Update products
- Activate/deactivate

### 4. src/pages/masterData/BoMListPage.tsx
- Fetch BOMs
- Filter by status

### 5. src/pages/masterData/BoMFormPage.tsx
- Create/Update BOM
- Manage BOM items

## API ENDPOINTS

### Products
````

GET /api/v1/products
Query: type, status, search, sortBy, sortOrder, page, limit

POST /api/v1/products
Body: { code, name, type, description?, baseUnit }

GET /api/v1/products/{id}

PUT /api/v1/products/{id}
Body: { name?, description?, baseUnit? }

POST /api/v1/products/{id}/deactivate

POST /api/v1/products/{id}/activate

GET /api/v1/products/search?q=

GET /api/v1/products/by-type?type=

GET /api/v1/products/summary

POST /api/v1/products/validate-codes
Body: { codes: string[] }

```

### Product Import/Export
```

POST /api/v1/products/import
Content-Type: multipart/form-data
Body: { file }

GET /api/v1/products/export
Query: type, status

GET /api/v1/products/import/template

```

### BOM
```

GET /api/v1/boms
Query: status, search, sortBy, sortOrder, page, limit

POST /api/v1/boms
Body: { status, items }

GET /api/v1/products/{productId}/bom

POST /api/v1/products/{productId}/bom
Body: { status, items }

PATCH /api/v1/products/{productId}/bom/status
Body: { status }

POST /api/v1/products/{productId}/bom/items
Body: { materialId, quantityRequired, unit }

PUT /api/v1/products/{productId}/bom/items/{itemId}
Body: { quantityRequired?, unit? }

DELETE /api/v1/products/{productId}/bom/items/{itemId}

GET /api/v1/products/{productId}/bom/materials

```

### BOM Import/Export
```

POST /api/v1/boms/import
Content-Type: multipart/form-data
Body: { file }

GET /api/v1/boms/export
Query: status

GET /api/v1/boms/import/template

````

## TYPES FROM OPENAPI.YAML

```typescript
interface Product {
  id: string
  code: string
  name: string
  type: 'FG' | 'SEMI' | 'RAW' | 'PACKAGING' | 'SPAREPART' | 'SUPPORT'
  description?: string
  baseUnit: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

interface BoM {
  id: string
  productId: string
  product: Product
  status: 'draft' | 'active' | 'inactive'
  items: BoMItem[]
  version: number
  createdAt: string
  updatedAt: string
}

interface BoMItem {
  id: string
  materialId: string
  material: Product
  quantityRequired: number
  unit: string
  createdAt: string
}

interface CreateProductRequest {
  code: string
  name: string
  type: 'FG' | 'SEMI' | 'RAW' | 'PACKAGING' | 'SPAREPART' | 'SUPPORT'
  description?: string
  baseUnit: string
}

interface CreateBoMRequest {
  status: 'draft' | 'active'
  items: {
    materialId: string
    quantityRequired: number
    unit: string
  }[]
}
````

## ACCEPTANCE CRITERIA

- [ ] Product CRUD complete
- [ ] BOM CRUD complete
- [ ] Import/export works
- [ ] Search and filtering
- [ ] Product validation
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
- [ ] TypeScript types match OpenAPI

## EXECUTION

Execute this task now. Show complete code for each file.

````

---

### PROMPT 7: User Management Module Implementation

```markdown
# TASK: User Management Module - Complete API Integration

## CONTEXT
Implement complete user and role management with permission system.

## SCOPE
- User CRUD operations
- Role management
- Permission system
- Department-based access

## FILES TO DELETE
- src/data/mockUserData.ts

## FILES TO MODIFY

### 1. src/services/userService.ts
COMPLETE REWRITE - Remove all mock data

### 2. src/pages/users/UserListPage.tsx
- Fetch users with filters
- Pagination
- User actions

### 3. src/pages/users/UserFormPage.tsx
- Create/Update users
- Assign roles
- Reset password

### 4. src/pages/users/RolesListPage.tsx
- Fetch roles
- Create/Update/Delete roles
- Assign permissions

## API ENDPOINTS

### Users
````

GET /api/v1/users
Query: status, department, search, page, limit

POST /api/v1/users
Body: { email, fullName, department, password?, roleIds }

GET /api/v1/users/{id}

PUT /api/v1/users/{id}
Body: { fullName?, department?, roleIds? }

DELETE /api/v1/users/{id}

POST /api/v1/users/{id}/deactivate

POST /api/v1/users/{id}/reactivate

POST /api/v1/users/{id}/reset-password
Body: { newPassword }

GET /api/v1/users/{id}/permissions

```

### Roles
```

GET /api/v1/roles
Query: search, page, limit

POST /api/v1/roles
Body: { name, description?, permissionIds }

GET /api/v1/roles/{id}

PUT /api/v1/roles/{id}
Body: { name?, description?, permissionIds? }

DELETE /api/v1/roles/{id}

```

### Permissions
```

GET /api/v1/permissions

GET /api/v1/permissions/approvers/{module}

````

## TYPES FROM OPENAPI.YAML

```typescript
interface User {
  id: string
  email: string
  fullName: string
  department: 'GA' | 'FINANCE' | 'PURCHASING' | 'WAREHOUSE' | 'PRODUCTION' | 'QC' | 'PLANNING' | 'SALES'
  role: string
  status: 'active' | 'inactive'
  permissions?: Permission[]
  createdAt: string
  updatedAt: string
}

interface CreateUserRequest {
  email: string
  fullName: string
  department: 'GA' | 'FINANCE' | 'PURCHASING' | 'WAREHOUSE' | 'PRODUCTION' | 'QC' | 'PLANNING' | 'SALES'
  password?: string
  roleIds?: string[]
}

interface Permission {
  id: string
  module: string
  action: string
  description: string
}

interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

interface CreateRoleRequest {
  name: string
  description?: string
  permissionIds: string[]
}
````

## ACCEPTANCE CRITERIA

- [ ] User CRUD complete
- [ ] Role management complete
- [ ] Permission system works
- [ ] Department filtering
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
- [ ] TypeScript types match OpenAPI

## EXECUTION

Execute this task now. Show complete code for each file.

````

---

### PROMPT 8: Dashboard Module Implementation

```markdown
# TASK: Dashboard Module - Complete API Integration

## CONTEXT
Implement comprehensive dashboard with KPIs and analytics from all modules.

## SCOPE
- Dashboard summary
- KPI metrics
- System alerts
- Reports integration

## FILES TO DELETE
- src/data/mockData.ts (if still exists)

## FILES TO MODIFY

### 1. src/services/dashboardService.ts
COMPLETE REWRITE - Remove all mock data

### 2. src/pages/DashboardPage.tsx
- Fetch dashboard summary
- Display KPI widgets
- Show charts with real data
- Display alerts

### 3. src/components/dashboard/
Update all dashboard widgets to use real data

## API ENDPOINTS

### Dashboard
````

GET /api/v1/dashboard/summary

GET /api/v1/dashboard/kpis

GET /api/v1/dashboard/alerts

```

### Reports
```

GET /api/v1/reports/production-metrics

GET /api/v1/reports/wo-status-summary

GET /api/v1/reports/pr-aging

GET /api/v1/reports/pr-status-summary

````

## TYPES FROM OPENAPI.YAML

```typescript
interface DashboardSummary {
  production: {
    totalPlans: number
    completedPlans: number
    inProgressPlans: number
    efficiency: number
  }
  delivery: {
    onTimeDelivery: number
    totalDeliveries: number
  }
  inventory: {
    totalValue: number
    lowStockItems: number
  }
  purchasing: {
    openPRs: number
    avgLeadTime: number
  }
}

interface KPIResponse {
  metrics: {
    name: string
    value: number
    unit: string
    trend: 'up' | 'down' | 'stable'
  }[]
}

interface Alert {
  id: string
  category: 'production' | 'inventory' | 'purchasing' | 'quality'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  createdAt: string
}

interface ProductionMetrics {
  totalWOs: number
  completedWOs: number
  inProgressWOs: number
  qcPendingWOs: number
  onTimeRate: number
  qcFirstPassRate: number
}
````

## ACCEPTANCE CRITERIA

- [ ] Dashboard summary displays real data
- [ ] KPI widgets work
- [ ] Charts show real data
- [ ] Alerts display correctly
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
- [ ] Responsive design
- [ ] TypeScript types match OpenAPI

## EXECUTION

Execute this task now. Show complete code for each file.

````

---

## 🧹 Cleanup Checklist

After all implementations are complete, run these checks:

### 1. Delete Mock Data Files
```bash
cd /Users/mekari/apex-design-system/erp-dashboard

# Verify all mock files are deleted
ls -la src/data/

# Should only have files you explicitly keep (if any)
````

### 2. Remove Mock Imports

```bash
# Search for any remaining mock data imports
grep -r "mockData" src/
grep -r "mockPlanning" src/
grep -r "mockProduction" src/
grep -r "mockPurchasing" src/
grep -r "mockWarehouse" src/
grep -r "mockMasterData" src/
grep -r "mockUserData" src/
grep -r "mockDelivery" src/
```

### 3. Remove USE_MOCK_DATA Logic

```bash
# Search for conditional mock logic
grep -r "USE_MOCK_DATA" src/
grep -r "VITE_USE_MOCK_DATA" src/
```

### 4. Update Environment

```bash
# Verify .env.local
cat .env.local

# Should show:
# VITE_API_URL=https://apex-erp-be-staging.itobsidianmuda.workers.dev
# VITE_USE_MOCK_DATA=false
```

### 5. Run Type Check

```bash
npm run build

# Should compile without TypeScript errors
```

### 6. Run Linter

```bash
npm run lint

# Should pass without errors
```

---

## 📊 Implementation Timeline

| Phase | Module                        | Estimated Time | Priority |
| ----- | ----------------------------- | -------------- | -------- |
| 1     | Foundation (Auth + apiClient) | 2-3 hours      | CRITICAL |
| 2     | Planning Module               | 4-5 hours      | HIGH     |
| 3     | Production Module             | 5-6 hours      | HIGH     |
| 4     | Purchasing Module             | 4-5 hours      | HIGH     |
| 5     | Warehouse Module              | 5-6 hours      | HIGH     |
| 6     | Master Data Module            | 3-4 hours      | MEDIUM   |
| 7     | User Management               | 2-3 hours      | MEDIUM   |
| 8     | Dashboard Module              | 2-3 hours      | MEDIUM   |
| 9     | Testing & Bug Fixes           | 4-5 hours      | HIGH     |
| 10    | Polish & Optimization         | 2-3 hours      | LOW      |

**Total Estimated Time: 33-42 hours**

---

## ✅ Final Verification

Before considering implementation complete, verify:

- [ ] All mock data files deleted
- [ ] All services use real API
- [ ] All TypeScript types match OpenAPI spec
- [ ] No `any` types in codebase
- [ ] All CRUD operations work
- [ ] All approval workflows complete
- [ ] Error handling implemented everywhere
- [ ] Loading states on all async operations
- [ ] Toast notifications for user feedback
- [ ] Responsive design on all pages
- [ ] Build passes without errors
- [ ] Lint passes without errors
- [ ] Test critical user flows manually

---

**Document Created**: 2026-03-09  
**Target API**: https://apex-erp-be-staging.itobsidianmuda.workers.dev  
**Status**: Ready for Implementation
