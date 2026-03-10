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
  Users,
  Shield,
  Package,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/contexts/AuthContext";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const canManageUsers = usePermission("user_management:view");
  const canManageMasterData = usePermission("master_data:view");

  const isActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/") return true;
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: ClipboardList, label: "Planning", href: "/planning" },
    { icon: ShoppingCart, label: "Purchasing", href: "/purchasing" },
    { icon: Warehouse, label: "Warehouse", href: "/warehouse" },
    { icon: Factory, label: "Production", href: "/production" },
    { icon: Truck, label: "Delivery", href: "/delivery" },
  ];

  // Admin menu items - only show if user has permission
  const adminMenuItems = canManageUsers
    ? [
        { icon: Users, label: "Users", href: "/users" },
        { icon: Shield, label: "Roles", href: "/roles" },
      ]
    : [];

  // Master Data menu items
  const masterDataItems = canManageMasterData
    ? [{ icon: Package, label: "Products", href: "/products" }]
    : [];

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

        {/* Master Data Section */}
        {masterDataItems.length > 0 && !collapsed && (
          <div className="pt-4 mt-4 border-t border-slate-200">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Master Data
            </p>
          </div>
        )}
        {masterDataItems.length > 0 && collapsed && (
          <div className="pt-4 mt-4 border-t border-slate-200"></div>
        )}
        {masterDataItems.map((item) => {
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

        {/* Admin Section */}
        {adminMenuItems.length > 0 && !collapsed && (
          <div className="pt-4 mt-4 border-t border-slate-200">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Administration
            </p>
          </div>
        )}
        {adminMenuItems.length > 0 && collapsed && (
          <div className="pt-4 mt-4 border-t border-slate-200"></div>
        )}
        {adminMenuItems.map((item) => {
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

      {/* User Info & Logout */}
      <div className="p-3 border-t border-slate-200 space-y-1">
        {/* User Profile */}
        {user && !collapsed && (
          <div className="px-3 py-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#006600]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-[#006600]">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}
        {user && collapsed && (
          <div className="flex justify-center py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#006600]/10 flex items-center justify-center">
              <span className="text-sm font-medium text-[#006600]">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Settings */}
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-[#006600]/10 text-[#006600]"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
