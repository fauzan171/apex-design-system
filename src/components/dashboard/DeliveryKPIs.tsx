import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DeliveryKPIs } from "@/types";
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

interface DeliveryKPIsCardProps {
  data: DeliveryKPIs;
}

export function DeliveryKPIsCard({ data }: DeliveryKPIsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Delivery KPIs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">On-Time Delivery</p>
            <p className="text-2xl font-bold text-slate-900">{data.onTimeRate}%</p>
            <p
              className={
                data.onTimeTrend >= 0 ? "text-xs text-green-600" : "text-xs text-red-600"
              }
            >
              {data.onTimeTrend >= 0 ? "+" : ""}
              {data.onTimeTrend}% vs last period
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Avg Lead Time</p>
            <p className="text-2xl font-bold text-slate-900">{data.avgLeadTime} days</p>
            <p
              className={
                data.leadTimeTrend <= 0 ? "text-xs text-green-600" : "text-xs text-red-600"
              }
            >
              {data.leadTimeTrend >= 0 ? "+" : ""}
              {data.leadTimeTrend} days vs last period
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">BAST Completion</p>
            <p className="text-2xl font-bold text-slate-900">{data.bastCompletion}%</p>
            <p className="text-xs text-slate-500">This period</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Total DOs</p>
            <p className="text-2xl font-bold text-slate-900">{data.totalDOs}</p>
            <p className="text-xs text-slate-500">This period</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Delivery Trend</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Deliveries"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">DO by Status</p>
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
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }}
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
                <span className="text-xs text-slate-600">
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