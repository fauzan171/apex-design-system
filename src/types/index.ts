// Types for Dashboard Data

export type DateRange = "today" | "week" | "month" | "quarter" | "custom";

export interface DailyData {
  name: string;
  value: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface AgingData {
  name: string;
  value: number;
}

export interface Project {
  id: string;
  name: string;
  progress: number;
  stage: "Planning" | "Production" | "QC" | "Delivery" | "Delivered";
  eta: number;
}

export interface Alert {
  type: "low-stock" | "delayed-wo" | "aging-pr" | "bast";
  message: string;
  severity: "high" | "medium" | "low";
}

export interface ComparisonData {
  name: string;
  current: number;
  previous: number;
}

export interface ProductionKPIs {
  efficiency: number;
  efficiencyTrend: number;
  onTimeRate: number;
  onTimeTrend: number;
  qcPassRate: number;
  qcTrend: number;
  totalWOs: number;
  dailyTrend: DailyData[];
  statusBreakdown: StatusData[];
}

export interface DeliveryKPIs {
  onTimeRate: number;
  onTimeTrend: number;
  avgLeadTime: number;
  leadTimeTrend: number;
  bastCompletion: number;
  totalDOs: number;
  dailyTrend: DailyData[];
  statusBreakdown: StatusData[];
}

export interface InventoryKPIs {
  stockValue: number;
  stockValueFormatted: string;
  stockTrend: number;
  lowStockCount: number;
  byCategory: CategoryData[];
  aging: AgingData[];
}

export interface PurchasingKPIs {
  avgProcessingTime: number;
  processingTrend: number;
  approvalRate: number;
  approvalTrend: number;
  statusBreakdown: StatusData[];
  aging: AgingData[];
}

export interface DashboardData {
  production: ProductionKPIs;
  delivery: DeliveryKPIs;
  inventory: InventoryKPIs;
  purchasing: PurchasingKPIs;
  projects: Project[];
  alerts: Alert[];
  comparison: ComparisonData[];
  lastUpdated: Date;
}