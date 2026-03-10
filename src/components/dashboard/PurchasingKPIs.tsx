import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PurchasingKPIs } from "@/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PurchasingKPIsCardProps {
  data: PurchasingKPIs;
}

export function PurchasingKPIsCard({ data }: PurchasingKPIsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Purchasing KPIs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Avg Processing Time</p>
            <p className="text-2xl font-bold text-foreground">
              {data.avgProcessingTime} days
            </p>
            <p className={cn("text-xs", data.processingTrend <= 0 ? "text-success" : "text-destructive")}>
              {data.processingTrend >= 0 ? "+" : ""}
              {data.processingTrend} days vs last
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Approval Rate</p>
            <p className="text-2xl font-bold text-foreground">{data.approvalRate}%</p>
            <p className="text-xs text-success">
              {data.approvalTrend >= 0 ? "+" : ""}
              {data.approvalTrend}% vs last period
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">PR by Status</p>
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

        <div>
          <p className="text-sm font-medium text-foreground mb-3">PR Aging</p>
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
                  fill="hsl(var(--warning))"
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