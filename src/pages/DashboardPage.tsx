import { useState } from "react";
import { Calendar, Filter, RefreshCw, Clock } from "lucide-react";
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
import { mockDashboardData, projectOptions, dateRangeOptions } from "@/data/mockData";
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
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitoring KPIs, Analytics, dan Project Tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[160px] bg-white">
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
            <SelectTrigger className="w-[180px] bg-white">
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
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 20h20M5 20V8l7-4 7 4v12M9 20v-6h6v6" />
            </svg>
          )}
          iconColor="text-amber-600"
          bgColor="bg-amber-100"
        />
        <KPICard
          title="On-Time Delivery"
          value={`${delivery.onTimeRate}%`}
          trend={delivery.onTimeTrend}
          trendLabel="vs last period"
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          )}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <KPICard
          title="Low Stock Alert"
          value={`${inventory.lowStockCount} Items`}
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          )}
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
        />
        <KPICard
          title="Avg PR Processing"
          value={`${purchasing.avgProcessingTime} Days`}
          trend={Math.abs(purchasing.processingTrend)}
          trendLabel="vs last period"
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          )}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
        />
        <KPICard
          title="Active Alerts"
          value={alerts.length}
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          iconColor="text-red-600"
          bgColor="bg-red-100"
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
      <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t">
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