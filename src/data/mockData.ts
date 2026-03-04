import type { DashboardData } from "@/types";

export const mockDashboardData: DashboardData = {
  production: {
    efficiency: 85,
    efficiencyTrend: 5,
    onTimeRate: 88,
    onTimeTrend: 3,
    qcPassRate: 95,
    qcTrend: 2,
    totalWOs: 100,
    dailyTrend: [
      { name: "Sen", value: 85 },
      { name: "Sel", value: 88 },
      { name: "Rab", value: 82 },
      { name: "Kam", value: 90 },
      { name: "Jum", value: 87 },
      { name: "Sab", value: 85 },
      { name: "Min", value: 89 },
    ],
    statusBreakdown: [
      { name: "Completed", value: 45, color: "#10B981" },
      { name: "In Progress", value: 30, color: "#3B82F6" },
      { name: "Pending", value: 15, color: "#F59E0B" },
      { name: "Delayed", value: 10, color: "#EF4444" },
    ],
  },
  delivery: {
    onTimeRate: 92,
    onTimeTrend: -2,
    avgLeadTime: 3.2,
    leadTimeTrend: -0.5,
    bastCompletion: 88,
    totalDOs: 85,
    dailyTrend: [
      { name: "Sen", value: 12 },
      { name: "Sel", value: 15 },
      { name: "Rab", value: 18 },
      { name: "Kam", value: 14 },
      { name: "Jum", value: 20 },
      { name: "Sab", value: 16 },
      { name: "Min", value: 8 },
    ],
    statusBreakdown: [
      { name: "Delivered", value: 65, color: "#10B981" },
      { name: "In Transit", value: 25, color: "#3B82F6" },
      { name: "Pending", value: 10, color: "#F59E0B" },
    ],
  },
  inventory: {
    stockValue: 2500000000,
    stockValueFormatted: "Rp 2.5B",
    stockTrend: 8,
    lowStockCount: 5,
    byCategory: [
      { name: "Raw Material", value: 45 },
      { name: "Finished Goods", value: 35 },
      { name: "Consumable", value: 20 },
    ],
    aging: [
      { name: "0-30 days", value: 60 },
      { name: "31-60 days", value: 25 },
      { name: "61-90 days", value: 10 },
      { name: "90+ days", value: 5 },
    ],
  },
  purchasing: {
    avgProcessingTime: 2.5,
    processingTrend: -0.5,
    approvalRate: 90,
    approvalTrend: 2,
    statusBreakdown: [
      { name: "Approved", value: 55, color: "#10B981" },
      { name: "Pending", value: 30, color: "#F59E0B" },
      { name: "Rejected", value: 10, color: "#EF4444" },
      { name: "Draft", value: 5, color: "#64748B" },
    ],
    aging: [
      { name: "0-3 days", value: 40 },
      { name: "4-7 days", value: 30 },
      { name: "8-14 days", value: 20 },
      { name: "14+ days", value: 10 },
    ],
  },
  projects: [
    { id: "PLAN-001", name: "Project Alpha", progress: 75, stage: "Production", eta: 5 },
    { id: "PLAN-002", name: "Project Beta", progress: 45, stage: "Production", eta: 12 },
    { id: "PLAN-003", name: "Project Gamma", progress: 90, stage: "QC", eta: 3 },
    { id: "PLAN-004", name: "Project Delta", progress: 30, stage: "Planning", eta: 20 },
    { id: "PLAN-005", name: "Project Epsilon", progress: 100, stage: "Delivered", eta: 0 },
  ],
  alerts: [
    { type: "low-stock", message: "5 items below safety stock", severity: "high" },
    { type: "delayed-wo", message: "3 Work Orders delayed", severity: "medium" },
    { type: "aging-pr", message: "2 PRs pending > 14 days", severity: "medium" },
    { type: "bast", message: "3 DO without BAST", severity: "low" },
  ],
  comparison: [
    { name: "Production Efficiency", current: 85, previous: 80 },
    { name: "On-Time Delivery", current: 92, previous: 94 },
    { name: "QC Pass Rate", current: 95, previous: 92 },
    { name: "PR Approval Rate", current: 90, previous: 88 },
  ],
  lastUpdated: new Date(),
};

export const projectOptions = [
  { value: "all", label: "All Projects" },
  { value: "PLAN-001", label: "Project Alpha" },
  { value: "PLAN-002", label: "Project Beta" },
  { value: "PLAN-003", label: "Project Gamma" },
  { value: "PLAN-004", label: "Project Delta" },
  { value: "PLAN-005", label: "Project Epsilon" },
];

export const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "custom", label: "Custom Range" },
];