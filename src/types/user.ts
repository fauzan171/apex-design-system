/**
 * User Management Types
 * Based on PRD-01-USER-MANAGEMENT.md and OpenAPI spec
 */

// ============================================
// ENUMS
// ============================================

// User Status (matches OpenAPI User.status)
export type UserStatusType = "active" | "inactive";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// Department (matches OpenAPI User.department)
export type DepartmentType =
  | "GA"
  | "FINANCE"
  | "PURCHASING"
  | "WAREHOUSE"
  | "PRODUCTION"
  | "QC"
  | "PLANNING"
  | "SALES";

export enum Department {
  GA = "GA",
  FINANCE = "FINANCE",
  PURCHASING = "PURCHASING",
  WAREHOUSE = "WAREHOUSE",
  PRODUCTION = "PRODUCTION",
  QC = "QC",
  PLANNING = "PLANNING",
  SALES = "SALES",
}

// ============================================
// PERMISSION SYSTEM
// ============================================

export type ModuleType =
  | "master_data"
  | "planning"
  | "purchasing"
  | "warehouse"
  | "production"
  | "dashboard"
  | "user_management";

export type ActionType =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "cancel"
  | "start"
  | "complete"
  | "qc"
  | "inspect"
  | "issue"
  | "do"
  | "bast"
  | "reports"
  | "export";

export type PermissionString = `${ModuleType}:${ActionType}` | `${ModuleType}:*`;

/**
 * Permission
 * Matches OpenAPI Permission schema
 */
export interface Permission {
  id: string;
  module: ModuleType;
  action: ActionType;
  description?: string;
}

// ============================================
// ROLE
// ============================================

/**
 * Role
 * Matches OpenAPI Role schema
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Role Summary (for list views)
 */
export interface RoleSummary {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissionCount: number;
}

// ============================================
// USER
// ============================================

/**
 * User
 * Matches OpenAPI User schema
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  department: DepartmentType;
  role?: string;
  roles?: Role[];
  status: UserStatusType;
  forceChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithPermissions extends User {
  permissions: PermissionString[];
}

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Login Request
 * Matches OpenAPI LoginRequest
 */
export interface LoginRequest {
  email: string;
  password: string;
}

// Legacy alias for backward compatibility
export type LoginCredentials = LoginRequest;

/**
 * Login Response
 */
export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

/**
 * Change Password Request
 * Matches OpenAPI ChangePasswordRequest
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change Own Password Request
 * Matches OpenAPI ChangeOwnPasswordRequest
 */
export interface ChangeOwnPasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// FORM TYPES
// ============================================

/**
 * Create User Request
 * Matches OpenAPI CreateUserRequest
 */
export interface CreateUserRequest {
  email: string;
  fullName: string;
  department: DepartmentType;
  password?: string;
  roleIds?: string[];
}

/**
 * Update User Request
 * Matches OpenAPI UpdateUserRequest
 */
export interface UpdateUserRequest {
  fullName?: string;
  department?: DepartmentType;
  roleIds?: string[];
}

/**
 * Reset Password Request
 * Matches OpenAPI ResetPasswordRequest
 */
export interface ResetPasswordRequest {
  newPassword: string;
}

/**
 * Create Role Request
 * Matches OpenAPI CreateRoleRequest
 */
export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds?: string[];
}

/**
 * Update Role Request
 * Matches OpenAPI UpdateRoleRequest
 */
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

/**
 * Update Profile Request
 * Matches OpenAPI UpdateProfileRequest
 */
export interface UpdateProfileRequest {
  fullName?: string;
  department?: DepartmentType;
}

// ============================================
// FILTER & SEARCH
// ============================================

export interface UserFilters {
  status?: UserStatusType | "all";
  department?: DepartmentType | "all";
  search?: string;
  roleId?: string;
}

export interface RoleFilters {
  search?: string;
}

// ============================================
// AUDIT LOG
// ============================================

/**
 * Audit Log
 * Matches OpenAPI AuditLog schema
 */
export interface AuditLog {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "APPROVAL" | "REJECTION";
  entityType: string;
  entityId: string;
  changedBy: string;
  changedAt: string;
  changes?: Record<string, { old?: unknown; new?: unknown }>;
  // Legacy fields
  changedByName?: string;
}

/**
 * Activity Log
 * Matches OpenAPI ActivityLog schema
 */
export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// ============================================
// UTILITY TYPES
// ============================================

export const departmentLabels: Record<DepartmentType, string> = {
  GA: "General Affairs",
  FINANCE: "Finance",
  PURCHASING: "Purchasing",
  WAREHOUSE: "Warehouse",
  PRODUCTION: "Production",
  QC: "Quality Control",
  PLANNING: "Planning",
  SALES: "Sales",
};

export const departmentColors: Record<DepartmentType, string> = {
  GA: "bg-slate-100 text-slate-700",
  FINANCE: "bg-blue-100 text-blue-700",
  PURCHASING: "bg-amber-100 text-amber-700",
  WAREHOUSE: "bg-green-100 text-green-700",
  PRODUCTION: "bg-purple-100 text-purple-700",
  QC: "bg-rose-100 text-rose-700",
  PLANNING: "bg-cyan-100 text-cyan-700",
  SALES: "bg-pink-100 text-pink-700",
};

export const userStatusColors: Record<UserStatusType, { bg: string; text: string; border: string }> = {
  active: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  inactive: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
  },
};

// ============================================
// PERMISSION HELPERS
// ============================================

export const availableModules: { id: ModuleType; label: string }[] = [
  { id: "master_data", label: "Master Data" },
  { id: "planning", label: "Planning" },
  { id: "purchasing", label: "Purchasing" },
  { id: "warehouse", label: "Warehouse" },
  { id: "production", label: "Production" },
  { id: "dashboard", label: "Dashboard" },
  { id: "user_management", label: "User Management" },
];

export const availableActions: { id: ActionType; label: string }[] = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
  { id: "approve", label: "Approve" },
  { id: "cancel", label: "Cancel" },
  { id: "start", label: "Start" },
  { id: "complete", label: "Complete" },
  { id: "qc", label: "QC" },
  { id: "inspect", label: "Inspect" },
  { id: "issue", label: "Issue" },
  { id: "do", label: "DO" },
  { id: "bast", label: "BAST" },
  { id: "reports", label: "Reports" },
  { id: "export", label: "Export" },
];

export function generateAllPermissions(): Permission[] {
  const permissions: Permission[] = [];
  let id = 1;

  availableModules.forEach((module) => {
    availableActions.forEach((action) => {
      // Skip approve for master_data, dashboard, user_management (based on PRD matrix)
      if (action.id === "approve" && ["master_data", "dashboard", "user_management"].includes(module.id)) {
        return;
      }
      // Skip some actions for dashboard
      if (module.id === "dashboard" && !["view", "export"].includes(action.id)) {
        return;
      }

      permissions.push({
        id: `perm-${String(id).padStart(3, "0")}`,
        module: module.id,
        action: action.id,
        description: `${action.label} ${module.label}`,
      });
      id++;
    });
  });

  return permissions;
}

export function hasPermission(
  userPermissions: PermissionString[],
  requiredPermission: PermissionString
): boolean {
  // Check exact permission
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }

  // Check wildcard permission
  const [module] = requiredPermission.split(":");
  if (userPermissions.includes(`${module}:*` as PermissionString)) {
    return true;
  }

  return false;
}

export function canApprove(userPermissions: PermissionString[], module: ModuleType): boolean {
  return hasPermission(userPermissions, `${module}:approve`);
}