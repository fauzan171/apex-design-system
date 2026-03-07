import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
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

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/planning" element={<PlanningListPage />} />
          <Route path="/planning/create" element={<PlanningFormPage />} />
          <Route path="/planning/:id" element={<PlanningDetailPage />} />
          <Route path="/planning/:id/edit" element={<PlanningFormPage />} />
          <Route path="/purchasing" element={<PurchasingListPage />} />
          <Route path="/purchasing/create" element={<PurchasingFormPage />} />
          <Route path="/purchasing/:id" element={<PurchasingDetailPage />} />
          <Route path="/purchasing/:id/edit" element={<PurchasingFormPage />} />
          <Route path="/warehouse" element={<div className="p-8 text-slate-500">Warehouse Module - Coming Soon</div>} />
          <Route path="/production" element={<WorkOrderListPage />} />
          <Route path="/production/create" element={<WorkOrderFormPage />} />
          <Route path="/production/:id" element={<WorkOrderDetailPage />} />
          <Route path="/production/:id/edit" element={<WorkOrderFormPage />} />
          <Route path="/delivery" element={<DeliveryListPage />} />
          <Route path="/delivery/create" element={<DeliveryFormPage />} />
          <Route path="/delivery/:id" element={<DeliveryDetailPage />} />
          <Route path="/delivery/:id/edit" element={<DeliveryFormPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
