import { useState } from "react";
import {
  Type,
  Palette,
  Square,
  List,
  ToggleLeft,
  FileText,
  Menu,
  X,
  Space,
  Circle,
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Warehouse,
  Factory,
  Truck,
  BookOpen,
  Grid,
  AppWindow,
  AlertCircle,
  Tag,
  Layers,
  MoreHorizontal,
  MessageSquare,
  PanelLeft,
  AlertTriangle,
  Loader2,
  Inbox,
  Smartphone,
  PieChart,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Introduction
import IntroductionPage from "./pages/IntroductionPage";

// Foundation Pages
import TypographyPage from "./pages/TypographyPage";
import ColorsPage from "./pages/ColorsPage";
import SpacingPage from "./pages/SpacingPage";
import BorderRadiusPage from "./pages/BorderRadiusPage";
import ElevationGridPage from "./pages/ElevationGridPage";

// Component Pages
import IconographyPage from "./pages/IconographyPage";
import ButtonsPage from "./pages/ButtonsPage";
import FormsPage from "./pages/FormsPage";
import CardsPage from "./pages/CardsPage";
import TablesPage from "./pages/TablesPage";
import ModalPage from "./pages/ModalPage";
import AlertPage from "./pages/AlertPage";
import BadgePage from "./pages/BadgePage";
import TabsPage from "./pages/TabsPage";
import PaginationPage from "./pages/PaginationPage";
import TooltipPage from "./pages/TooltipPage";
import NavigationPage from "./pages/NavigationPage";

// Patterns Pages
import ErrorStatePage from "./pages/ErrorStatePage";
import LoadingStatePage from "./pages/LoadingStatePage";
import EmptyStatePage from "./pages/EmptyStatePage";
import ResponsivePage from "./pages/ResponsivePage";

// Data Viz & Tokens Pages
import DataVizPage from "./pages/DataVizPage";
import TokensPage from "./pages/TokensPage";

// ERP Module Pages
import DashboardModulePage from "./pages/modules/DashboardModulePage";
import PlanningModulePage from "./pages/modules/PlanningModulePage";
import PurchasingModulePage from "./pages/modules/PurchasingModulePage";
import WarehousingModulePage from "./pages/modules/WarehousingModulePage";
import ProductionModulePage from "./pages/modules/ProductionModulePage";
import DeliveryModulePage from "./pages/modules/DeliveryModulePage";

type SectionType =
  | "introduction"
  | "iconography"
  | "typography"
  | "colors"
  | "spacing"
  | "border-radius"
  | "elevation-grid"
  | "buttons"
  | "forms"
  | "cards"
  | "tables"
  | "modal"
  | "alert"
  | "badge"
  | "tabs"
  | "pagination"
  | "tooltip"
  | "navigation"
  | "error-state"
  | "loading-state"
  | "empty-state"
  | "responsive"
  | "data-viz"
  | "tokens"
  | "dashboard-module"
  | "planning-module"
  | "purchasing-module"
  | "warehousing-module"
  | "production-module"
  | "delivery-module";

const introSections = [
  {
    id: "introduction" as SectionType,
    label: "Overview & Principles",
    icon: BookOpen,
    color: "text-blue-600",
  },
];

const foundations = [
  { id: "colors" as SectionType, label: "Colors", icon: Palette, color: "text-rose-500" },
  { id: "typography" as SectionType, label: "Typography", icon: Type, color: "text-orange-500" },
  { id: "spacing" as SectionType, label: "Spacing", icon: Space, color: "text-amber-500" },
  { id: "border-radius" as SectionType, label: "Border Radius", icon: Circle, color: "text-emerald-500" },
  {
    id: "elevation-grid" as SectionType,
    label: "Elevation & Grid",
    icon: Grid,
    color: "text-lime-500",
  },
];

const components = [
  { id: "iconography" as SectionType, label: "Iconography", icon: Palette, color: "text-fuchsia-600" },
  { id: "buttons" as SectionType, label: "Buttons", icon: ToggleLeft, color: "text-blue-500" },
  { id: "forms" as SectionType, label: "Input & Form", icon: FileText, color: "text-indigo-500" },
  { id: "tables" as SectionType, label: "Table", icon: List, color: "text-violet-500" },
  { id: "modal" as SectionType, label: "Modal", icon: AppWindow, color: "text-purple-500" },
  { id: "alert" as SectionType, label: "Alert", icon: AlertCircle, color: "text-rose-500" },
  { id: "badge" as SectionType, label: "Badge", icon: Tag, color: "text-pink-500" },
  { id: "cards" as SectionType, label: "Card", icon: Square, color: "text-fuchsia-600" },
  { id: "tabs" as SectionType, label: "Tabs", icon: Layers, color: "text-cyan-500" },
  {
    id: "pagination" as SectionType,
    label: "Pagination",
    icon: MoreHorizontal,
    color: "text-sky-500",
  },
  { id: "tooltip" as SectionType, label: "Tooltip", icon: MessageSquare, color: "text-blue-400" },
  { id: "navigation" as SectionType, label: "Navigation", icon: PanelLeft, color: "text-slate-500" },
];

const patterns = [
  {
    id: "error-state" as SectionType,
    label: "Error State",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  { id: "loading-state" as SectionType, label: "Loading State", icon: Loader2, color: "text-blue-500" },
  { id: "empty-state" as SectionType, label: "Empty State", icon: Inbox, color: "text-slate-400" },
  {
    id: "responsive" as SectionType,
    label: "Responsive Behavior",
    icon: Smartphone,
    color: "text-teal-500",
  },
];

const dataViz = [
  {
    id: "data-viz" as SectionType,
    label: "Data Visualization",
    icon: PieChart,
    color: "text-emerald-600",
  },
];

const tokens = [
  { id: "tokens" as SectionType, label: "Design Tokens", icon: Code, color: "text-yellow-600" },
];

const erpModules = [
  {
    id: "dashboard-module" as SectionType,
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "text-blue-600",
  },
  {
    id: "planning-module" as SectionType,
    label: "Planning",
    icon: ClipboardList,
    color: "text-orange-500",
  },
  {
    id: "purchasing-module" as SectionType,
    label: "Purchasing",
    icon: ShoppingCart,
    color: "text-amber-500",
  },
  {
    id: "warehousing-module" as SectionType,
    label: "Warehousing",
    icon: Warehouse,
    color: "text-green-600",
  },
  {
    id: "production-module" as SectionType,
    label: "Production",
    icon: Factory,
    color: "text-slate-700",
  },
  { id: "delivery-module" as SectionType, label: "Delivery", icon: Truck, color: "text-sky-600" },
];

const NavGroup = ({ title, items, activeSection, onNavigate }: { title: string; items: { id: SectionType; label: string; icon: React.ElementType; color?: string }[]; activeSection: SectionType; onNavigate: (id: SectionType) => void }) => (
  <div className="mb-4">
    <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
      {title}
    </p>
    {items.map((section) => {
      const Icon = section.icon;
      return (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            activeSection === section.id
              ? "bg-[#006600]/10 text-[#006600]"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
          )}
        >
          <Icon className={cn("h-5 w-5", activeSection === section.id ? "" : section.color)} />
          {section.label}
        </button>
      );
    })}
  </div>
);

