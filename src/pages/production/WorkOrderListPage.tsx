import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ClipboardCheck,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProductionOrders, useWOStatusSummary, useProductionMetrics } from "@/hooks";
import type { WorkOrder, WOStatusType } from "@/types/production";
import { WOStatus, woStatusColors } from "@/types/production";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: WOStatus.DRAFT, label: "Draft" },
  { value: WOStatus.RELEASED, label: "Released" },
  { value: WOStatus.IN_PROGRESS, label: "In Progress" },
  { value: WOStatus.QC, label: "QC" },
  { value: WOStatus.COMPLETED, label: "Completed" },
  { value: WOStatus.CANCELLED, label: "Cancelled" },
];

// Status icons mapping
const statusIcons: Partial<Record<WOStatus, React.ReactNode>> = {
  [WOStatus.DRAFT]: <Clock className="h-3.5 w-3.5" />,
  [WOStatus.NOT_STARTED]: <Clock className="h-3.5 w-3.5" />,
  [WOStatus.RELEASED]: <PlayCircle className="h-3.5 w-3.5" />,
  [WOStatus.IN_PROGRESS]: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  [WOStatus.MARKED_QC]: <ClipboardCheck className="h-3.5 w-3.5" />,
  [WOStatus.QC]: <ClipboardCheck className="h-3.5 w-3.5" />,
  [WOStatus.QC_IN_PROGRESS]: <ClipboardCheck className="h-3.5 w-3.5" />,
  [WOStatus.QC_PASSED]: <CheckCircle2 className="h-3.5 w-3.5" />,
  [WOStatus.QC_FAILED]: <XCircle className="h-3.5 w-3.5" />,
  [WOStatus.COMPLETED]: <CheckCircle2 className="h-3.5 w-3.5" />,
  [WOStatus.CANCELLED]: <XCircle className="h-3.5 w-3.5" />,
};

export function WorkOrderListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Build filters for hooks
  const filters = useMemo(() => {
    if (statusFilter === "all" && !search) return undefined;
    return {
      status: statusFilter !== "all" ? statusFilter as WOStatusType : undefined,
      search: search || undefined,
    };
  }, [statusFilter, search]);

  // Use custom hooks for data fetching
  const {
    data: wos = [],
    isLoading: loading,
    isFetching,
    refetch: refetchWOs,
  } = useProductionOrders({
    filters,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const {
    data: statusSummaryData,
    refetch: refetchSummary,
  } = useWOStatusSummary({ refetchInterval: 60000 });

  const {
    data: metrics,
    refetch: refetchMetrics,
  } = useProductionMetrics();

  // Use status summary array directly
  const statusSummary = useMemo(() => {
    if (!statusSummaryData) return [];
    return statusSummaryData.filter((item) => item.count > 0);
  }, [statusSummaryData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetchWOs();
    refetchSummary();
    refetchMetrics();
  }, [refetchWOs, refetchSummary, refetchMetrics]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate progress
  const calculateProgress = useCallback((wo: WorkOrder): number => {
    if (!wo.steps || wo.steps.length === 0) return 0;

    const completedSteps = wo.steps.filter(
      (step) => step.status === "completed"
    ).length;
    const inProgressSteps = wo.steps.filter(
      (step) => step.status === "in_progress"
    ).length;

    return Math.round(
      ((completedSteps + inProgressSteps * 0.5) / wo.steps.length) * 100
    );
  }, []);

  // Days remaining
  const getDaysRemaining = (targetDate: string): number => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage production work orders, track progress, and QC
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={() => navigate("/production/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create WO
          </Button>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <ClipboardCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total WOs</p>
                  <p className="text-xl font-semibold text-slate-900">{metrics.totalWOs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Loader2 className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">In Progress</p>
                  <p className="text-xl font-semibold text-slate-900">{metrics.inProgressWOs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">QC Pending</p>
                  <p className="text-xl font-semibold text-slate-900">{metrics.inProgressWOs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="text-xl font-semibold text-slate-900">{metrics.completedWOs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-100">
                  <Clock className="h-4 w-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">On-Time Rate</p>
                  <p className="text-xl font-semibold text-slate-900">{metrics.onTimeRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">QC Pass Rate</p>
                  <p className="text-xl font-semibold text-slate-900">{metrics.qcPassRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {statusSummary.map((item) => (
          <Card
            key={item.status}
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow",
              statusFilter === item.status && "ring-2 ring-blue-500"
            )}
            onClick={() =>
              setStatusFilter(item.status === statusFilter ? "all" : item.status)
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "p-1.5 rounded",
                    woStatusColors[item.status]?.bg
                  )}
                >
                  {statusIcons[item.status]}
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">{item.count}</div>
                  <div className="text-xs text-slate-500 truncate">{item.status}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by WO number or product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : wos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <ClipboardCheck className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No work orders found</p>
              <p className="text-sm">Create your first work order to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>WO Number</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wos.map((wo) => {
                  const progress = calculateProgress(wo);
                  const daysRemaining = wo.targetDate ? getDaysRemaining(wo.targetDate) : 0;
                  const isOverdue = daysRemaining < 0 && wo.status !== WOStatus.COMPLETED && wo.status !== WOStatus.CANCELLED;

                  return (
                    <TableRow
                      key={wo.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => navigate(`/production/${wo.id}`)}
                    >
                      <TableCell className="font-medium">
                        {wo.woNumber}
                        <div className="text-xs text-slate-500">
                          {wo.planNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{wo.productName}</div>
                        <div className="text-xs text-slate-500">{wo.productCode}</div>
                      </TableCell>
                      <TableCell>{wo.quantity}</TableCell>
                      <TableCell>
                        {wo.targetDate ? (
                          <>
                            <div className={cn("flex items-center gap-1", isOverdue && "text-red-600")}>
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(wo.targetDate)}
                            </div>
                            {!isOverdue && daysRemaining >= 0 && daysRemaining <= 3 && wo.status !== WOStatus.COMPLETED && (
                              <div className="text-xs text-amber-600">
                                {daysRemaining} days left
                              </div>
                            )}
                            {isOverdue && (
                              <div className="text-xs text-red-600 font-medium">
                                {Math.abs(daysRemaining)} days overdue
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-slate-500 mt-1">{progress}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1.5 font-medium",
                            woStatusColors[wo.status ?? "draft"]?.bg,
                            woStatusColors[wo.status ?? "draft"]?.text,
                            woStatusColors[wo.status ?? "draft"]?.border
                          )}
                        >
                          {statusIcons[wo.status ?? WOStatus.DRAFT]}
                          {wo.status ?? "draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/production/${wo.id}`);
                          }}
                        >
                          View
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}