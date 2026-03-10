import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, AlertCircle, Package, Activity, TrendingUp, Filter, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { useWarehouseStock, useWarehouseStats } from "@/hooks";
import type { Stock, StockCategory } from "@/types/warehouse";
import { cn } from "@/lib/utils";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Raw Material", label: "Raw Material" },
  { value: "Work in Progress", label: "Work in Progress" },
  { value: "Finished Good", label: "Finished Good" },
  { value: "Consumable", label: "Consumable" },
];

export function WarehouseListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Build filters for hooks
  const filters = useMemo(() => {
    const result: { category?: StockCategory; lowStock?: boolean; search?: string } = {};
    if (categoryFilter !== "all") {
      result.category = categoryFilter as StockCategory;
    }
    if (lowStockOnly) {
      result.lowStock = true;
    }
    if (search) {
      result.search = search;
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }, [categoryFilter, lowStockOnly, search]);

  // Use custom hooks for data fetching
  const {
    data: stocks = [],
    isLoading: loading,
    isFetching,
    refetch: refetchStocks,
  } = useWarehouseStock({
    filters,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const {
    data: stats,
    refetch: refetchStats,
  } = useWarehouseStats();

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetchStocks();
    refetchStats();
  }, [refetchStocks, refetchStats]);

  const formatQuantity = (qty: number, unit: string) => {
    return `${qty.toLocaleString()} ${unit}`;
  };

  const getStockStatus = (stock: Stock) => {
    if (stock.quantity === 0) return { text: "Empty", color: "text-red-600" };
    if (stock.quantity < stock.safetyStock) return { text: "Low Stock", color: "text-amber-600" };
    return { text: "Normal", color: "text-green-600" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Warehouse</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage inventory, stock levels, and warehouse operations
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          <Button onClick={() => navigate("/warehouse/gr/create")} className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            New GR
          </Button>
          <Button onClick={() => navigate("/warehouse/gi/create")} variant="outline" className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            New GI
          </Button>
          <Button onClick={() => navigate("/warehouse/do/create")} variant="outline" className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            New DO
          </Button>
          <Button onClick={() => navigate("/warehouse/stock-alerts")} variant="outline" className="gap-2 ml-auto">
            <AlertCircle className="h-4 w-4" />
            Stock Alerts
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Items</p>
                <p className="text-xl font-semibold text-slate-900">{stats?.totalItems ?? stocks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Value</p>
                <p className="text-xl font-semibold text-slate-900">
                  {stats ? `Rp ${stats.totalValue.toLocaleString()}` : "Rp 5,234,000,000"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Low Stock</p>
                <p className="text-xl font-semibold text-slate-900">
                  {stats?.lowStockCount ?? stocks.filter((s) => s.quantity < s.safetyStock).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Categories</p>
                <p className="text-xl font-semibold text-slate-900">
                  {stats?.byCategory?.length ?? new Set(stocks.map((s) => s.product.type)).size}
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
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={lowStockOnly ? "default" : "outline"}
              onClick={() => setLowStockOnly(!lowStockOnly)}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {lowStockOnly ? "Showing Low Stock" : "Show Low Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : stocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Package className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No stock found</p>
              <p className="text-sm">Stock will be updated after goods receipt</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Safety Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => {
                  const status = getStockStatus(stock);
                  return (
                    <TableRow key={stock.id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell>
                        <div className="font-medium text-slate-900">{stock.product.name}</div>
                        <div className="text-xs text-slate-500">{stock.product.code}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize"
                        >
                          {stock.product.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatQuantity(stock.quantity, stock.product.baseUnit)}</TableCell>
                      <TableCell className="text-slate-500">{stock.safetyStock} {stock.product.baseUnit}</TableCell>
                      <TableCell className="text-slate-500 font-mono text-sm">{stock.location}</TableCell>
                      <TableCell>
                        <span className={cn("font-medium", status.color)}>
                          {status.text}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/warehouse/stock/${stock.id}`)}
                        >
                          View
                          <ArrowRight className="h-4 w-4 ml-1" />
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
