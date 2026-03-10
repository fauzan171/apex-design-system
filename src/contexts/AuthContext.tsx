/**
 * Authentication Context
 * Manages user session, permissions, and auth state
 *
 * Note: Backend uses cookie-based authentication (HTTP-only session cookies)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  User,
  LoginCredentials,
  ChangePasswordRequest,
  PermissionString,
} from "@/types/user";
import { authService } from "@/services/userService";

interface AuthState {
  user: User | null;
  permissions: PermissionString[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  hasPermission: (permission: PermissionString) => boolean;
  hasAnyPermission: (permissions: PermissionString[]) => boolean;
  hasAllPermissions: (permissions: PermissionString[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "apex_erp_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    permissions: [],
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const userStr = localStorage.getItem(USER_KEY);

        if (!userStr) {
          setState((s) => ({ ...s, isLoading: false }));
          return;
        }

        const user = JSON.parse(userStr) as User;

        // Permissions are already included in the user object from login response
        const permissions = ((user as any).permissions || []) as PermissionString[];

        setState({
          user,
          permissions,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Session check failed:", error);
        // Clear invalid session
        localStorage.removeItem(USER_KEY);
        setState((s) => ({ ...s, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(
      credentials.email,
      credentials.password
    );

    // User object already includes permissions from backend
    const permissions = ((response.user as any).permissions || []) as PermissionString[];

    // Store user in localStorage (session is handled by HTTP-only cookie)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    setState({
      user: response.user,
      permissions,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();

    localStorage.removeItem(USER_KEY);

    setState({
      user: null,
      permissions: [],
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const changePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      if (!state.user) {
        throw new Error("Not authenticated");
      }
      await authService.changePassword(state.user.id, data);
    },
    [state.user]
  );

  const hasPermission = useCallback(
    (permission: PermissionString): boolean => {
      // Super admin has all permissions
      if (state.user?.roles?.some((r) => r.name === "Super Admin")) {
        return true;
      }

      const [module, _action] = permission.split(":");

      // Check exact permission
      if (state.permissions.includes(permission)) {
        return true;
      }

      // Check wildcard permission for module
      if (state.permissions.includes(`${module}:*` as PermissionString)) {
        return true;
      }

      return false;
    },
    [state.permissions, state.user]
  );

  const hasAnyPermission = useCallback(
    (permissions: PermissionString[]): boolean => {
      return permissions.some((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (permissions: PermissionString[]): boolean => {
      return permissions.every((p) => hasPermission(p));
    },
    [hasPermission]
  );

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    changePassword,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  return { isAuthenticated, isLoading };
}

// Hook for permission checking
export function usePermission(permission: PermissionString) {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Hook for multiple permissions
export function usePermissions(
  permissions: PermissionString[],
  mode: "any" | "all" = "any"
) {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  if (mode === "all") {
    return hasAllPermissions(permissions);
  }

  return hasAnyPermission(permissions);
}