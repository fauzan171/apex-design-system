import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, Boxes, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WarehouseOverviewPage } from "./OverviewPage";
import { InventoryPage } from "./InventoryPage";
import { ReceivingPage } from "./ReceivingPage";

type Tab = "overview" | "inventory" | "receiving";

const tabConfig = [
  { id: "overview" as Tab, label: "Overview", icon: Package },
  { id: "inventory" as Tab, label: "Inventory", icon: Boxes },
  { id: "receiving" as Tab, label: "Receiving", icon: Download },
];

export function WarehousePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const path = location.pathname;
    if (path.includes("/inventory")) return "inventory";
    if (path.includes("/receiving")) return "receiving";
    return "overview";
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    navigate(`/warehouse/${tab}`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? "border-[#006600] text-[#006600]"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <WarehouseOverviewPage />}
        {activeTab === "inventory" && <InventoryPage />}
        {activeTab === "receiving" && <ReceivingPage />}
      </div>
    </div>
  );
}
