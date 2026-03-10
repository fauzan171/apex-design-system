// Types for Dashboard Data

export type DateRange = "today" | "week" | "month" | "quarter" | "custom";

export interface DailyData {
  name: string;
  value: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface AgingData {
  name: string;
  value: number;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  stage: "Planning" | "Production" | "QC" | "Delivery" | "Delivered";
  eta: number;
}

export interface Alert {
  type: "low-stock" | "delayed-wo" | "aging-pr" | "bast";
  message: string;
  severity: "high" | "medium" | "low";
}

export interface ComparisonData {
  name: string;
  current: number;
  previous: number;
}

export interface ProductionKPIs {
  efficiency: number;
  efficiencyTrend: number;
  onTimeRate: number;
  onTimeTrend: number;
  qcPassRate: number;
  qcTrend: number;
  totalWOs: number;
  dailyTrend: DailyData[];
  statusBreakdown: StatusData[];
}

export interface DeliveryKPIs {
  onTimeRate: number;
  onTimeTrend: number;
  avgLeadTime: number;
  leadTimeTrend: number;
  bastCompletion: number;
  totalDOs: number;
  dailyTrend: DailyData[];
  statusBreakdown: StatusData[];
}

export interface InventoryKPIs {
  stockValue: number;
  stockValueFormatted: string;
  stockTrend: number;
  lowStockCount: number;
  byCategory: CategoryData[];
  aging: AgingData[];
}

export interface PurchasingKPIs {
  avgProcessingTime: number;
  processingTrend: number;
  approvalRate: number;
  approvalTrend: number;
  statusBreakdown: StatusData[];
  aging: AgingData[];
}

export interface DashboardData {
  production: ProductionKPIs;
  delivery: DeliveryKPIs;
  inventory: InventoryKPIs;
  purchasing: PurchasingKPIs;
  projects: Project[];
  alerts: Alert[];
  comparison: ComparisonData[];
  lastUpdated: Date;
}

// ============================================
// RE-EXPORTS FROM MODULE TYPES
// ============================================

// User Management Types
export type {
  User,
  UserWithPermissions,
  Role,
  RoleSummary,
  Permission,
  LoginRequest,
  LoginCredentials,
  LoginResponse,
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  UserFilters,
  RoleFilters,
  AuditLog,
  ActivityLog,
  UserStatusType,
  DepartmentType,
  ModuleType,
  ActionType,
  PermissionString,
} from "./user";

export {
  UserStatus,
  Department,
  departmentLabels,
  departmentColors,
  userStatusColors,
  availableModules,
  availableActions,
  generateAllPermissions,
  hasPermission,
  canApprove,
} from "./user";

// Master Data Types
export type {
  Product,
  ProductType,
  ProductStatusType,
  CreateProductRequest,
  UpdateProductRequest,
  BoM,
  BoMItem,
  BoMComponent,
  BoMStatusType,
  CreateBoMRequest,
  UpdateBoMRequest,
  UpdateBoMStatusRequest,
  AddBoMItemRequest,
  UpdateBoMItemRequest,
  ProductFilter,
  BoMFilter,
  UnitOfMeasure,
} from "./masterData";

export {
  ProductCategory,
  BoMStatus,
  productTypeLabels,
  productStatusLabels,
  productCategoryLabels,
  boMStatusLabels,
  productTypeColors,
  productStatusColors,
  productCategoryColors,
  boMStatusColors,
  unitOfMeasureLabels,
  categoryToType,
  typeToCategory,
} from "./masterData";

// Planning Types
export type {
  ProductionPlan,
  ProductionPlanItem,
  ProductionPlanStatusType,
  MaterialRequirement,
  MRItem,
  MRStatusType,
  MaterialPriority,
  ApprovalHistory,
  PlanApprovalLog,
  CriticalMaterial,
  ProductionPlanFormData,
  ProductionPlanItemFormData,
  UpdateProductionPlanRequest,
  SubmitPlanRequest,
  ApprovePlanRequest,
  RejectPlanRequest,
  CancelPlanRequest,
  ProductionPlanFilters,
  ProductionPlanListResponse,
  Product as PlanningProduct,
  ProductReference,
  BoMMaterial,
} from "./planning";

export {
  ProductionPlanStatus,
  MRStatus,
  MRItemStatus,
  productionPlanStatusColors,
  canPlanTransitionTo,
  canPlanEdit,
  canPlanDelete,
  needsPlanApproval,
  canPlanCancel,
  getPlanStatusLabel,
} from "./planning";

// Production Types
export type {
  WorkOrder,
  WOStep,
  WOProgress,
  ProgressPhoto,
  QCSession,
  QCFinding,
  QCFindingPhoto,
  WOStatusType,
  WOStepStatusType,
  QCSessionStatusType,
  QCResultType,
  QCFindingStatusType,
  QCFindingPhotoType,
  WOFormData,
  WOStepFormData,
  UpdateWORequest,
  CancelWORequest,
  ProgressUpdateFormData,
  QCFindingFormData,
  WOFilters,
  ProductionMetrics,
} from "./production";

export {
  WOStatus,
  WOStepStatus,
  QCSessionStatus,
  QCResult,
  QCFindingStatus,
  woStatusColors,
  woStepStatusColors,
  canWOTransitionTo,
  canWOEdit,
  canWOCancel,
  canUpdateProgress,
  canMarkForQC,
  isInQC,
  canStartQC,
  canComplete,
  getWOStatusLabel,
} from "./production";

// Purchasing Types
export type {
  PurchaseRequest,
  PRItem,
  PRStatusType,
  PRItemStatusType,
  PRPriorityType,
  ApprovalHistory as PRAprovalHistory,
  DeliveryOrderFromHO,
  DOItem as PRDOItem,
  DOStatusType,
  CreatePRRequest,
  UpdatePRRequest,
  SubmitPRRequest,
  ApprovePRRequest,
  RejectPRRequest,
  PRFilters,
  PRListResponse,
} from "./purchasing";

export {
  PRStatus,
  PRItemStatus,
  PRPriority,
  DOStatus,
  prStatusColors,
  prPriorityColors,
  canTransitionTo as canPRTransitionTo,
  canEdit as canPREdit,
  canDelete as canPRDelete,
  needsApproval as needsPRApproval,
  canAddDO,
  getPRStatusLabel,
  getPRPriorityLabel,
} from "./purchasing";

// Warehouse Types
export type {
  Stock,
  StockAlert,
  GoodsReceipt,
  GRItem,
  GRStatusType,
  GoodsIssue,
  GIItem,
  GIStatusType,
  FinishedGoodsReceipt,
  FGStatusType,
  DeliveryOrder,
  WarehouseDOItem,
  BASTInbound,
  BASTOutbound,
  BASTStatusType,
  Inspection,
  InspectionPhoto,
  InspectionStatusType,
  WDOStatusType,
  ProductReference as WarehouseProductReference,
  GRFormData,
  GRItemFormData,
  UpdateGRRequest,
  CancelGRRequest,
  GIFormData,
  GIItemFormData,
  WDDOFormData,
  StockFilters,
  GRFilters,
  GIFilters,
  DOFilters,
} from "./warehouse";

export {
  StockCategory,
  GRStatus,
  GIStatus,
  FGStatus,
  BASTStatus,
  InspectionStatus,
  WDOStatus,
  grStatusColors,
  giStatusColors,
  bastStatusColors,
  wdoStatusColors,
  canGRTransitionTo,
  canGITransitionTo,
  canEditGR,
  canCancelGR,
  canEditGI,
  StockCategoryColors,
  StockCategoryLabels,
  getDODate,
  getDONumber,
} from "./warehouse";

// Delivery Types
export type {
  DeliveryOrder as DeliveryOrderOutbound,
  DOItem as DeliveryDOItem,
  DOStatusType as DOOutboundStatusType,
  BASTOutbound as BASTOutboundType,
  DOFormData,
  DOFilters as DOOutboundFilters,
} from "./delivery";

export {
  DOStatus as DOOutboundStatus,
  BASTStatus as BASTOutboundStatus,
  doStatusColors,
  bastStatusColors as bastOutboundStatusColors,
  canTransitionTo as canDOTransitionTo,
  canEditDO,
  canCancelDO,
  canReleaseDO,
  canUploadBAST,
  getDOStatusLabel,
  getDONumber as getDOOutboundNumber,
  getDODate as getDOOutboundDate,
} from "./delivery";