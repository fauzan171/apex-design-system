import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProductionKPIs as ProductionKPIsType } from "@/types";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProductionKPIsCardProps {
  data: ProductionKPIsType;
}

export function ProductionKPIsCard({ data }: ProductionKPIsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Production KPIs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Efficiency</p>
            <p className="text-2xl font-bold text-foreground">{data.efficiency}%</p>
            <p className={cn("text-xs", data.efficiencyTrend >= 0 ? "text-success" : "text-destructive")}>
              {data.efficiencyTrend >= 0 ? "+" : ""}
              {data.efficiencyTrend}% vs last period
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">On-Time Completion</p>
            <p className="text-2xl font-bold text-foreground">{data.onTimeRate}%</p>
            <p className={cn("text-xs", data.onTimeTrend >= 0 ? "text-success" : "text-destructive")}>
              {data.onTimeTrend >= 0 ? "+" : ""}
              {data.onTimeTrend}% vs last period
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">QC Pass Rate</p>
            <p className="text-2xl font-bold text-foreground">{data.qcPassRate}%</p>
            <p className={cn("text-xs", data.qcTrend >= 0 ? "text-success" : "text-destructive")}>
              {data.qcTrend >= 0 ? "+" : ""}
              {data.qcTrend}% vs last period
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total WOs</p>
            <p className="text-2xl font-bold text-foreground">{data.totalWOs}</p>
            <p className="text-xs text-muted-foreground">This period</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">Daily Output Trend</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[60, 100]}
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
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Efficiency %"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">WO by Status</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {data.statusBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {entry.name} ({entry.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}