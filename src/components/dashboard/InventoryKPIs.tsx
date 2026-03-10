import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InventoryKPIs } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface InventoryKPIsCardProps {
  data: InventoryKPIs;
}

export function InventoryKPIsCard({ data }: InventoryKPIsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Inventory KPIs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Stock Value</p>
            <p className="text-2xl font-bold text-foreground">
              {data.stockValueFormatted}
            </p>
            <p className="text-xs text-success">
              +{data.stockTrend}% vs last period
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-bold text-warning">
              {data.lowStockCount}
            </p>
            <p className="text-xs text-muted-foreground">Below safety stock</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">Stock by Category</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byCategory} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))"
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Percentage %"
                  fill="hsl(var(--info))"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">Stock Aging</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.aging}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))"
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Percentage %"
                  fill="hsl(var(--chart-4))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}