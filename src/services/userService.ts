/**
 * User Service
 * Handles all User and Role management operations
 * Automatically switches between mock data and real API based on environment
 */

import type {
  User,
  Role,
  Permission,
  UserFilters,
  RoleFilters,
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  AuditLog,
} from "@/types/user";
import { UserStatus, Department } from "@/types/user";
import { apiClient } from "@/lib/apiClient";

// Check if using mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Import mock services only when needed
let mockAuthService: typeof import("@/data/mockUserData").authService | null = null;
let mockUserService: typeof import("@/data/mockUserData").userService | null = null;
let mockRoleService: typeof import("@/data/mockUserData").roleService | null = null;
let mockAuditService: typeof import("@/data/mockUserData").auditService | null = null;

const getMockServices = async () => {
  if (!mockAuthService) {
    const module = await import("@/data/mockUserData");
    mockAuthService = module.authService;
    mockUserService = module.userService;
    mockRoleService = module.roleService;
    mockAuditService = module.auditService;
  }
  return {
    authService: mockAuthService,
    userService: mockUserService,
    roleService: mockRoleService,
    auditService: mockAuditService,
  };
};

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (USE_MOCK_DATA) {
      const { authService } = await getMockServices();
      return authService.login(email, password);
    }

    const response = await apiClient.post<LoginResponse>("/auth/login", { email, password });
    if (!response.data) throw new Error("Login failed");
    return response.data;
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { authService } = await getMockServices();
      return authService.logout();
    }

    await apiClient.post("/auth/logout");
  },

  /**
   * Change password
   */
  changePassword: async (userId: string, data: ChangePasswordRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { authService } = await getMockServices();
      return authService.changePassword(userId, data);
    }

    await apiClient.post(`/users/${userId}/change-password`, data);
  },

  /**
   * Get current user permissions
   */
  getUserPermissions: async (userId: string): Promise<string[]> => {
    if (USE_MOCK_DATA) {
      const { authService } = await getMockServices();
      return authService.getUserPermissions(userId);
    }

    const response = await apiClient.get<string[]>(`/users/${userId}/permissions`);
    return response.data || [];
  },
};

// ============================================
// USER SERVICE
// ============================================

export const userService = {
  /**
   * Get all users with optional filters
   */
  getUsers: async (filters?: UserFilters): Promise<User[]> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.getUsers(filters);
    }

    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.department && filters.department !== "all") params.append("department", filters.department);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.roleId) params.append("role_id", filters.roleId);

    const response = await apiClient.get<User[]>(`/users?${params.toString()}`);
    return response.data || [];
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User | null> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      const user = await userService.getUserById(id);
      return user || null;
    }

    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data || null;
  },

  /**
   * Create new user
   */
  createUser: async (data: CreateUserRequest): Promise<User> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.createUser(data);
    }

    const response = await apiClient.post<User>("/users", data);
    if (!response.data) throw new Error("Failed to create user");
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.updateUser(id, data);
    }

    const response = await apiClient.put<User>(`/users/${id}`, data);
    if (!response.data) throw new Error("Failed to update user");
    return response.data;
  },

  /**
   * Deactivate user
   */
  deactivateUser: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.deactivateUser(id);
    }

    await apiClient.post(`/users/${id}/deactivate`);
  },

  /**
   * Reactivate user
   */
  reactivateUser: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.reactivateUser(id);
    }

    await apiClient.post(`/users/${id}/reactivate`);
  },

  /**
   * Reset user password
   */
  resetPassword: async (id: string, data: ResetPasswordRequest): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.resetPassword(id, data);
    }

    await apiClient.post(`/users/${id}/reset-password`, data);
  },

  /**
   * Get users by department
   */
  getUsersByDepartment: async (department: string): Promise<User[]> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.getUsers({ department: department as typeof Department[keyof typeof Department] });
    }

    const response = await apiClient.get<User[]>(`/users?department=${department}`);
    return response.data || [];
  },

  /**
   * Get active users
   */
  getActiveUsers: async (): Promise<User[]> => {
    if (USE_MOCK_DATA) {
      const { userService } = await getMockServices();
      return userService.getUsers({ status: "active" });
    }

    const response = await apiClient.get<User[]>("/users?status=active");
    return response.data || [];
  },
};

// ============================================
// ROLE SERVICE
// ============================================

export const roleService = {
  /**
   * Get all roles
   */
  getRoles: async (filters?: RoleFilters): Promise<Role[]> => {
    if (USE_MOCK_DATA) {
      const { roleService } = await getMockServices();
      return roleService.getRoles(filters);
    }

    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<Role[]>(`/roles?${params.toString()}`);
    return response.data || [];
  },

  /**
   * Get role by ID
   */
  getRoleById: async (id: string): Promise<Role | null> => {
    if (USE_MOCK_DATA) {
      const { roleService } = await getMockServices();
      const role = await roleService.getRoleById(id);
      return role || null;
    }

    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data || null;
  },

  /**
   * Create role
   */
  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    if (USE_MOCK_DATA) {
      const { roleService } = await getMockServices();
      return roleService.createRole(data);
    }

    const response = await apiClient.post<Role>("/roles", data);
    if (!response.data) throw new Error("Failed to create role");
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    if (USE_MOCK_DATA) {
      const { roleService } = await getMockServices();
      return roleService.updateRole(id, data);
    }

    const response = await apiClient.put<Role>(`/roles/${id}`, data);
    if (!response.data) throw new Error("Failed to update role");
    return response.data;
  },

  /**
   * Delete role
   */
  deleteRole: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const { roleService } = await getMockServices();
      return roleService.deleteRole(id);
    }

    await apiClient.delete(`/roles/${id}`);
  },

  /**
   * Get all permissions
   */
  getPermissions: async (): Promise<Permission[]> => {
    if (USE_MOCK_DATA) {
      const { roleService } = await getMockServices();
      return roleService.getPermissions();
    }

    const response = await apiClient.get<Permission[]>("/permissions");
    return response.data || [];
  },
};

// ============================================
// AUDIT SERVICE
// ============================================

export const auditService = {
  /**
   * Get audit logs
   */
  getAuditLogs: async (entityType?: string): Promise<AuditLog[]> => {
    if (USE_MOCK_DATA) {
      const { auditService } = await getMockServices();
      return auditService.getAuditLogs(entityType);
    }

    const params = new URLSearchParams();
    if (entityType) params.append("entity_type", entityType);

    const response = await apiClient.get<AuditLog[]>(`/audit-logs?${params.toString()}`);
    return response.data || [];
  },
};

// Export combined user management service
export const userManagementService = {
  auth: authService,
  user: userService,
  role: roleService,
  audit: auditService,
};

// Export types
export type { User, Role, Permission, UserFilters, RoleFilters, AuditLog };