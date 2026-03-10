/**
 * User Service
 * Handles all User and Role management operations
 * Real API integration
 *
 * Note: Backend uses cookie-based authentication
 */

import type {
  User,
  Role,
  Permission,
  UserFilters,
  RoleFilters,
  LoginResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  AuditLog,
} from "@/types/user";
import { apiClient } from "@/lib/apiClient";

// Backend login response structure (cookie-based auth)
interface BackendLoginResponse {
  user: User;
  requiresPasswordChange?: boolean;
}

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Login with email and password
   * Backend returns user data in response body and session token in HTTP-only cookie
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<BackendLoginResponse>("/auth/login", { email, password });
    if (!response.data || !response.data.user) throw new Error("Login failed");

    // Map backend response to frontend LoginResponse
    // Note: Token is handled via HTTP-only cookie, not in response body
    return {
      user: response.data.user,
      token: "", // Token is in HTTP-only cookie, not exposed to JS
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now (matches cookie max-age)
    };
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  /**
   * Change password
   */
  changePassword: async (userId: string, data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post(`/users/${userId}/change-password`, data);
  },

  /**
   * Get current user permissions
   * Note: Permissions are now included in the user object from login response
   */
  getUserPermissions: async (userId: string): Promise<string[]> => {
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
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data || null;
  },

  /**
   * Create new user
   */
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>("/users", data);
    if (!response.data) throw new Error("Failed to create user");
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    if (!response.data) throw new Error("Failed to update user");
    return response.data;
  },

  /**
   * Deactivate user
   */
  deactivateUser: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/deactivate`);
  },

  /**
   * Reactivate user
   */
  reactivateUser: async (id: string): Promise<void> => {
    await apiClient.post(`/users/${id}/reactivate`);
  },

  /**
   * Reset user password
   */
  resetPassword: async (id: string, data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post(`/users/${id}/reset-password`, data);
  },

  /**
   * Get users by department
   */
  getUsersByDepartment: async (department: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/users?department=${department}`);
    return response.data || [];
  },

  /**
   * Get active users
   */
  getActiveUsers: async (): Promise<User[]> => {
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
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<Role[]>(`/roles?${params.toString()}`);
    return response.data || [];
  },

  /**
   * Get role by ID
   */
  getRoleById: async (id: string): Promise<Role | null> => {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data || null;
  },

  /**
   * Create role
   */
  createRole: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await apiClient.post<Role>("/roles", data);
    if (!response.data) throw new Error("Failed to create role");
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    const response = await apiClient.put<Role>(`/roles/${id}`, data);
    if (!response.data) throw new Error("Failed to update role");
    return response.data;
  },

  /**
   * Delete role
   */
  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },

  /**
   * Get all permissions
   */
  getPermissions: async (): Promise<Permission[]> => {
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