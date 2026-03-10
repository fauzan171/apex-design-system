import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Package,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { warehouseService } from "@/services/warehouseService";
import type { StockAlert } from "@/types/warehouse";
import { StockCategoryColors } from "@/types/warehouse";
import { cn } from "@/lib/utils";

export function StockAlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await warehouseService.getLowStockAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to load alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (alert: StockAlert) => {
    if (alert.currentQty === 0) return "text-red-600";
    if (alert.shortageAmount > alert.safetyStock / 2) return "text-orange-600";
    return "text-amber-600";
  };

  const formatQuantity = (qty: number, unit: string = "PC") => {
    return `${qty.toLocaleString()} ${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock Alerts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor low stock situations and take appropriate action
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAlerts}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/warehouse")}>
            Back to Warehouse
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Alerts</p>
                <p className="text-xl font-semibold text-slate-900">
                  {alerts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Shortage</p>
                <p className="text-xl font-semibold text-slate-900">
                  {formatQuantity(
                    alerts.reduce((sum, a) => sum + a.shortageAmount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Package className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Empty Stock</p>
                <p className="text-xl font-semibold text-slate-900">
                  {alerts.filter((a) => a.currentQty === 0).length}
                </p>
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
                <p className="text-sm text-slate-500">With Action</p>
                <p className="text-xl font-semibold text-slate-900">
                  {alerts.length - alerts.filter((a) => !a.actionTaken).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <CheckCircle2 className="h-12 w-12 text-emerald-300 mb-4" />
              <p className="font-medium">No stock alerts</p>
              <p className="text-sm">All inventory levels are within safe limits</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Safety</TableHead>
                  <TableHead>Shortage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id} className="cursor-pointer hover:bg-slate-50">
                    <TableCell>
                      <div className="font-medium text-slate-900">{alert.productName}</div>
                      <div className="text-xs text-slate-500">{alert.productCode}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          StockCategoryColors[alert.category]
                        )}
                      >
                        {alert.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-red-600">
                        {formatQuantity(alert.currentQty)}
                      </span>
                    </TableCell>
                    <TableCell>{formatQuantity(alert.safetyStock)}</TableCell>
                    <TableCell>
                      <span className={cn("font-medium", getStatusColor(alert))}>
                        -{formatQuantity(alert.shortageAmount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {alert.actionTaken ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-slate-700">
                            {alert.actionTaken}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">No Action</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/stock/alert/${alert.id}`)}
                      >
                        Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => navigate("/warehouse")}>
          Back to Warehouse
        </Button>
        <Button
          onClick={() => navigate("/planning/create")}
          className="bg-[#006600] hover:bg-[#005500]"
        >
          Create Purchase Request
        </Button>
      </div>
    </div>
  );
}
