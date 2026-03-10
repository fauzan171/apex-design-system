import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { usePurchaseRequests, usePRStatusSummary } from "@/hooks";
import type { PRFilters, PRStatusType } from "@/types/purchasing";
import { PRStatus, prStatusColors } from "@/types/purchasing";
import { cn } from "@/lib/utils";

// Status to icon mapping
const statusIcons: Partial<Record<PRStatus, React.ReactNode>> = {
  [PRStatus.DRAFT]: <FileText className="h-4 w-4" />,
  [PRStatus.SUBMITTED]: <Clock className="h-4 w-4" />,
  [PRStatus.APPROVED]: <CheckCircle className="h-4 w-4" />,
  [PRStatus.REJECTED]: <XCircle className="h-4 w-4" />,
  [PRStatus.PROCESSING]: <TrendingUp className="h-4 w-4" />,
  [PRStatus.DO_ISSUED]: <Truck className="h-4 w-4" />,
  [PRStatus.RESUBMITTED]: <RefreshCw className="h-4 w-4" />,
  [PRStatus.CANCELLED]: <XCircle className="h-4 w-4" />,
};

export function PurchasingListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Build filters object for hooks
  const filters: PRFilters | undefined = useMemo(() => {
    if (statusFilter === "all" && !dateFrom && !dateTo && !search) return undefined;
    return {
      status: statusFilter !== "all" ? statusFilter as PRStatusType : undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      search: search || undefined,
    };
  }, [statusFilter, dateFrom, dateTo, search]);

  // Use custom hooks for data fetching
  const {
    data: prs = [],
    isLoading: loading,
    isFetching,
    refetch,
  } = usePurchaseRequests({
    filters,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute auto-refresh
  });

  const { data: statusSummaryData, refetch: refetchSummary } = usePRStatusSummary();

  // Use status summary array directly
  const statusSummary = useMemo(() => {
    if (!statusSummaryData) return [];
    return statusSummaryData;
  }, [statusSummaryData]);

  // Handle search
  const handleSearch = useCallback(() => {
    setSearch(searchInput);
  }, [searchInput]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
    refetchSummary();
  }, [refetch, refetchSummary]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate age
  const calculateAge = (createdAt: string): number => {
    const now = new Date();
    const created = new Date(createdAt);
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Age color
  const getAgeColor = (age: number): string => {
    if (age <= 3) return "text-green-600";
    if (age <= 7) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase Request</h1>
          <p className="text-sm text-slate-500">
            Manage purchase requests and track HO deliveries
          </p>
        </div>
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
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {statusSummary.map((item) => (
          <Card
            key={item.status}
            className={cn(
              "cursor-pointer hover:shadow-md transition-shadow",
              statusFilter === item.status && "ring-2 ring-blue-500"
            )}
            onClick={() => setStatusFilter(item.status === statusFilter ? "all" : item.status)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "p-1.5 rounded",
                    prStatusColors[item.status]?.bg
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

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by PR number or Plan number..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={PRStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={PRStatus.SUBMITTED}>Submitted</SelectItem>
                    <SelectItem value={PRStatus.APPROVED}>Approved</SelectItem>
                    <SelectItem value={PRStatus.REJECTED}>Rejected</SelectItem>
                    <SelectItem value={PRStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={PRStatus.DO_ISSUED}>DO Issued</SelectItem>
                    <SelectItem value={PRStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Date From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Date To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PR List Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : prs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No purchase requests found</p>
              <p className="text-sm">PRs are created from Planning Module</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PR Number</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Required Date</TableHead>
                  <TableHead>Source Plan</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prs.map((pr) => {
                  const age = calculateAge(pr.createdAt ?? "");
                  return (
                    <TableRow
                      key={pr.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => navigate(`/purchasing/${pr.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium text-slate-900">{pr.prNumber ?? "-"}</div>
                        {pr.notes && (
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">
                            {pr.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {formatDate(pr.requestDate ?? pr.createdAt ?? "")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {formatDate(pr.requiredDate ?? pr.required_date ?? "")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pr.sourcePlanNumber ? (
                          <span className="text-blue-600 hover:underline">
                            {pr.sourcePlanNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span>{pr.items?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1.5",
                            prStatusColors[pr.status]?.bg,
                            prStatusColors[pr.status]?.text,
                            prStatusColors[pr.status]?.border
                          )}
                        >
                          {statusIcons[pr.status]}
                          {pr.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-medium", getAgeColor(age))}>
                          {age} day{age !== 1 ? "s" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/purchasing/${pr.id}`);
                          }}
                        >
                          View
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