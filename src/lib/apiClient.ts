/**
 * API Client
 * Handles all API requests to the Apache Apex ERP Backend
 * Based on OpenAPI specification at /openapi.yaml
 *
 * Note: Backend uses cookie-based authentication (HTTP-only session cookies)
 */

// Use empty string for proxy (same origin) or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_PREFIX = "/api/v1";

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiClient {
  /**
   * Set the authentication token (kept for backward compatibility, not used with cookie auth)
   */
  setToken(_token: string | null) {
    // No-op: using cookie-based auth
  }

  /**
   * Clear the authentication token (kept for backward compatibility, not used with cookie auth)
   */
  clearToken() {
    // No-op: using cookie-based auth
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // Note: Not using Authorization header - backend uses HTTP-only cookies
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    // Ensure endpoint starts with / and prepend API prefix
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${API_PREFIX}${normalizedEndpoint}`;
    const defaultOptions: RequestOptions = {
      method: "GET",
      headers: this.getHeaders(),
    };

    const requestOptions: RequestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}),
      },
    };

    try {
      // Include credentials for cookie-based authentication
      const response = await fetch(url, {
        ...requestOptions,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || errorData.error?.message || "Request failed",
          error: errorData.error?.code || response.statusText,
        };
      }

      const data = await response.json().catch(() => ({}));
      return {
        success: true,
        data: data.data || data,
        pagination: data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error",
        error: (error as Error).message,
      };
    }
  }

  // ============================================
  // Generic HTTP Methods
  // ============================================

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // ============================================
  // Authentication
  // ============================================

  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.success && response.data) {
      // Store token in localStorage for backward compatibility
      if (response.data.token) {
        localStorage.setItem("apex_erp_token", response.data.token);
      }
    }
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    // Clear token from localStorage
    localStorage.removeItem("apex_erp_token");
    return await this.request<void>("/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return await this.request<any>("/auth/me");
  }

  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<ApiResponse<any>> {
    return await this.request<any>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // Users
  // ============================================

  async getUsers(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    return await this.request<any>(`/users?${query.toString()}`);
  }

  async getUserById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/users/${id}`);
  }

  async createUser(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async resetUserPassword(id: string, newPassword: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    });
  }

  async deactivateUser(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/users/${id}/deactivate`, { method: "POST" });
  }

  async activateUser(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/users/${id}/activate`, { method: "POST" });
  }

  // ============================================
  // Roles
  // ============================================

  async getRoles(): Promise<ApiResponse<any>> {
    return await this.request<any>("/roles");
  }

  async createRole(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRoleById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/roles/${id}`);
  }

  async updateRole(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/roles/${id}`, { method: "DELETE" });
  }

  // ============================================
  // Permissions
  // ============================================

  async getPermissions(): Promise<ApiResponse<any>> {
    return await this.request<any>("/permissions");
  }

  // ============================================
  // Audit Logs
  // ============================================

  async getAuditLogs(params?: { entityType?: string; entityId?: string; limit?: number }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.entityType) query.set("entityType", params.entityType);
    if (params?.entityId) query.set("entityId", params.entityId);
    if (params?.limit) query.set("limit", params.limit.toString());
    return await this.request<any>(`/audit-logs?${query.toString()}`);
  }

  async getEntityAuditHistory(entityType: string, entityId: string, limit?: number): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (limit) query.set("limit", limit.toString());
    return await this.request<any>(`/audit-logs/${entityType}/${entityId}?${query.toString()}`);
  }

  // ============================================
  // Products
  // ============================================

  async getProducts(params?: { page?: number; limit?: number; type?: string; status?: string; search?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.type) query.set("type", params.type);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    return await this.request<any>(`/products?${query.toString()}`);
  }

  async getProductById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${id}`);
  }

  async createProduct(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deactivateProduct(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/products/${id}/deactivate`, { method: "POST" });
  }

  async activateProduct(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/products/${id}/activate`, { method: "POST" });
  }

  async searchProducts(q: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/search?q=${encodeURIComponent(q)}`);
  }

  async getProductsByType(type: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/by-type?type=${type}`);
  }

  async getProductSummary(): Promise<ApiResponse<any>> {
    return await this.request<any>("/products/summary");
  }

  async validateProductCodes(codes: string[]): Promise<ApiResponse<any>> {
    return await this.request<any>("/products/validate-codes", {
      method: "POST",
      body: JSON.stringify({ codes }),
    });
  }

  async importProducts(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    const headers = this.getHeaders();
    delete headers["Content-Type"];
    return await this.request<any>("/products/import", {
      method: "POST",
      headers,
      body: formData,
    });
  }

  async exportProducts(params?: { type?: string; status?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.type) query.set("type", params.type);
    if (params?.status) query.set("status", params.status);
    return await this.request<any>(`/products/export?${query.toString()}`);
  }

  async getProductImportTemplate(): Promise<ApiResponse<any>> {
    return await this.request<any>("/products/import/template");
  }

  // ============================================
  // BOM (Bill of Materials)
  // ============================================

  async getBOMs(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    return await this.request<any>(`/boms?${query.toString()}`);
  }

  async getBOM(productId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${productId}/bom`);
  }

  async createBOM(productId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${productId}/bom`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBOMStatus(productId: string, status: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${productId}/bom/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async addBOMItem(productId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${productId}/bom/items`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBOMItem(productId: string, itemId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${productId}/bom/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBOMItem(productId: string, itemId: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/products/${productId}/bom/items/${itemId}`, { method: "DELETE" });
  }

  async getBOMMaterials(productId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/products/${productId}/bom/materials`);
  }

  async importBOMs(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    const headers = this.getHeaders();
    delete headers["Content-Type"];
    return await this.request<any>("/boms/import", {
      method: "POST",
      headers,
      body: formData,
    });
  }

  async exportBOMs(status?: string): Promise<ApiResponse<any>> {
    const query = status ? `?status=${status}` : "";
    return await this.request<any>(`/boms/export${query}`);
  }

  async getBOMImportTemplate(): Promise<ApiResponse<any>> {
    return await this.request<any>("/boms/import/template");
  }

  // ============================================
  // Production Plans
  // ============================================

  async getPlans(params?: { status?: string; planDateFrom?: string; planDateTo?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.planDateFrom) query.set("plan_date_from", params.planDateFrom);
    if (params?.planDateTo) query.set("plan_date_to", params.planDateTo);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
    return await this.request<any>(`/production-plans?${query.toString()}`);
  }

  async getPlanById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}`);
  }

  async createPlan(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/production-plans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePlan(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePlan(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/production-plans/${id}`, { method: "DELETE" });
  }

  async submitPlan(id: string, data?: { materialPriorities?: any[] }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/submit`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
  }

  async approvePlan(id: string, notes?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  async rejectPlan(id: string, reason: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async cancelPlan(id: string, reason: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async requestEditPlan(id: string, reason: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/request-edit`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async getPlanApprovalHistory(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/approval-history`);
  }

  async addPlanItem(id: string, data: { productId: string; quantity: number; materialPriorities?: any[] }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/items`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePlanItem(id: string, itemId: string, data: { quantity?: number; materialPriorities?: any[] }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePlanItem(id: string, itemId: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/production-plans/${id}/items/${itemId}`, { method: "DELETE" });
  }

  async updateMaterialPriorities(id: string, itemId: string, priorities: any[]): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/items/${itemId}/priorities`, {
      method: "PUT",
      body: JSON.stringify({ priorities }),
    });
  }

  async getMaterialRequirements(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/material-requirements`);
  }

  async createPRFromMR(id: string, data: { items: any[]; requiredDate: string; priority: string; notes?: string }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/create-pr`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createWOFromPlan(id: string, itemId: string, data: { targetDate: string; notes?: string }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production-plans/${id}/items/${itemId}/create-wo`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // Production / Work Orders
  // ============================================

  async getWOs(params?: { status?: string; planId?: string; page?: number; limit?: number; search?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.planId) query.set("planId", params.planId);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    return await this.request<any>(`/production/work-orders?${query.toString()}`);
  }

  async getWOById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${id}`);
  }

  async createWO(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/production/work-orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateWO(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteWO(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/production/work-orders/${id}`, { method: "DELETE" });
  }

  async releaseWO(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${id}/release`, {
      method: "POST",
    });
  }

  async startWO(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${id}/start`, {
      method: "POST",
    });
  }

  async markWOForQC(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${id}/mark-qc`, {
      method: "POST",
    });
  }

  async completeWO(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${id}/complete`, {
      method: "POST",
    });
  }

  async cancelWO(id: string, reason: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  // WO Steps
  async getWOSteps(woId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/steps`);
  }

  async addWOStep(woId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/steps`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getWOStep(woId: string, stepId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/steps/${stepId}`);
  }

  async updateWOStep(woId: string, stepId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/steps/${stepId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteWOStep(woId: string, stepId: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/production/work-orders/${woId}/steps/${stepId}`, { method: "DELETE" });
  }

  async reorderWOSteps(woId: string, stepIds: string[]): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/steps/reorder`, {
      method: "PUT",
      body: JSON.stringify({ stepIds }),
    });
  }

  async startWOStep(woId: string, stepId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/steps/${stepId}/start`, {
      method: "POST",
    });
  }

  async completeWOStep(woId: string, stepId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/steps/${stepId}/complete`, {
      method: "POST",
    });
  }

  // WO Progress
  async getWOProgress(woId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/progress`);
  }

  async updateWOProgress(woId: string, data: { quantity: number; notes?: string }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/progress`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getWOProgressHistory(woId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/progress/history`);
  }

  // Progress Photos
  async getProgressPhotos(progressId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/progress/${progressId}/photos`);
  }

  async uploadProgressPhoto(progressId: string, file: File, caption?: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    if (caption) formData.append("caption", caption);
    const headers = this.getHeaders();
    delete headers["Content-Type"];
    return await this.request<any>(`/production/progress/${progressId}/photos`, {
      method: "POST",
      headers,
      body: formData,
    });
  }

  async updateProgressPhotoCaption(progressId: string, photoId: string, caption: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/progress/${progressId}/photos/${photoId}`, {
      method: "PATCH",
      body: JSON.stringify({ caption }),
    });
  }

  async deleteProgressPhoto(progressId: string, photoId: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/production/progress/${progressId}/photos/${photoId}`, { method: "DELETE" });
  }

  async getProgressPhotoUploadUrl(progressId: string, filename: string, contentType: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/progress/${progressId}/photos/upload-url`, {
      method: "POST",
      body: JSON.stringify({ filename, contentType }),
    });
  }

  async confirmProgressPhotoUpload(progressId: string, uploadId: string, key: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/progress/${progressId}/photos/confirm`, {
      method: "POST",
      body: JSON.stringify({ uploadId, key }),
    });
  }

  async getPhotoFile(photoId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/photos/${photoId}/file`);
  }

  // QC Sessions
  async getQCSessions(params?: { status?: string; result?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.result) query.set("result", params.result);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return await this.request<any>(`/production/qc-sessions?${query.toString()}`);
  }

  async getQCSession(sessionId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-sessions/${sessionId}`);
  }

  async startQCSession(woId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/qc/start`, {
      method: "POST",
    });
  }

  async getQCWOProgress(sessionId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-sessions/${sessionId}/wo-progress`);
  }

  async getQCFindings(sessionId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-sessions/${sessionId}/findings`);
  }

  async addQCFinding(sessionId: string, data: { description: string; reworkNotes?: string }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-sessions/${sessionId}/findings`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async passQC(sessionId: string, notes?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-sessions/${sessionId}/pass`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  async failQC(sessionId: string, notes?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-sessions/${sessionId}/fail`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  // QC Findings
  async getQCFinding(findingId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-findings/${findingId}`);
  }

  async updateQCFinding(findingId: string, data: { description?: string; reworkNotes?: string }): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-findings/${findingId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteQCFinding(findingId: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/production/qc-findings/${findingId}`, { method: "DELETE" });
  }

  async resolveQCFinding(findingId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-findings/${findingId}/resolve`, {
      method: "POST",
    });
  }

  async getQCFindingPhotos(findingId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/qc-findings/${findingId}/photos`);
  }

  async uploadQCFindingPhoto(findingId: string, file: File, type?: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    if (type) formData.append("type", type);
    const headers = this.getHeaders();
    delete headers["Content-Type"];
    return await this.request<any>(`/production/qc-findings/${findingId}/photos`, {
      method: "POST",
      headers,
      body: formData,
    });
  }

  async deleteQCFindingPhoto(findingId: string, photoId: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/production/qc-findings/${findingId}/photos/${photoId}`, { method: "DELETE" });
  }

  async uploadReworkPhoto(findingId: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    const headers = this.getHeaders();
    delete headers["Content-Type"];
    return await this.request<any>(`/production/qc-findings/${findingId}/rework-photos`, {
      method: "POST",
      headers,
      body: formData,
    });
  }

  // Rework
  async getReworkNotes(woId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/rework-notes`);
  }

  async getReworkStatus(woId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/rework-status`);
  }

  async getWOCompletionStatus(woId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/production/work-orders/${woId}/completion-status`);
  }

  // ============================================
  // Purchase Requests
  // ============================================

  async getPRs(params?: { status?: string; priority?: string; startDate?: string; endDate?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.priority) query.set("priority", params.priority);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
    return await this.request<any>(`/purchase-requests?${query.toString()}`);
  }

  async getPRById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}`);
  }

  async createPR(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/purchase-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePR(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePR(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/purchase-requests/${id}`, { method: "DELETE" });
  }

  async submitPR(id: string, notes?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/submit`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  async approvePR(id: string, notes?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  async rejectPR(id: string, reason: string, notes?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason, notes }),
    });
  }

  async resubmitPR(id: string, notes?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/resubmit`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  }

  async cancelPR(id: string, reason: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async addPRItem(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/items`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePRItem(id: string, itemId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePRItem(id: string, itemId: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/purchase-requests/${id}/items/${itemId}`, { method: "DELETE" });
  }

  async updatePRLeadTime(id: string, leadTimeEstimate: number): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/lead-time`, {
      method: "PATCH",
      body: JSON.stringify({ lead_time_estimate: leadTimeEstimate }),
    });
  }

  async markPRAsProcessing(id: string, doNumber: string, doDate: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/mark-processing`, {
      method: "POST",
      body: JSON.stringify({ do_number: doNumber, do_date: doDate }),
    });
  }

  async markPRAsDOIssued(id: string, doNumber: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/mark-do-issued`, {
      method: "POST",
      body: JSON.stringify({ do_number: doNumber }),
    });
  }

  async addPRNote(id: string, note: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/purchase-requests/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    });
  }

  // ============================================
  // Delivery Orders (Purchasing)
  // ============================================

  async getDeliveryOrders(params?: { prId?: string; status?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.prId) query.set("prId", params.prId);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return await this.request<any>(`/delivery-orders?${query.toString()}`);
  }

  async getDeliveryOrderById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/delivery-orders/${id}`);
  }

  // ============================================
  // Warehouse - Stock
  // ============================================

  async getStocks(params?: { page?: number; limit?: number; category?: string; lowStock?: boolean; search?: string }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.category) query.set("category", params.category);
    if (params?.lowStock) query.set("lowStock", params.lowStock.toString());
    if (params?.search) query.set("search", params.search);
    return await this.request<any>(`/warehouse/stock?${query.toString()}`);
  }

  async getStockById(productId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/stock/${productId}`);
  }

  async getLowStockAlerts(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/stock/alerts/low-stock");
  }

  async updateSafetyStock(productId: string, safetyStock: number): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/stock/${productId}/safety-stock`, {
      method: "PATCH",
      body: JSON.stringify({ safety_stock: safetyStock }),
    });
  }

  // ============================================
  // Warehouse - Goods Receipt
  // ============================================

  async getGoodsReceipts(params?: { status?: string; prId?: string; startDate?: string; endDate?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.prId) query.set("pr_id", params.prId);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return await this.request<any>(`/warehouse/goods-receipts?${query.toString()}`);
  }

  async getGoodsReceiptById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-receipts/${id}`);
  }

  async createGoodsReceipt(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/goods-receipts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGoodsReceipt(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-receipts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateGRItem(id: string, itemId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-receipts/${id}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async startGRInspection(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-receipts/${id}/start-inspection`, {
      method: "POST",
    });
  }

  async completeGR(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-receipts/${id}/complete`, {
      method: "POST",
    });
  }

  async cancelGR(id: string, reason: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-receipts/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async getAvailablePRsForGR(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/goods-receipts/available-prs");
  }

  async getPRItemsForGR(prId: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-receipts/pr-items/${prId}`);
  }

  // ============================================
  // Warehouse - Inspections
  // ============================================

  async getInspections(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/inspections");
  }

  async getPendingInspections(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/inspections/pending");
  }

  async getInspectionById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/inspections/${id}`);
  }

  async updateInspection(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/inspections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async submitInspection(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/inspections/${id}/submit`, {
      method: "POST",
    });
  }

  async approveInspection(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/inspections/${id}/approve`, {
      method: "POST",
    });
  }

  async rejectInspection(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/inspections/${id}/reject`, {
      method: "POST",
    });
  }

  async uploadInspectionPhoto(id: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("photo", file);
    const headers = this.getHeaders();
    delete headers["Content-Type"];
    return await this.request<any>(`/warehouse/inspections/${id}/photos`, {
      method: "POST",
      headers,
      body: formData,
    });
  }

  // ============================================
  // Warehouse - BAST Inbound
  // ============================================

  async getBASTInboundList(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/bast-inbound");
  }

  async getBASTInboundById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/bast-inbound/${id}`);
  }

  async generateBASTInbound(grId: string): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/bast-inbound/generate", {
      method: "POST",
      body: JSON.stringify({ gr_id: grId }),
    });
  }

  async getBASTInboundPDF(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/bast-inbound/${id}/pdf`);
  }

  // ============================================
  // Warehouse - Goods Issue
  // ============================================

  async getAvailableWOsForGI(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/goods-issues/available-wos");
  }

  async getGoodsIssues(params?: { status?: string; woId?: string; startDate?: string; endDate?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.woId) query.set("wo_id", params.woId);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return await this.request<any>(`/warehouse/goods-issues?${query.toString()}`);
  }

  async getGoodsIssueById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}`);
  }

  async createGoodsIssue(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/goods-issues", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateGoodsIssue(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateGIItem(id: string, itemId: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async submitGoodsIssue(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}/submit`, {
      method: "POST",
    });
  }

  async approveGoodsIssue(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}/approve`, {
      method: "POST",
    });
  }

  async rejectGoodsIssue(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}/reject`, {
      method: "POST",
    });
  }

  async confirmGoodsIssue(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}/confirm`, {
      method: "POST",
    });
  }

  async cancelGoodsIssue(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/goods-issues/${id}/cancel`, {
      method: "POST",
    });
  }

  // ============================================
  // Warehouse - Finished Goods Receipt
  // ============================================

  async getFinishedGoodsReceipts(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/finished-goods-receipts");
  }

  async getFinishedGoodsReceiptById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/finished-goods-receipts/${id}`);
  }

  async createFinishedGoodsReceipt(data: { woId: string; quantity: number }): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/finished-goods-receipts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ============================================
  // Warehouse - Delivery Order (DO)
  // ============================================

  async getAvailableStockForDO(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/do/available-stock");
  }

  async getWarehouseDOs(params?: { status?: string; startDate?: string; endDate?: string; search?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    return await this.request<any>(`/warehouse/do?${query.toString()}`);
  }

  async getWarehouseDOById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/do/${id}`);
  }

  async createWarehouseDO(data: any): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/do", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateWarehouseDO(id: string, data: any): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/do/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async releaseWarehouseDO(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/do/${id}/release`, {
      method: "POST",
    });
  }

  async confirmWarehouseDO(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/do/${id}/confirm`, {
      method: "POST",
    });
  }

  async cancelWarehouseDO(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/do/${id}/cancel`, {
      method: "POST",
    });
  }

  // ============================================
  // Warehouse - BAST Outbound
  // ============================================

  async getBASTOutboundList(): Promise<ApiResponse<any>> {
    return await this.request<any>("/warehouse/bast-outbound");
  }

  async getBASTOutboundById(id: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/warehouse/bast-outbound/${id}`);
  }

  async uploadBASTOutbound(doId: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("do_id", doId);
    const headers = this.getHeaders();
    delete headers["Content-Type"];
    return await this.request<any>("/warehouse/bast-outbound/upload", {
      method: "POST",
      headers,
      body: formData,
    });
  }

  // ============================================
  // Dashboard
  // ============================================

  async getDashboardSummary(queryString?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/dashboard/summary${queryString ? `?${queryString}` : ""}`);
  }

  async getProductionKPIs(queryString?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/dashboard/production-kpis${queryString ? `?${queryString}` : ""}`);
  }

  async getDeliveryKPIs(queryString?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/dashboard/delivery-kpis${queryString ? `?${queryString}` : ""}`);
  }

  async getInventoryKPIs(queryString?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/dashboard/inventory-kpis${queryString ? `?${queryString}` : ""}`);
  }

  async getPurchasingKPIs(queryString?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/dashboard/purchasing-kpis${queryString ? `?${queryString}` : ""}`);
  }

  async getDashboardProjects(queryString?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/dashboard/projects${queryString ? `?${queryString}` : ""}`);
  }

  async getDashboardAlerts(queryString?: string): Promise<ApiResponse<any>> {
    return await this.request<any>(`/dashboard/alerts${queryString ? `?${queryString}` : ""}`);
  }

  async getDashboardComparison(params: { period: string; year?: number } | string): Promise<ApiResponse<any>> {
    const query = typeof params === 'string'
      ? params
      : new URLSearchParams(Object.entries({ period: params.period, ...(params.year && { year: params.year.toString() }) }).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join('&'));
    return await this.request<any>(`/dashboard/comparison?${query}`);
  }

  // ============================================
  // Health Check
  // ============================================

  async healthCheck(): Promise<ApiResponse<any>> {
    return await this.request<any>("/api/health");
  }
}

export const apiClient = new ApiClient();
