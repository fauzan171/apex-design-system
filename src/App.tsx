import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PlanningListPage } from "@/pages/planning/PlanningListPage";
import { PlanningDetailPage } from "@/pages/planning/PlanningDetailPage";
import { PlanningFormPage } from "@/pages/planning/PlanningFormPage";
import { PurchasingListPage } from "@/pages/purchasing/PurchasingListPage";
import { PurchasingDetailPage } from "@/pages/purchasing/PurchasingDetailPage";
import { PurchasingFormPage } from "@/pages/purchasing/PurchasingFormPage";

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
          <Route path="/production" element={<div className="p-8 text-slate-500">Production Module - Coming Soon</div>} />
          <Route path="/delivery" element={<div className="p-8 text-slate-500">Delivery Module - Coming Soon</div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;