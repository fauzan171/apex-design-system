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
import { dashboardService, projectOptions, dateRangeOptions } from "@/services/dashboardService";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>("week");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ["dashboard", dateRange, selectedProject],
    queryFn: () => dashboardService.getDashboardData(dateRange, selectedProject),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
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

  const production = dashboardData?.production ?? {
    efficiency: 0,
    efficiencyTrend: 0,
    onTimeRate: 0,
    onTimeTrend: 0,
    qcPassRate: 0,
    qcTrend: 0,
    totalWOs: 0,
    dailyTrend: [],
    statusBreakdown: [],
  };
  const delivery = dashboardData?.delivery ?? {
    onTimeRate: 0,
    onTimeTrend: 0,
    avgLeadTime: 0,
    leadTimeTrend: 0,
    bastCompletion: 0,
    totalDOs: 0,
    dailyTrend: [],
    statusBreakdown: [],
  };
  const inventory = dashboardData?.inventory ?? {
    stockValue: 0,
    stockValueFormatted: "Rp 0",
    stockTrend: 0,
    lowStockCount: 0,
    byCategory: [],
    aging: [],
  };
  const purchasing = dashboardData?.purchasing ?? {
    avgProcessingTime: 0,
    processingTrend: 0,
    approvalRate: 0,
    approvalTrend: 0,
    statusBreakdown: [],
    aging: [],
  };
  const projects = dashboardData?.projects ?? [];
  const alerts = dashboardData?.alerts ?? [];
  const comparison = dashboardData?.comparison ?? [];
  const lastUpdated = dashboardData?.lastUpdated ?? new Date();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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