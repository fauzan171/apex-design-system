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
            className="bg-destructive/10 text-destructive border-destructive/20"
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
                ? "bg-destructive/10 border-destructive/20"
                : alert.severity === "medium"
                  ? "bg-warning/10 border-warning/20"
                  : "bg-muted border-border"
            )}
          >
            <AlertCircle
              className={cn(
                "h-5 w-5",
                alert.severity === "high"
                  ? "text-destructive"
                  : alert.severity === "medium"
                    ? "text-warning"
                    : "text-muted-foreground"
              )}
            />
            <span className="text-sm text-foreground flex-1">{alert.message}</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                alert.severity === "high"
                  ? "border-destructive/30 text-destructive"
                  : alert.severity === "medium"
                    ? "border-warning/30 text-warning"
                    : "border-border text-muted-foreground"
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