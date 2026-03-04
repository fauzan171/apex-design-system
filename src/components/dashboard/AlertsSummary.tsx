import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types";

interface AlertsSummaryProps {
  alerts: Alert[];
}

export function AlertsSummary({ alerts }: AlertsSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Alerts Summary</CardTitle>
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            {alerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border",
              alert.severity === "high"
                ? "bg-red-50 border-red-200"
                : alert.severity === "medium"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-slate-50 border-slate-200"
            )}
          >
            <AlertCircle
              className={cn(
                "h-5 w-5",
                alert.severity === "high"
                  ? "text-red-600"
                  : alert.severity === "medium"
                    ? "text-amber-600"
                    : "text-slate-500"
              )}
            />
            <span className="text-sm text-slate-700 flex-1">{alert.message}</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                alert.severity === "high"
                  ? "border-red-300 text-red-700"
                  : alert.severity === "medium"
                    ? "border-amber-300 text-amber-700"
                    : "border-slate-300 text-slate-600"
              )}
            >
              {alert.severity}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}