import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
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
import { planningService } from "@/services/planningService";
import type { ProductionPlan } from "@/types/planning";
import {
  ProductionPlanStatus,
  productionPlanStatusColors,
} from "@/types/planning";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: ProductionPlanStatus.DRAFT, label: "Draft" },
  { value: ProductionPlanStatus.PENDING_APPROVAL, label: "Pending Approval" },
  { value: ProductionPlanStatus.APPROVED, label: "Approved" },
  { value: ProductionPlanStatus.IN_PROGRESS, label: "In Progress" },
  { value: ProductionPlanStatus.COMPLETED, label: "Completed" },
  { value: ProductionPlanStatus.CANCELLED, label: "Cancelled" },
];

export function PlanningListPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadPlans();
  }, [statusFilter, search]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await planningService.getPlans({
        status: statusFilter,
        search,
      });
      setPlans(data);
    } catch (error) {
      console.error("Failed to load plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: ProductionPlanStatus) => {
    switch (status) {
      case ProductionPlanStatus.DRAFT:
        return <Clock className="h-3.5 w-3.5" />;
      case ProductionPlanStatus.PENDING_APPROVAL:
        return <AlertCircle className="h-3.5 w-3.5" />;
      case ProductionPlanStatus.APPROVED:
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case ProductionPlanStatus.IN_PROGRESS:
        return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
      case ProductionPlanStatus.COMPLETED:
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case ProductionPlanStatus.CANCELLED:
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRowClick = (planId: string) => {
    navigate(`/planning/${planId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Production Planning</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola Production Plan dan Material Requirement
          </p>
        </div>
        <Button onClick={() => navigate("/planning/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-xl font-semibold text-slate-900">
                  {plans.filter(
                    (p) =>
                      p.status === ProductionPlanStatus.DRAFT ||
                      p.status === ProductionPlanStatus.PENDING_APPROVAL
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Approved</p>
                <p className="text-xl font-semibold text-slate-900">
                  {plans.filter((p) => p.status === ProductionPlanStatus.APPROVED).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Loader2 className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-xl font-semibold text-slate-900">
                  {plans.filter((p) => p.status === ProductionPlanStatus.IN_PROGRESS).length}
                </p>
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
                <p className="text-xl font-semibold text-slate-900">
                  {plans.filter((p) => p.status === ProductionPlanStatus.COMPLETED).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Plan Number or HO Order Ref..."
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
          ) : plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Calendar className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No production plans found</p>
              <p className="text-sm">Create your first plan to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Number</TableHead>
                  <TableHead>Plan Date</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>HO Order Ref</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow
                    key={plan.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleRowClick(plan.id)}
                  >
                    <TableCell className="font-medium">{plan.planNumber}</TableCell>
                    <TableCell>{formatDate(plan.planDate)}</TableCell>
                    <TableCell>{formatDate(plan.targetCompletionDate)}</TableCell>
                    <TableCell>{plan.hoOrderReference}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1.5 font-medium",
                          productionPlanStatusColors[plan.status].bg,
                          productionPlanStatusColors[plan.status].text,
                          productionPlanStatusColors[plan.status].border
                        )}
                      >
                        {getStatusIcon(plan.status)}
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}