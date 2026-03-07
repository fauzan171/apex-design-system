import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PlanningListPage } from "@/pages/planning/PlanningListPage";
import { PlanningDetailPage } from "@/pages/planning/PlanningDetailPage";
import { PlanningFormPage } from "@/pages/planning/PlanningFormPage";
import { DeliveryListPage } from "@/pages/delivery/DeliveryListPage";
import { DeliveryDetailPage } from "@/pages/delivery/DeliveryDetailPage";
import { DeliveryFormPage } from "@/pages/delivery/DeliveryFormPage";

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
          <Route path="/purchasing" element={<div className="p-8 text-slate-500">Purchasing Module - Coming Soon</div>} />
          <Route path="/warehouse" element={<div className="p-8 text-slate-500">Warehouse Module - Coming Soon</div>} />
          <Route path="/production" element={<div className="p-8 text-slate-500">Production Module - Coming Soon</div>} />
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