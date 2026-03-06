import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Warehouse,
  Factory,
  Truck,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ClipboardList, label: "Planning", href: "/planning" },
  { icon: ShoppingCart, label: "Purchasing", href: "/purchasing" },
  { icon: Warehouse, label: "Warehouse", href: "/warehouse" },
  { icon: Factory, label: "Production", href: "/production" },
  { icon: Truck, label: "Delivery", href: "/delivery" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/") return true;
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 px-4 flex items-center border-b border-slate-200">
        {!collapsed ? (
          <>
            <Link to="/" className="flex items-center gap-3 flex-1">
              <img
                src="/logo-apexferro.png"
                alt="Apex Ferro"
                className="w-8 h-8 object-contain rounded-lg"
              />
              <div>
                <h1 className="font-bold text-slate-800 text-sm">Apex Ferro</h1>
                <p className="text-xs text-slate-500">ERP System</p>
              </div>
            </Link>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-slate-400" />
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors mx-auto"
          >
            <img
              src="/logo-apexferro.png"
              alt="Apex Ferro"
              className="w-8 h-8 object-contain rounded-lg"
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[#006600]/10 text-[#006600]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="p-3 border-t border-slate-200 space-y-1">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}