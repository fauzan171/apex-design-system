import { useState } from "react";
import {
  Calendar,
  Filter,
  RefreshCw,
  Clock,
  Factory,
  Truck,
  Package,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KPICard } from "@/components/dashboard/KPICard";
import { ProjectTracking } from "@/components/dashboard/ProjectTracking";
import { ProductionKPIsCard } from "@/components/dashboard/ProductionKPIs";
import { DeliveryKPIsCard } from "@/components/dashboard/DeliveryKPIs";
import { InventoryKPIsCard } from "@/components/dashboard/InventoryKPIs";
import { PurchasingKPIsCard } from "@/components/dashboard/PurchasingKPIs";
import { AlertsSummary } from "@/components/dashboard/AlertsSummary";
import { PeriodComparison } from "@/components/dashboard/PeriodComparison";
import { mockDashboardData, projectOptions, dateRangeOptions } from "@/services/dashboardService";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/types";

export function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>("week");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [lastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { production, delivery, inventory, purchasing, projects, alerts, comparison } = mockDashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoring KPIs, Analytics, dan Project Tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[160px] bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px] bg-background">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              {projectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Production Efficiency"
          value={`${production.efficiency}%`}
          trend={production.efficiencyTrend}
          trendLabel="vs last period"
          icon={Factory}
          color="warning"
        />
        <KPICard
          title="On-Time Delivery"
          value={`${delivery.onTimeRate}%`}
          trend={delivery.onTimeTrend}
          trendLabel="vs last period"
          icon={Truck}
          color="info"
        />
        <KPICard
          title="Low Stock Alert"
          value={`${inventory.lowStockCount} Items`}
          icon={Package}
          color="secondary"
        />
        <KPICard
          title="Avg PR Processing"
          value={`${purchasing.avgProcessingTime} Days`}
          trend={Math.abs(purchasing.processingTrend)}
          trendLabel="vs last period"
          icon={ShoppingCart}
          color="primary"
        />
        <KPICard
          title="Active Alerts"
          value={alerts.length}
          icon={AlertCircle}
          color="destructive"
        />
      </div>

      {/* Project Tracking */}
      <ProjectTracking projects={projects} />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionKPIsCard data={production} />
        <DeliveryKPIsCard data={delivery} />
        <InventoryKPIsCard data={inventory} />
        <PurchasingKPIsCard data={purchasing} />
      </div>

      {/* Alerts & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsSummary alerts={alerts} />
        <PeriodComparison data={comparison} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Last Updated: {formatLastUpdated(lastUpdated)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          Refresh Data
        </Button>
      </div>
    </div>
  );
}