function App() {
  const [activeSection, setActiveSection] =
    useState<SectionType>("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      // Intro
      case "introduction":
        return <IntroductionPage />;
      // Foundations
      case "colors":
        return <ColorsPage />;
      case "typography":
        return <TypographyPage />;
      case "spacing":
        return <SpacingPage />;
      case "border-radius":
        return <BorderRadiusPage />;
      case "elevation-grid":
        return <ElevationGridPage />;
      // Components
      case "iconography":
        return <IconographyPage />;
      case "buttons":
        return <ButtonsPage />;
      case "forms":
        return <FormsPage />;
      case "cards":
        return <CardsPage />;
      case "tables":
        return <TablesPage />;
      case "modal":
        return <ModalPage />;
      case "alert":
        return <AlertPage />;
      case "badge":
        return <BadgePage />;
      case "tabs":
        return <TabsPage />;
      case "pagination":
        return <PaginationPage />;
      case "tooltip":
        return <TooltipPage />;
      case "navigation":
        return <NavigationPage />;
      // Patterns
      case "error-state":
        return <ErrorStatePage />;
      case "loading-state":
        return <LoadingStatePage />;
      case "empty-state":
        return <EmptyStatePage />;
      case "responsive":
        return <ResponsivePage />;
      // Data Viz & Tokens
      case "data-viz":
        return <DataVizPage />;
      case "tokens":
        return <TokensPage />;
      // ERP Modules
      case "dashboard-module":
        return <DashboardModulePage />;
      case "planning-module":
        return <PlanningModulePage />;
      case "purchasing-module":
        return <PurchasingModulePage />;
      case "warehousing-module":
        return <WarehousingModulePage />;
      case "production-module":
        return <ProductionModulePage />;
      case "delivery-module":
        return <DeliveryModulePage />;
      default:
        return <IntroductionPage />;
    }
  };


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-apexferro.png" alt="Apex Ferro Logo" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-slate-800">
              Apex Ferro Design System
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 overflow-y-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Logo */}
          <div className="h-16 px-6 flex items-center border-b border-slate-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <img src="/logo-apexferro.png" alt="Apex Ferro Logo" className="w-10 h-10 object-contain shadow-sm" />
              <div>
                <h1 className="font-bold text-slate-800">Apex Ferro</h1>
                <p className="text-xs text-slate-500">Design System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <NavGroup title="Introduction" items={introSections} activeSection={activeSection} onNavigate={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
            <NavGroup title="Foundations" items={foundations} activeSection={activeSection} onNavigate={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
            <NavGroup title="Components" items={components} activeSection={activeSection} onNavigate={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
            <NavGroup title="Patterns" items={patterns} activeSection={activeSection} onNavigate={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
            <NavGroup title="Data Visualization" items={dataViz} activeSection={activeSection} onNavigate={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
            <NavGroup title="Implementation" items={tokens} activeSection={activeSection} onNavigate={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
            <NavGroup title="ERP Modules" items={erpModules} activeSection={activeSection} onNavigate={(id) => { setActiveSection(id); setSidebarOpen(false); }} />
          </nav>

          {/* Footer */}
          <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
            <p className="text-xs text-slate-400 text-center">Version 1.0.0</p>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:min-h-0">
          <div className="max-w-5xl mx-auto px-6 py-8 lg:py-12">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
