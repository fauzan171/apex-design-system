import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Truck,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
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
import { deliveryService } from "@/services/deliveryService";
import type { DeliveryOrder, DOStatusType } from "@/types/delivery";
import { DOStatus, doStatusColors, getDONumber, getDODate } from "@/types/delivery";
import { cn } from "@/lib/utils";

export function DeliveryListPage() {
  const navigate = useNavigate();
  const [dos, setDOs] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DOStatusType | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadDOs();
  }, [statusFilter, dateFrom, dateTo]);

  const loadDOs = async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getDOs({
        status: statusFilter,
        dateFrom,
        dateTo,
        search,
      });
      setDOs(data);
    } catch (error) {
      console.error("Failed to load DOs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadDOs();
  };

  const getStatusIcon = (status: DOStatusType) => {
    switch (status) {
      case DOStatus.DRAFT:
        return <FileText className="h-4 w-4" />;
      case DOStatus.RELEASED:
      case DOStatus.IN_TRANSIT:
      case DOStatus.DELIVERED:
        return <Truck className="h-4 w-4" />;
      case DOStatus.RECEIVED:
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Summary stats
  const stats = {
    total: dos.length,
    draft: dos.filter((d) => d.status === DOStatus.DRAFT).length,
    inTransit: dos.filter(
      (d) => d.status === DOStatus.RELEASED || d.status === DOStatus.IN_TRANSIT
    ).length,
    delivered: dos.filter((d) => d.status === DOStatus.DELIVERED).length,
    received: dos.filter((d) => d.status === DOStatus.RECEIVED).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery Order</h1>
          <p className="text-sm text-slate-500">
            Manage delivery orders to Head Office
          </p>
        </div>
        <Button onClick={() => navigate("/delivery/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create DO
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-500">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-600">{stats.draft}</div>
            <div className="text-sm text-slate-500">Draft</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.inTransit}</div>
            <div className="text-sm text-slate-500">In Transit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.delivered}</div>
            <div className="text-sm text-slate-500">Delivered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.received}</div>
            <div className="text-sm text-slate-500">Received</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by DO number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DOStatusType | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={DOStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={DOStatus.RELEASED}>Released</SelectItem>
                    <SelectItem value={DOStatus.IN_TRANSIT}>In Transit</SelectItem>
                    <SelectItem value={DOStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={DOStatus.RECEIVED}>Received</SelectItem>
                    <SelectItem value={DOStatus.CANCELLED}>Cancelled</SelectItem>
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

      {/* DO List Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : dos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Truck className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No delivery orders found</p>
              <p className="text-sm">Create a new DO to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DO Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>BAST</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dos.map((do_) => {
                  const doNumber = getDONumber(do_);
                  const doDate = getDODate(do_);
                  return (
                    <TableRow
                      key={do_.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => navigate(`/delivery/${do_.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium text-slate-900">{doNumber}</div>
                        {do_.notes && (
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">
                            {do_.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {formatDate(doDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span>{do_.items.length} items</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1.5",
                            doStatusColors[do_.status].bg,
                            doStatusColors[do_.status].text,
                            doStatusColors[do_.status].border
                          )}
                        >
                          {getStatusIcon(do_.status)}
                          {do_.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {do_.bastOutbound || do_.bast ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Uploaded
                          </Badge>
                        ) : do_.status === DOStatus.DELIVERED ? (
                          <span className="text-xs text-amber-600">Pending Upload</span>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/delivery/${do_.id}`);
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