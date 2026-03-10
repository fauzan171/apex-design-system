import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComparisonData } from "@/types";

interface PeriodComparisonProps {
  data: ComparisonData[];
}

export function PeriodComparison({ data }: PeriodComparisonProps) {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Period Comparison</CardTitle>
          <Button
            variant={showComparison ? "default" : "outline"}
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? "Hide" : "Show"} Comparison
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showComparison ? (
          <div className="space-y-4">
            {data.map((item) => {
              const variance = item.current - item.previous;
              return (
                <div key={item.name} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-40">{item.name}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-6 bg-muted rounded overflow-hidden flex">
                      <div
                        className="h-full bg-primary flex items-center justify-end pr-2"
                        style={{ width: `${item.current}%` }}
                      >
                        <span className="text-xs text-primary-foreground font-medium">
                          {item.current}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 h-6 bg-muted rounded overflow-hidden flex">
                      <div
                        className="h-full bg-muted-foreground/50 flex items-center justify-end pr-2"
                        style={{ width: `${item.previous}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {item.previous}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium w-16 text-right",
                      variance >= 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {variance >= 0 ? "+" : ""}
                    {variance}%
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 pt-4 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span>Current Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-muted-foreground/50 rounded" />
                <span>Previous Period</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Click &quot;Show Comparison&quot; to view period comparison</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}