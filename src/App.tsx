import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ChangePasswordPage } from "@/pages/auth/ChangePasswordPage";
import { PlanningListPage } from "@/pages/planning/PlanningListPage";
import { PlanningDetailPage } from "@/pages/planning/PlanningDetailPage";
import { PlanningFormPage } from "@/pages/planning/PlanningFormPage";
import { PurchasingListPage } from "@/pages/purchasing/PurchasingListPage";
import { PurchasingDetailPage } from "@/pages/purchasing/PurchasingDetailPage";
import { PurchasingFormPage } from "@/pages/purchasing/PurchasingFormPage";
import { DeliveryListPage } from "@/pages/delivery/DeliveryListPage";
import { DeliveryDetailPage } from "@/pages/delivery/DeliveryDetailPage";
import { DeliveryFormPage } from "@/pages/delivery/DeliveryFormPage";
import { WorkOrderListPage } from "@/pages/production/WorkOrderListPage";
import { WorkOrderDetailPage } from "@/pages/production/WorkOrderDetailPage";
import { WorkOrderFormPage } from "@/pages/production/WorkOrderFormPage";
import { UserListPage } from "@/pages/users/UserListPage";
import { UserFormPage } from "@/pages/users/UserFormPage";
import { RolesListPage } from "@/pages/users/RolesListPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { ProductListPage } from "@/pages/masterData/ProductListPage";
import { ProductFormPage } from "@/pages/masterData/ProductFormPage";
import { BoMListPage } from "@/pages/masterData/BoMListPage";
import { BoMFormPage } from "@/pages/masterData/BoMFormPage";
import { WarehouseListPage } from "@/pages/warehouse/WarehouseListPage";
import { GoodsReceiptFormPage } from "@/pages/warehouse/GoodsReceiptFormPage";
import { GoodsIssueFormPage } from "@/pages/warehouse/GoodsIssueFormPage";
import { DeliveryOrderFormPage } from "@/pages/warehouse/DeliveryOrderFormPage";
import { StockAlertsPage } from "@/pages/warehouse/StockAlertsPage";
// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006600]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs to change password
  if (user?.forceChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006600]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.forceChangePassword) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Main Application Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Planning Module */}
        <Route path="planning" element={<PlanningListPage />} />
        <Route path="planning/create" element={<PlanningFormPage />} />
        <Route path="planning/:id" element={<PlanningDetailPage />} />
        <Route path="planning/:id/edit" element={<PlanningFormPage />} />

        {/* Purchasing Module */}
        <Route path="purchasing" element={<PurchasingListPage />} />
        <Route path="purchasing/create" element={<PurchasingFormPage />} />
        <Route path="purchasing/:id" element={<PurchasingDetailPage />} />
        <Route path="purchasing/:id/edit" element={<PurchasingFormPage />} />

        {/* Production Module */}
        <Route path="production" element={<WorkOrderListPage />} />
        <Route path="production/create" element={<WorkOrderFormPage />} />
        <Route path="production/:id" element={<WorkOrderDetailPage />} />
        <Route path="production/:id/edit" element={<WorkOrderFormPage />} />

        {/* Delivery Module */}
        <Route path="delivery" element={<DeliveryListPage />} />
        <Route path="delivery/create" element={<DeliveryFormPage />} />
        <Route path="delivery/:id" element={<DeliveryDetailPage />} />
        <Route path="delivery/:id/edit" element={<DeliveryFormPage />} />

        {/* Warehouse Module */}
        <Route path="warehouse" element={<WarehouseListPage />} />
        <Route path="warehouse/gr/create" element={<GoodsReceiptFormPage />} />
        <Route path="warehouse/gr/:id" element={<GoodsReceiptFormPage />} />
        <Route path="warehouse/gr/:id/edit" element={<GoodsReceiptFormPage />} />
        <Route path="warehouse/gi/create" element={<GoodsIssueFormPage />} />
        <Route path="warehouse/gi/:id" element={<GoodsIssueFormPage />} />
        <Route path="warehouse/gi/:id/edit" element={<GoodsIssueFormPage />} />
        <Route path="warehouse/do/create" element={<DeliveryOrderFormPage />} />
        <Route path="warehouse/do/:id" element={<DeliveryOrderFormPage />} />
        <Route path="warehouse/do/:id/edit" element={<DeliveryOrderFormPage />} />
        <Route path="warehouse/stock-alerts" element={<StockAlertsPage />} />

        {/* User Management Module */}
        <Route path="users" element={<UserListPage />} />
        <Route path="users/create" element={<UserFormPage />} />
        <Route path="users/:id/edit" element={<UserFormPage />} />
        <Route path="roles" element={<RolesListPage />} />

        {/* Settings */}
        <Route path="settings" element={<SettingsPage />} />

        {/* Master Data Module */}
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/create" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="products/:productId/bom" element={<BoMListPage />} />
        <Route path="products/:productId/bom/create" element={<BoMFormPage />} />
        <Route path="products/:productId/bom/:id/edit" element={<BoMFormPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
