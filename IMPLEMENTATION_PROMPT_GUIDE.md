# Apex ERP Dashboard - Implementation Prompt Guide

> **Comprehensive guide for implementing Apex ERP Dashboard with real API integration**
> 
> This document serves as your master prompt reference when working with Claude Code (API model GLM5) or agent swarm systems to implement the complete ERP dashboard frontend.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Implementation Prompts by Module](#implementation-prompts-by-module)
5. [Agent Swarm Delegation Guide](#agent-swarm-delegation-guide)
6. [Best Practices & Standards](#best-practices--standards)

---

## 📌 Project Overview

### Tech Stack
- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS v3.4.19 + shadcn/ui components
- **Routing**: React Router DOM v7.13.1
- **Charts**: Recharts v2.15.4
- **Icons**: Lucide React v0.562.0
- **Notifications**: Sonner v2.0.7

### Project Structure
```
erp-dashboard/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── layout/     # Layout components
│   │   └── dashboard/  # Dashboard-specific components
│   ├── contexts/       # React contexts (Auth, Theme, etc.)
│   ├── data/           # Mock data (TO BE REMOVED)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   │   └── apiClient.ts  # API client (UPDATE THIS)
│   ├── pages/          # Page components
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard/  # Dashboard pages
│   │   ├── planning/   # Production planning
│   │   ├── purchasing/ # Purchase requests
│   │   ├── production/ # Work orders & QC
│   │   ├── warehouse/  # Stock, GR, GI, DO
│   │   ├── delivery/   # Delivery tracking
│   │   ├── users/      # User management
│   │   ├── settings/   # Settings
│   │   └── masterData/ # Products, BoM
│   ├── services/       # API service layer
│   │   ├── dashboardService.ts
│   │   ├── planningService.ts
│   │   ├── productionService.ts
│   │   ├── purchasingService.ts
│   │   ├── warehouseService.ts
│   │   ├── masterDataService.ts
│   │   ├── userService.ts
│   │   └── deliveryService.ts
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── .env.local          # Environment variables
├── package.json
└── vite.config.ts
```

### API Base URL
- **Staging**: `https://apex-erp-be-staging.itobsidianmuda.workers.dev/api/v1`
- **Local**: `http://localhost:8787/api/v1`

---

## 🏗️ System Architecture

### Data Flow
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Pages     │────▶│  Services    │────▶│  apiClient  │
└─────────────┘     └──────────────┘     └─────────────┘
       ▲                    │                    │
       │                    │                    │
       │                    ▼                    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Types     │◀────│  API Response│◀────│   Backend   │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Service Layer Pattern
```typescript
// Pattern for all services
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

export const serviceName = {
  getData: async (params): Promise<DataType[]> => {
    if (USE_MOCK_DATA) {
      // Return mock data
    }
    const response = await apiClient.get<DataType[]>('/endpoint', params);
    return response.data || [];
  },
};
```

---

## 📡 API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/change-password` | Change password |

### Users Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | List users (paginated) |
| POST | `/api/v1/users` | Create user |
| GET | `/api/v1/users/{id}` | Get user by ID |
| PUT | `/api/v1/users/{id}` | Update user |
| DELETE | `/api/v1/users/{id}` | Delete user |
| POST | `/api/v1/users/{id}/deactivate` | Deactivate user |
| POST | `/api/v1/users/{id}/reactivate` | Reactivate user |
| POST | `/api/v1/users/{id}/reset-password` | Reset password |
| GET | `/api/v1/users/{id}/permissions` | Get user permissions |

### Roles & Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/roles` | List roles |
| POST | `/api/v1/roles` | Create role |
| GET | `/api/v1/roles/{id}` | Get role by ID |
| PUT | `/api/v1/roles/{id}` | Update role |
| DELETE | `/api/v1/roles/{id}` | Delete role |
| GET | `/api/v1/permissions` | List all permissions |
| GET | `/api/v1/permissions/approvers/{module}` | Get approvers |

### Products (Master Data)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | List products |
| POST | `/api/v1/products` | Create product |
| GET | `/api/v1/products/{id}` | Get product |
| PUT | `/api/v1/products/{id}` | Update product |
| POST | `/api/v1/products/{id}/deactivate` | Deactivate |
| POST | `/api/v1/products/{id}/activate` | Activate |
| GET | `/api/v1/products/search?q=` | Search products |
| GET | `/api/v1/products/by-type?type=` | Get by type |
| POST | `/api/v1/products/import` | Import from file |
| GET | `/api/v1/products/export` | Export to CSV/XLSX |

### Bill of Materials (BOM)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/boms` | List BOMs |
| POST | `/api/v1/boms` | Create BOM |
| GET | `/api/v1/products/{productId}/bom` | Get BOM by product |
| POST | `/api/v1/products/{productId}/bom` | Create BOM for product |
| PATCH | `/api/v1/products/{productId}/bom/status` | Update BOM status |
| POST | `/api/v1/products/{productId}/bom/items` | Add BOM item |
| PUT | `/api/v1/products/{productId}/bom/items/{itemId}` | Update BOM item |
| DELETE | `/api/v1/products/{productId}/bom/items/{itemId}` | Delete BOM item |
| GET | `/api/v1/products/{productId}/bom/materials` | Get BOM materials |

### Production Planning
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/production-plans` | List production plans |
| POST | `/api/v1/production-plans` | Create plan |
| GET | `/api/v1/production-plans/{id}` | Get plan by ID |
| PUT | `/api/v1/production-plans/{id}` | Update plan |
| DELETE | `/api/v1/production-plans/{id}` | Delete plan |
| POST | `/api/v1/production-plans/{id}/submit` | Submit for approval |
| POST | `/api/v1/production-plans/{id}/approve` | Approve plan |
| POST | `/api/v1/production-plans/{id}/reject` | Reject plan |
| POST | `/api/v1/production-plans/{id}/cancel` | Cancel plan |
| POST | `/api/v1/production-plans/{id}/request-edit` | Request edit |
| POST | `/api/v1/production-plans/{id}/items` | Add plan item |
| PUT | `/api/v1/production-plans/{id}/items/{itemId}` | Update item |
| DELETE | `/api/v1/production-plans/{id}/items/{itemId}` | Remove item |
| GET | `/api/v1/production-plans/{id}/material-requirements` | Get MR |
| POST | `/api/v1/production-plans/{id}/create-pr` | Create PR from MR |
| POST | `/api/v1/production-plans/{id}/items/{itemId}/create-wo` | Create WO |

### Production / Work Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/production/work-orders` | List WOs |
| POST | `/api/v1/production/work-orders` | Create WO |
| GET | `/api/v1/production/work-orders/{id}` | Get WO by ID |
| PUT | `/api/v1/production/work-orders/{id}` | Update WO |
| DELETE | `/api/v1/production/work-orders/{id}` | Delete WO |
| POST | `/api/v1/production/work-orders/{id}/release` | Release WO |
| POST | `/api/v1/production/work-orders/{id}/start` | Start WO |
| POST | `/api/v1/production/work-orders/{id}/mark-qc` | Mark for QC |
| POST | `/api/v1/production/work-orders/{id}/complete` | Complete WO |
| POST | `/api/v1/production/work-orders/{id}/cancel` | Cancel WO |
| GET | `/api/v1/production/work-orders/{id}/steps` | Get steps |
| POST | `/api/v1/production/work-orders/{id}/steps` | Add step |
| PUT | `/api/v1/production/work-orders/{id}/steps/{stepId}` | Update step |
| POST | `/api/v1/production/work-orders/{id}/steps/{stepId}/start` | Start step |
| POST | `/api/v1/production/work-orders/{id}/steps/{stepId}/complete` | Complete step |
| GET | `/api/v1/production/work-orders/{id}/progress` | Get progress |
| POST | `/api/v1/production/work-orders/{id}/progress` | Update progress |
| POST | `/api/v1/production/work-orders/{id}/qc/start` | Start QC |
| GET | `/api/v1/production/qc-sessions/{sessionId}/findings` | Get findings |
| POST | `/api/v1/production/qc-sessions/{sessionId}/findings` | Add finding |
| POST | `/api/v1/production/qc-sessions/{sessionId}/pass` | QC Pass |
| POST | `/api/v1/production/qc-sessions/{sessionId}/fail` | QC Fail |

### Purchasing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/purchase-requests` | List PRs |
| POST | `/api/v1/purchase-requests` | Create PR |
| GET | `/api/v1/purchase-requests/{id}` | Get PR by ID |
| PUT | `/api/v1/purchase-requests/{id}` | Update PR |
| DELETE | `/api/v1/purchase-requests/{id}` | Delete PR |
| POST | `/api/v1/purchase-requests/{id}/submit` | Submit PR |
| POST | `/api/v1/purchase-requests/{id}/approve` | Approve PR |
| POST | `/api/v1/purchase-requests/{id}/reject` | Reject PR |
| POST | `/api/v1/purchase-requests/{id}/resubmit` | Resubmit PR |
| PATCH | `/api/v1/purchase-requests/{id}/lead-time` | Update lead time |
| POST | `/api/v1/purchase-requests/{id}/status/processing` | Mark processing |
| POST | `/api/v1/purchase-requests/{id}/status/do-issued` | Mark DO issued |
| POST | `/api/v1/purchase-requests/{id}/items` | Add PR item |
| PUT | `/api/v1/purchase-requests/{id}/items/{itemId}` | Update PR item |
| DELETE | `/api/v1/purchase-requests/{id}/items/{itemId}` | Delete PR item |
| GET | `/api/v1/purchase-requests/{id}/delivery-orders` | List DOs |
| POST | `/api/v1/purchase-requests/{id}/delivery-orders` | Create DO |

### Warehouse
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/warehouse/stock` | List stock |
| GET | `/api/v1/warehouse/stock/{productId}` | Get stock detail |
| GET | `/api/v1/warehouse/stock/alerts/low-stock` | Low stock alerts |
| PATCH | `/api/v1/warehouse/stock/{productId}/safety-stock` | Update safety stock |
| GET | `/api/v1/warehouse/goods-receipts` | List GR |
| POST | `/api/v1/warehouse/goods-receipts` | Create GR |
| GET | `/api/v1/warehouse/goods-receipts/{id}` | Get GR detail |
| PUT | `/api/v1/warehouse/goods-receipts/{id}` | Update GR |
| POST | `/api/v1/warehouse/goods-receipts/{id}/submit` | Submit GR |
| POST | `/api/v1/warehouse/goods-receipts/{id}/start-inspection` | Start inspection |
| POST | `/api/v1/warehouse/goods-receipts/{id}/complete` | Complete GR |
| POST | `/api/v1/warehouse/goods-receipts/{id}/cancel` | Cancel GR |
| GET | `/api/v1/warehouse/inspections` | List inspections |
| POST | `/api/v1/warehouse/inspections` | Create inspection |
| GET | `/api/v1/warehouse/inspections/pending` | Pending inspections |
| PUT | `/api/v1/warehouse/inspections/{id}` | Update inspection |
| POST | `/api/v1/warehouse/inspections/{id}/submit` | Submit inspection |
| POST | `/api/v1/warehouse/inspections/{id}/approve` | Approve inspection |
| POST | `/api/v1/warehouse/inspections/{id}/reject` | Reject inspection |
| GET | `/api/v1/warehouse/goods-issues` | List GI |
| POST | `/api/v1/warehouse/goods-issues` | Create GI |
| POST | `/api/v1/warehouse/goods-issues/{id}/submit` | Submit GI |
| POST | `/api/v1/warehouse/goods-issues/{id}/approve` | Approve GI |
| POST | `/api/v1/warehouse/goods-issues/{id}/reject` | Reject GI |
| POST | `/api/v1/warehouse/goods-issues/{id}/issue` | Issue goods |
| GET | `/api/v1/warehouse/finished-goods-receipts` | List FG receipts |
| POST | `/api/v1/warehouse/finished-goods-receipts` | Create FG receipt |
| GET | `/api/v1/warehouse/warehouse-dos` | List warehouse DOs |
| POST | `/api/v1/warehouse/warehouse-dos` | Create DO |
| POST | `/api/v1/warehouse/warehouse-dos/{id}/release` | Release DO |
| POST | `/api/v1/warehouse/warehouse-dos/{id}/bast` | Generate BAST |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/summary` | Dashboard summary |
| GET | `/api/v1/dashboard/kpis` | KPI metrics |
| GET | `/api/v1/dashboard/alerts` | System alerts |
| GET | `/api/v1/reports/production-metrics` | Production metrics |
| GET | `/api/v1/reports/wo-status-summary` | WO status summary |
| GET | `/api/v1/reports/pr-aging` | PR aging report |
| GET | `/api/v1/reports/pr-status-summary` | PR status summary |

---

## 🎯 Implementation Prompts by Module

### Master Prompt Template

```markdown
## CONTEXT
You are implementing the [MODULE_NAME] module for the Apex ERP Dashboard.
This is a manufacturing ERP system with real-time data synchronization.

## TASK
[Specific task description]

## REQUIREMENTS
1. Use TypeScript with strict typing
2. Follow the existing service layer pattern
3. Remove all mock data references
4. Implement proper error handling
5. Add loading states
6. Use shadcn/ui components
7. Follow Tailwind CSS utility classes
8. Implement proper form validation
9. Add proper TypeScript types from openapi.yaml
10. Handle pagination, sorting, and filtering

## API ENDPOINTS
[List relevant endpoints]

## TYPES NEEDED
[List required TypeScript types]

## FILES TO MODIFY
[List files]

## ACCEPTANCE CRITERIA
- [ ] All API calls use apiClient
- [ ] No mock data references
- [ ] Proper error handling with toast notifications
- [ ] Loading states implemented
- [ ] TypeScript types match OpenAPI spec
- [ ] Responsive design
- [ ] Form validation implemented
```

---

### 1. Authentication Module Prompt

```markdown
# IMPLEMENT: Authentication Module - Real API Integration

## CONTEXT
Implement complete authentication flow using real API endpoints.
Remove all mock data and use staging API: https://apex-erp-be-staging.itobsidianmuda.workers.dev

## TASKS

### 1. Update AuthContext
- Implement login using POST /api/v1/auth/login
- Implement logout using POST /api/v1/auth/logout
- Implement getCurrentUser using GET /api/v1/auth/me
- Implement changePassword using POST /api/v1/auth/change-password
- Store JWT token in localStorage
- Add token refresh logic if needed

### 2. Update LoginPage
- Connect to real auth API
- Handle authentication errors
- Redirect to dashboard on success
- Show proper error messages with Sonner toast

### 3. Update ChangePasswordPage
- Connect to real change password API
- Validate current password
- Enforce password requirements (min 6 chars)
- Validate confirmPassword matches newPassword

## API ENDPOINTS
POST /api/v1/auth/login
  Request: { email: string, password: string }
  Response: { success: boolean, data: { token: string, user: User } }

POST /api/v1/auth/logout
  Response: { success: boolean }

GET /api/v1/auth/me
  Response: { success: boolean, data: User }

POST /api/v1/auth/change-password
  Request: { currentPassword, newPassword, confirmPassword }
  Response: { success: boolean }

## TYPES (from openapi.yaml)
interface User {
  id: string
  email: string
  fullName: string
  department: 'GA' | 'FINANCE' | 'PURCHASING' | 'WAREHOUSE' | 'PRODUCTION' | 'QC' | 'PLANNING' | 'SALES'
  role: string
  status: 'active' | 'inactive'
  forceChangePassword?: boolean
  createdAt: string
  updatedAt: string
}

## FILES TO MODIFY
- src/contexts/AuthContext.tsx
- src/pages/auth/LoginPage.tsx
- src/pages/auth/ChangePasswordPage.tsx
- src/lib/apiClient.ts (add auth methods)

## ACCEPTANCE CRITERIA
- [ ] Login persists after page refresh
- [ ] Logout clears auth state
- [ ] Protected routes redirect to login
- [ ] Token stored securely
- [ ] Error messages are user-friendly
```

---

### 2. Production Planning Module Prompt

```markdown
# IMPLEMENT: Production Planning Module - Real API Integration

## CONTEXT
Implement complete Production Planning module with full CRUD operations,
approval workflow, and material requirements calculation.

## TASKS

### 1. Update planningService.ts
- Remove ALL mock data imports
- Implement all methods using real API endpoints
- Handle pagination parameters
- Implement status filters
- Add proper error handling

### 2. Update PlanningListPage
- Fetch plans from GET /api/v1/production-plans
- Implement server-side pagination
- Implement filters (status, date range, search)
- Add loading skeletons
- Handle empty states

### 3. Update PlanningDetailPage
- Fetch plan detail from GET /api/v1/production-plans/{id}
- Show approval history
- Display material requirements
- Show action buttons based on status and permissions

### 4. Update PlanningFormPage
- Create: POST /api/v1/production-plans
- Update: PUT /api/v1/production-plans/{id}
- Add plan items: POST /api/v1/production-plans/{id}/items
- Update material priorities
- Fetch products: GET /api/v1/products?type=FG
- Fetch BOM materials: GET /api/v1/products/{productId}/bom/materials

### 5. Implement Approval Actions
- Submit: POST /api/v1/production-plans/{id}/submit
- Approve: POST /api/v1/production-plans/{id}/approve
- Reject: POST /api/v1/production-plans/{id}/reject
- Cancel: POST /api/v1/production-plans/{id}/cancel
- Request Edit: POST /api/v1/production-plans/{id}/request-edit

### 6. Create Downstream Documents
- Create PR from MR: POST /api/v1/production-plans/{id}/create-pr
- Create WO from plan item: POST /api/v1/production-plans/{id}/items/{itemId}/create-wo

## API ENDPOINTS
GET /api/v1/production-plans
  Query: status, plan_date_from, plan_date_to, page, limit, sortBy, sortOrder

POST /api/v1/production-plans
  Body: { plan_date, target_completion_date, ho_order_reference?, notes?, items? }

PUT /api/v1/production-plans/{id}
  Body: { plan_date?, target_completion_date?, ho_order_reference?, notes? }

POST /api/v1/production-plans/{id}/items
  Body: { product_id, quantity, material_priorities? }

GET /api/v1/production-plans/{id}/material-requirements
  Response: { success: boolean, data: MaterialRequirement[] }

## TYPES NEEDED
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

## FILES TO MODIFY
- src/services/planningService.ts (COMPLETE REWRITE)
- src/pages/planning/PlanningListPage.tsx
- src/pages/planning/PlanningDetailPage.tsx
- src/pages/planning/PlanningFormPage.tsx
- src/types/planning.ts (update types)
- src/data/mockPlanningData.ts (DELETE THIS FILE)

## ACCEPTANCE CRITERIA
- [ ] All CRUD operations work with real API
- [ ] Pagination works correctly
- [ ] Filters apply server-side
- [ ] Approval workflow complete
- [ ] Material requirements calculated
- [ ] Can create PR from MR
- [ ] Can create WO from plan item
- [ ] No mock data references
- [ ] Proper loading states
- [ ] Error handling with toast notifications
```

---

### 3. Production / Work Order Module Prompt

```markdown
# IMPLEMENT: Production Module - Real API Integration

## CONTEXT
Implement complete Work Order management with progress tracking,
step management, and Quality Control (QC) workflow.

## TASKS

### 1. Update productionService.ts
- Remove ALL mock data
- Implement complete WO lifecycle
- Implement step management
- Implement progress tracking
- Implement QC session management
- Implement QC findings

### 2. Update WorkOrderListPage
- Fetch WOs from GET /api/v1/production/work-orders
- Implement filters (status, plan, search, date range)
- Show WO status badges
- Add quick actions

### 3. Update WorkOrderDetailPage
- Fetch WO detail with steps and progress
- Show progress visualization
- Display QC sessions and findings
- Show action buttons based on status

### 4. Update WorkOrderFormPage
- Create: POST /api/v1/production/work-orders
- Update: PUT /api/v1/production/work-orders/{id}
- Add/manage steps
- Set target dates

### 5. Implement WO Lifecycle Actions
- Release: POST /api/v1/production/work-orders/{id}/release
- Start: POST /api/v1/production/work-orders/{id}/start
- Mark for QC: POST /api/v1/production/work-orders/{id}/mark-qc
- Complete: POST /api/v1/production/work-orders/{id}/complete
- Cancel: POST /api/v1/production/work-orders/{id}/cancel

### 6. Implement Step Management
- Add step: POST /api/v1/production/work-orders/{id}/steps
- Update step: PUT /api/v1/production/work-orders/{id}/steps/{stepId}
- Reorder steps: PUT /api/v1/production/work-orders/{id}/steps/reorder
- Start step: POST /api/v1/production/work-orders/{id}/steps/{stepId}/start
- Complete step: POST /api/v1/production/work-orders/{id}/steps/{stepId}/complete

### 7. Implement Progress Tracking
- Get progress: GET /api/v1/production/work-orders/{id}/progress
- Update progress: POST /api/v1/production/work-orders/{id}/progress
- Upload progress photo: POST /api/v1/production/progress/{progressId}/photos

### 8. Implement QC Workflow
- Start QC: POST /api/v1/production/work-orders/{id}/qc/start
- Get QC session: GET /api/v1/production/qc-sessions/{sessionId}
- Add finding: POST /api/v1/production/qc-sessions/{sessionId}/findings
- QC Pass: POST /api/v1/production/qc-sessions/{sessionId}/pass
- QC Fail: POST /api/v1/production/qc-sessions/{sessionId}/fail
- Resolve finding: POST /api/v1/production/qc-findings/{findingId}/resolve

## API ENDPOINTS
POST /api/v1/production/work-orders
  Body: { plan_id?, product_id, quantity, target_date, notes? }

POST /api/v1/production/work-orders/{id}/steps
  Body: { name, sequence }

POST /api/v1/production/work-orders/{id}/progress
  Body: { quantity, notes?, step_id? }

POST /api/v1/production/progress/{progressId}/photos
  Content-Type: multipart/form-data
  Body: { file, caption? }

POST /api/v1/production/qc-sessions/{sessionId}/findings
  Body: { description, reworkNotes }

## TYPES NEEDED
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
  status: WOStatusType
  targetDate: string
  startDate?: string
  steps: WOStep[]
  progress?: WOProgress
  qcSessions?: QCSession[]
  reworkNotes?: string
  createdAt: string
  releasedAt?: string
  completedAt?: string
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

interface QCSession {
  id: string
  woId: string
  status: 'in_progress' | 'completed'
  result: 'pass' | 'fail' | 'pending'
  notes?: string
  findings?: QCFinding[]
  createdAt: string
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
  resolvedAt?: string
  createdAt: string
}

## FILES TO MODIFY
- src/services/productionService.ts (COMPLETE REWRITE)
- src/pages/production/WorkOrderListPage.tsx
- src/pages/production/WorkOrderDetailPage.tsx
- src/pages/production/WorkOrderFormPage.tsx
- src/types/production.ts (update types)
- src/data/mockProductionData.ts (DELETE THIS FILE)

## ACCEPTANCE CRITERIA
- [ ] Complete WO lifecycle implemented
- [ ] Step management works
- [ ] Progress tracking with photos
- [ ] QC session workflow complete
- [ ] QC findings with photos
- [ ] Rework workflow
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
```

---

### 4. Purchasing Module Prompt

```markdown
# IMPLEMENT: Purchasing Module - Real API Integration

## CONTEXT
Implement complete Purchase Request (PR) management with approval workflow,
Delivery Order (DO) tracking, and HO interaction.

## TASKS

### 1. Update purchasingService.ts
- Remove ALL mock data
- Implement complete PR lifecycle
- Implement PR approval workflow
- Implement DO management
- Implement lead time tracking

### 2. Update PurchasingListPage
- Fetch PRs from GET /api/v1/purchase-requests
- Implement filters (status, priority, date range, search)
- Show PR aging
- Display DO status

### 3. Update PurchasingDetailPage
- Fetch PR detail with items
- Show approval history
- Display delivery orders
- Show timeline

### 4. Update PurchasingFormPage
- Create: POST /api/v1/purchase-requests
- Update: PUT /api/v1/purchase-requests/{id}
- Add/manage PR items
- Calculate quantities from MR

### 5. Implement PR Lifecycle Actions
- Submit: POST /api/v1/purchase-requests/{id}/submit
- Approve: POST /api/v1/purchase-requests/{id}/approve
- Reject: POST /api/v1/purchase-requests/{id}/reject
- Resubmit: POST /api/v1/purchase-requests/{id}/resubmit
- Update lead time: PATCH /api/v1/purchase-requests/{id}/lead-time
- Mark processing: POST /api/v1/purchase-requests/{id}/status/processing
- Mark DO issued: POST /api/v1/purchase-requests/{id}/status/do-issued

### 6. Implement PR Item Management
- Add item: POST /api/v1/purchase-requests/{id}/items
- Update item: PUT /api/v1/purchase-requests/{id}/items/{itemId}
- Delete item: DELETE /api/v1/purchase-requests/{id}/items/{itemId}

### 7. Implement DO Management
- List DOs: GET /api/v1/purchase-requests/{id}/delivery-orders
- Create DO: POST /api/v1/purchase-requests/{id}/delivery-orders
- Delete DO: DELETE /api/v1/delivery-orders/{id}

### 8. Implement Reports
- PR Aging: GET /api/v1/reports/pr-aging
- PR Status Summary: GET /api/v1/reports/pr-status-summary

## API ENDPOINTS
GET /api/v1/purchase-requests
  Query: status, priority, start_date, end_date, sortBy, sortOrder, page, limit

POST /api/v1/purchase-requests
  Body: { mr_id?, required_date, priority, notes?, lead_time_estimate?, items }

PUT /api/v1/purchase-requests/{id}/items/{itemId}
  Body: { quantityRequested?, notes? }

POST /api/v1/purchase-requests/{id}/delivery-orders
  Body: { do_number, do_date, items: [{ pr_item_id, quantity }] }

## TYPES NEEDED
interface PurchaseRequest {
  id: string
  pr_number: string
  mr_id?: string
  requestDate: string
  required_date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  notes?: string
  lead_time_estimate?: number
  status: PRStatusType
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
  status: string
  items: DOItem[]
  createdAt: string
}

## FILES TO MODIFY
- src/services/purchasingService.ts (COMPLETE REWRITE)
- src/pages/purchasing/PurchasingListPage.tsx
- src/pages/purchasing/PurchasingDetailPage.tsx
- src/pages/purchasing/PurchasingFormPage.tsx
- src/types/purchasing.ts (update types)
- src/data/mockPurchasingData.ts (DELETE THIS FILE)

## ACCEPTANCE CRITERIA
- [ ] Complete PR lifecycle
- [ ] Approval workflow
- [ ] DO tracking
- [ ] Lead time management
- [ ] PR aging report
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
```

---

### 5. Warehouse Module Prompt

```markdown
# IMPLEMENT: Warehouse Module - Real API Integration

## CONTEXT
Implement complete warehouse management including:
- Stock management with safety stock alerts
- Goods Receipt (GR) with inspection workflow
- Goods Issue (GI) for production
- Finished Goods Receipt
- Warehouse Delivery Orders
- BAST (Berita Acara Serah Terima) generation

## TASKS

### 1. Update warehouseService.ts
- Remove ALL mock data
- Implement stock management
- Implement GR workflow with inspection
- Implement GI workflow
- Implement FG receipt
- Implement warehouse DO
- Implement BAST generation

### 2. Update WarehouseListPage (Stock)
- Fetch stock from GET /api/v1/warehouse/stock
- Show low stock alerts
- Display stock by category
- Allow safety stock updates

### 3. Implement Goods Receipt Flow
- Create GR: POST /api/v1/warehouse/goods-receipts
- Get available PRs: GET /api/v1/warehouse/goods-receipts/available-prs
- Get PR items: GET /api/v1/warehouse/goods-receipts/pr-items/{prId}
- Submit GR: POST /api/v1/warehouse/goods-receipts/{id}/submit
- Start inspection: POST /api/v1/warehouse/goods-receipts/{id}/start-inspection
- Complete inspection: PUT /api/v1/warehouse/inspections/{id}
- Approve inspection: POST /api/v1/warehouse/inspections/{id}/approve
- Reject inspection: POST /api/v1/warehouse/inspections/{id}/reject
- Complete GR: POST /api/v1/warehouse/goods-receipts/{id}/complete
- Generate BAST: POST /api/v1/warehouse/goods-receipts/{id}/bast

### 4. Implement Goods Issue Flow
- Create GI: POST /api/v1/warehouse/goods-issues
- Submit GI: POST /api/v1/warehouse/goods-issues/{id}/submit
- Approve GI: POST /api/v1/warehouse/goods-issues/{id}/approve
- Reject GI: POST /api/v1/warehouse/goods-issues/{id}/reject
- Issue goods: POST /api/v1/warehouse/goods-issues/{id}/issue

### 5. Implement Finished Goods Receipt
- List: GET /api/v1/warehouse/finished-goods-receipts
- Create: POST /api/v1/warehouse/finished-goods-receipts

### 6. Implement Warehouse DO
- List: GET /api/v1/warehouse/warehouse-dos
- Create: POST /api/v1/warehouse/warehouse-dos
- Release: POST /api/v1/warehouse/warehouse-dos/{id}/release
- Generate BAST: POST /api/v1/warehouse/warehouse-dos/{id}/bast

## API ENDPOINTS
GET /api/v1/warehouse/stock
  Query: category, lowStock, search, page, limit

PATCH /api/v1/warehouse/stock/{productId}/safety-stock
  Body: { safety_stock: number }

POST /api/v1/warehouse/goods-receipts
  Body: { pr_id, do_number, gr_date, notes?, items }

PUT /api/v1/warehouse/inspections/{id}
  Body: { status, notes? }

POST /api/v1/warehouse/goods-issues
  Body: { woId, items }

## TYPES NEEDED
interface Stock {
  id: string
  productId: string
  product: Product
  quantity: number
  safetyStock: number
  location: string
  lastUpdated: string
}

interface GoodsReceipt {
  id: string
  prId: string
  do_number: string
  gr_date: string
  status: GRStatusType
  notes?: string
  items: GRItem[]
  inspection?: Inspection
  bastInbound?: BASTInbound
  createdAt: string
  updatedAt: string
}

interface GoodsIssue {
  id: string
  woId: string
  status: GIStatusType
  items: GIItem[]
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Inspection {
  id: string
  grId: string
  status: InspectionStatusType
  photos: InspectionPhoto[]
  createdAt: string
  updatedAt: string
}

## FILES TO MODIFY
- src/services/warehouseService.ts (COMPLETE REWRITE)
- src/pages/warehouse/WarehouseListPage.tsx
- src/pages/warehouse/GoodsReceiptFormPage.tsx
- src/pages/warehouse/GoodsIssueFormPage.tsx
- src/pages/warehouse/DeliveryOrderFormPage.tsx
- src/pages/warehouse/StockAlertsPage.tsx
- src/types/warehouse.ts (update types)
- src/data/mockWarehouseData.ts (DELETE THIS FILE)

## ACCEPTANCE CRITERIA
- [ ] Stock management complete
- [ ] GR workflow with inspection
- [ ] GI workflow complete
- [ ] FG receipt works
- [ ] Warehouse DO works
- [ ] BAST generation
- [ ] Low stock alerts
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
```

---

### 6. Master Data Module Prompt

```markdown
# IMPLEMENT: Master Data Module - Real API Integration

## CONTEXT
Implement complete master data management for:
- Products (all types: FG, SEMI, RAW, PACKAGING, SPAREPART, SUPPORT)
- Bill of Materials (BOM) with versioning
- Import/Export functionality

## TASKS

### 1. Update masterDataService.ts
- Remove ALL mock data
- Implement product CRUD
- Implement BOM CRUD
- Implement import/export
- Implement search and filtering

### 2. Update ProductListPage
- Fetch products from GET /api/v1/products
- Implement filters (type, status, search)
- Implement pagination
- Add import/export actions
- Show product summary

### 3. Update ProductFormPage
- Create: POST /api/v1/products
- Update: PUT /api/v1/products/{id}
- Deactivate: POST /api/v1/products/{id}/deactivate
- Activate: POST /api/v1/products/{id}/activate
- Validate product codes

### 4. Update BoMListPage
- Fetch BOMs from GET /api/v1/boms
- Filter by status
- Show BOM versions

### 5. Update BoMFormPage
- Create BOM: POST /api/v1/boms or POST /api/v1/products/{productId}/bom
- Add BOM item: POST /api/v1/products/{productId}/bom/items
- Update BOM item: PUT /api/v1/products/{productId}/bom/items/{itemId}
- Delete BOM item: DELETE /api/v1/products/{productId}/bom/items/{itemId}
- Activate/Deactivate BOM

### 6. Implement Import/Export
- Import products: POST /api/v1/products/import
- Export products: GET /api/v1/products/export
- Download template: GET /api/v1/products/import/template
- Import BOMs: POST /api/v1/boms/import
- Export BOMs: GET /api/v1/boms/export

## API ENDPOINTS
GET /api/v1/products
  Query: type, status, search, sortBy, sortOrder, page, limit

POST /api/v1/products
  Body: { code, name, type, description?, baseUnit }

POST /api/v1/products/import
  Content-Type: multipart/form-data
  Body: { file }

GET /api/v1/products/{productId}/bom/materials
  Response: { success: boolean, data: BoMMaterial[] }

POST /api/v1/products/{productId}/bom/items
  Body: { materialId, quantityRequired, unit }

## TYPES NEEDED
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

## FILES TO MODIFY
- src/services/masterDataService.ts (COMPLETE REWRITE)
- src/pages/masterData/ProductListPage.tsx
- src/pages/masterData/ProductFormPage.tsx
- src/pages/masterData/BoMListPage.tsx
- src/pages/masterData/BoMFormPage.tsx
- src/types/masterData.ts (update types)
- src/data/mockMasterData.ts (DELETE THIS FILE)

## ACCEPTANCE CRITERIA
- [ ] Product CRUD complete
- [ ] BOM CRUD complete
- [ ] Import/export works
- [ ] Search and filtering
- [ ] Product validation
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
```

---

### 7. User Management Module Prompt

```markdown
# IMPLEMENT: User Management Module - Real API Integration

## CONTEXT
Implement complete user and role management with:
- User CRUD operations
- Role management
- Permission system
- Department-based access control

## TASKS

### 1. Update userService.ts
- Remove ALL mock data
- Implement user CRUD
- Implement role CRUD
- Implement permission management
- Implement department filtering

### 2. Update UserListPage
- Fetch users from GET /api/v1/users
- Implement filters (status, department, search)
- Implement pagination
- Show user permissions

### 3. Update UserFormPage
- Create: POST /api/v1/users
- Update: PUT /api/v1/users/{id}
- Deactivate: POST /api/v1/users/{id}/deactivate
- Reactivate: POST /api/v1/users/{id}/reactivate
- Reset password: POST /api/v1/users/{id}/reset-password

### 4. Update RolesListPage
- Fetch roles from GET /api/v1/roles
- Create role: POST /api/v1/roles
- Update role: PUT /api/v1/roles/{id}
- Delete role: DELETE /api/v1/roles/{id}
- Assign permissions

### 5. Implement Permission Management
- Get permissions: GET /api/v1/permissions
- Get user permissions: GET /api/v1/users/{id}/permissions
- Get approvers: GET /api/v1/permissions/approvers/{module}

## API ENDPOINTS
GET /api/v1/users
  Query: status, department, search, page, limit

POST /api/v1/users
  Body: { email, fullName, department, password?, roleIds }

GET /api/v1/permissions/approvers/{module}
  Response: { success: boolean, data: User[] }

## TYPES NEEDED
interface User {
  id: string
  email: string
  fullName: string
  department: DepartmentType
  role: string
  status: 'active' | 'inactive'
  permissions?: Permission[]
  createdAt: string
  updatedAt: string
}

type DepartmentType = 'GA' | 'FINANCE' | 'PURCHASING' | 'WAREHOUSE' | 'PRODUCTION' | 'QC' | 'PLANNING' | 'SALES'

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

## FILES TO MODIFY
- src/services/userService.ts (COMPLETE REWRITE)
- src/pages/users/UserListPage.tsx
- src/pages/users/UserFormPage.tsx
- src/pages/users/RolesListPage.tsx
- src/types/user.ts (update types)
- src/data/mockUserData.ts (DELETE THIS FILE)

## ACCEPTANCE CRITERIA
- [ ] User CRUD complete
- [ ] Role management complete
- [ ] Permission system works
- [ ] Department filtering
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
```

---

### 8. Dashboard Module Prompt

```markdown
# IMPLEMENT: Dashboard Module - Real API Integration

## CONTEXT
Implement comprehensive dashboard with:
- KPI metrics from all modules
- Production efficiency tracking
- Delivery performance
- Inventory alerts
- Purchasing status
- Real-time data updates

## TASKS

### 1. Update dashboardService.ts
- Remove ALL mock data
- Implement dashboard summary
- Implement KPI metrics
- Implement alerts
- Implement reports

### 2. Update DashboardPage
- Fetch summary from GET /api/v1/dashboard/summary
- Display KPI cards
- Show production chart
- Show delivery chart
- Display alerts
- Show recent activities

### 3. Implement KPI Widgets
- Production Efficiency
- On-Time Delivery Rate
- Inventory Value
- Low Stock Items
- Open PRs
- Average Lead Time

### 4. Implement Reports
- Production metrics: GET /api/v1/reports/production-metrics
- WO status summary: GET /api/v1/reports/wo-status-summary
- PR aging: GET /api/v1/reports/pr-aging
- PR status summary: GET /api/v1/reports/pr-status-summary

## API ENDPOINTS
GET /api/v1/dashboard/summary
  Response: {
    success: boolean,
    data: {
      production: { totalPlans, completedPlans, inProgressPlans, efficiency }
      delivery: { onTimeDelivery, totalDeliveries }
      inventory: { totalValue, lowStockItems }
      purchasing: { openPRs, avgLeadTime }
    }
  }

GET /api/v1/dashboard/kpis
  Response: { metrics: [{ name, value, unit, trend }] }

GET /api/v1/dashboard/alerts
  Response: { alerts: [{ id, category, severity, message, createdAt }] }

## TYPES NEEDED
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

interface KPI {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

interface Alert {
  id: string
  category: 'production' | 'inventory' | 'purchasing' | 'quality'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  createdAt: string
}

## FILES TO MODIFY
- src/services/dashboardService.ts (COMPLETE REWRITE)
- src/pages/DashboardPage.tsx
- src/components/dashboard/ (update widgets)
- src/types/dashboard.ts (update types)
- src/data/mockData.ts (DELETE THIS FILE)

## ACCEPTANCE CRITERIA
- [ ] Dashboard summary displays real data
- [ ] KPI widgets work
- [ ] Charts show real data
- [ ] Alerts display correctly
- [ ] No mock data
- [ ] Proper loading states
- [ ] Error handling
- [ ] Responsive design
```

---

## 🤖 Agent Swarm Delegation Guide

### Swarm Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR AGENT                        │
│  - Receives high-level task                                  │
│  - Breaks down into module-specific tasks                    │
│  - Delegates to specialized agents                           │
│  - Monitors progress                                         │
│  - Consolidates results                                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌─────────────────┐   ┌───────────────┐
│  FRONTEND     │   │   API/BACKEND   │   │    TYPES      │
│  AGENT        │   │   AGENT         │   │    AGENT      │
│               │   │                 │   │               │
│ - UI Pages    │   │ - Endpoints     │   │ - TypeScript  │
│ - Components  │   │ - Validation    │   │ - Interfaces  │
│ - Styling     │   │ - Integration   │   │ - Type Safety │
└───────────────┘   └─────────────────┘   └───────────────┘
```

### Agent Specializations

#### 1. Frontend Agent
**Responsibilities:**
- Page components
- UI components
- Forms and validation
- Styling (Tailwind CSS)
- State management
- User interactions

**Prompt Template:**
```markdown
## ROLE: Frontend Specialist Agent
## TASK: Implement [MODULE] pages and components

### Requirements:
1. Use shadcn/ui components
2. Follow Tailwind CSS utility classes
3. Implement responsive design
4. Add loading skeletons
5. Handle empty states
6. Use Sonner for notifications
7. Implement form validation with react-hook-form

### Files to Create/Modify:
- src/pages/[module]/[PageName].tsx
- src/components/[module]/[ComponentName].tsx

### Acceptance Criteria:
- [ ] Pixel-perfect implementation
- [ ] Responsive on all screen sizes
- [ ] Accessible (WCAG 2.1)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
```

#### 2. API/Backend Integration Agent
**Responsibilities:**
- Service layer implementation
- API client methods
- Request/response handling
- Error handling
- Caching strategies
- Retry logic

**Prompt Template:**
```markdown
## ROLE: API Integration Specialist Agent
## TASK: Implement [MODULE] service layer

### Requirements:
1. Use apiClient for all HTTP requests
2. Implement proper TypeScript types
3. Handle pagination
4. Implement filtering
5. Add error handling
6. Remove all mock data
7. Follow REST conventions

### Files to Create/Modify:
- src/services/[module]Service.ts
- src/lib/apiClient.ts (add methods)

### Acceptance Criteria:
- [ ] All endpoints implemented
- [ ] TypeScript types match OpenAPI
- [ ] Error handling complete
- [ ] No mock data references
- [ ] Proper HTTP methods
```

#### 3. Types Agent
**Responsibilities:**
- TypeScript interfaces
- Type definitions from OpenAPI
- Type safety
- Generic types
- Utility types

**Prompt Template:**
```markdown
## ROLE: TypeScript Specialist Agent
## TASK: Create type definitions for [MODULE]

### Requirements:
1. Extract types from openapi.yaml
2. Create TypeScript interfaces
3. Add JSDoc comments
4. Use proper TypeScript patterns
5. Ensure type safety
6. Create utility types

### Files to Create/Modify:
- src/types/[module].ts

### Acceptance Criteria:
- [ ] All types from OpenAPI
- [ ] Proper TypeScript syntax
- [ ] JSDoc documentation
- [ ] No `any` types
- [ ] Type exports
```

### Delegation Workflow

```yaml
Task: "Implement complete Production Planning module"

Orchestrator breaks down:
  - Frontend Agent:
    - PlanningListPage.tsx
    - PlanningDetailPage.tsx
    - PlanningFormPage.tsx
    - Planning components
  
  - API Agent:
    - planningService.ts
    - API methods in apiClient.ts
    - Error handling
  
  - Types Agent:
    - planning.ts types
    - Request/Response types
    - Filter types

Orchestrator consolidates:
  - Verify all files created
  - Check for mock data removal
  - Ensure type consistency
  - Run build to verify no errors
```

---

## ✅ Best Practices & Standards

### Code Style

```typescript
// ✅ DO: Use TypeScript interfaces
interface ProductionPlan {
  id: string
  plan_number: string
  status: ProductionPlanStatusType
}

// ❌ DON'T: Use `any`
const data: any = await api.get()

// ✅ DO: Use proper error handling
try {
  const response = await apiClient.get('/endpoint')
  if (!response.success) {
    toast.error(response.message || 'Request failed')
  }
  return response.data || []
} catch (error) {
  toast.error('Network error')
  return []
}

// ✅ DO: Use loading states
const [isLoading, setIsLoading] = useState(true)
const [data, setData] = useState<DataType[]>([])

// ✅ DO: Use Sonner for notifications
import { toast } from 'sonner'
toast.success('Plan created successfully')
toast.error('Failed to create plan')
```

### File Naming Conventions

```
✅ Correct:
- PlanningListPage.tsx
- planningService.ts
- ProductionPlan.ts (types)
- usePlanning.ts (hooks)

❌ Incorrect:
- planningList.tsx
- PlanningService.ts
- production_plan.ts
```

### API Client Usage

```typescript
// ✅ Correct pattern
const response = await apiClient.get<ProductionPlan[]>('/production-plans', params)
return response.data || []

// ✅ With error handling
try {
  const response = await apiClient.post<ProductionPlan>('/production-plans', data)
  if (!response.success) {
    throw new Error(response.message)
  }
  return response.data
} catch (error) {
  toast.error(error instanceof Error ? error.message : 'Failed to create plan')
  throw error
}
```

### Environment Variables

```env
# .env.local
VITE_API_URL=https://apex-erp-be-staging.itobsidianmuda.workers.dev
VITE_USE_MOCK_DATA=false
```

### Git Commit Messages

```bash
# Format: [MODULE] Action: Description

✅ Good:
git commit -m "[PLANNING] Implement production plan CRUD operations"
git commit -m "[PRODUCTION] Add QC session workflow"
git commit -m "[WAREHOUSE] Implement goods receipt inspection"

❌ Bad:
git commit -m "update code"
git commit -m "fix stuff"
```

---

## 📝 Quick Reference Checklist

### Before Implementation
- [ ] Read openapi.yaml thoroughly
- [ ] Understand module requirements from PRD
- [ ] Check existing service patterns
- [ ] Review type definitions
- [ ] Set up environment variables

### During Implementation
- [ ] Use TypeScript strict mode
- [ ] Follow existing code patterns
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Use shadcn/ui components
- [ ] Write JSDoc comments
- [ ] Test with real API

### After Implementation
- [ ] Remove all mock data
- [ ] Run TypeScript check
- [ ] Run ESLint
- [ ] Test all user flows
- [ ] Check responsive design
- [ ] Verify error handling
- [ ] Update documentation

---

## 🔗 Useful Links

- **OpenAPI Spec**: `/openapi.yaml`
- **PRD Documents**: `/prd-fe/PRD-*.md`
- **Design System**: `/app/`
- **API Staging**: `https://apex-erp-be-staging.itobsidianmuda.workers.dev`
- **shadcn/ui**: `https://ui.shadcn.com`
- **Tailwind CSS**: `https://tailwindcss.com`
- **Recharts**: `https://recharts.org`

---

## 📞 Support

For questions or clarifications:
1. Check PRD documents first
2. Review OpenAPI specification
3. Consult existing code patterns
4. Reach out to team lead

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-03-09  
**Maintained By**: Development Team
