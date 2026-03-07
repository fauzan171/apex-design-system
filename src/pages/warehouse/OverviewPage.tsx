import { Warehouse, Package, Box, Truck, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "@/components/dashboard/KPICard";

const warehouseKPIs = {
  totalStock: { value: "12,450", label: "Total Items", trend: 5.2 },
  lowStock: { value: "48", label: "Low Stock Alerts", trend: -2.1 },
  turnover: { value: "85%", label: "Inventory Turnover", trend: 3.8 },
  accuracy: { value: "98.2%", label: "Stock Accuracy", trend: 1.5 },
};

export function WarehouseOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Warehouse Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor inventory levels, stock movements, and warehouse operations
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Report</Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Stock"
          value={warehouseKPIs.totalStock.value}
          trend={warehouseKPIs.totalStock.trend}
          trendLabel="vs last period"
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          )}
          iconColor="text-green-600"
          bgColor="bg-green-100"
        />
        <KPICard
          title="Low Stock Alerts"
          value={warehouseKPIs.lowStock.value}
          trend={warehouseKPIs.lowStock.trend}
          trendLabel="vs last period"
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
          iconColor="text-orange-600"
          bgColor="bg-orange-100"
        />
        <KPICard
          title="Inventory Turnover"
          value={warehouseKPIs.turnover.value}
          trend={warehouseKPIs.turnover.trend}
          trendLabel="vs last period"
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          )}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <KPICard
          title="Stock Accuracy"
          value={warehouseKPIs.accuracy.value}
          trend={warehouseKPIs.accuracy.trend}
          trendLabel="vs last period"
          icon={() => (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Stock Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-slate-900">289</div>
                    <p className="text-sm text-slate-500 mt-1">Raw Materials</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-slate-900">156</div>
                    <p className="text-sm text-slate-500 mt-1">Semi-Finished</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-slate-900">87</div>
                    <p className="text-sm text-slate-500 mt-1">Finished Goods</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-slate-900 mb-3">Top Stock Categories</h4>
                <div className="space-y-3">
                  {[
                    { name: "Steel Coils", qty: 3420, color: "bg-blue-500" },
                    { name: "Flat Bars", qty: 2850, color: "bg-green-500" },
                    { name: "Angles", qty: 1980, color: "bg-orange-500" },
                    { name: "Pipes", qty: 1650, color: "bg-purple-500" },
                  ].map((cat) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cat.name}</span>
                        <span className="font-medium">{cat.qty.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${cat.color}`}
                          style={{ width: `${(cat.qty / 3420) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Box className="h-4 w-4 mr-2" />
              Receive Goods
            </Button>
            <Button className="w-full" variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Pick Items
            </Button>
            <Button className="w-full" variant="outline">
              <Truck className="h-4 w-4 mr-2" />
              Ship Orders
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Stock Transfer
            </Button>
            <Button className="w-full" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Stock Count
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">PO-{1000 + i}</div>
                  <div className="text-sm text-slate-500">{i % 2 === 0 ? 'Shipment Out' : 'Goods Receipt'}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{i * 500} Items</div>
                  <div className="text-xs text-slate-400">2 hours ago</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
