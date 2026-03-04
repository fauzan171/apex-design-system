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
            className={showComparison ? "bg-[#006600] hover:bg-[#005500]" : ""}
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
                  <span className="text-sm text-slate-600 w-40">{item.name}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 flex items-center justify-end pr-2"
                        style={{ width: `${item.current}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {item.current}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden flex">
                      <div
                        className="h-full bg-slate-400 flex items-center justify-end pr-2"
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
                      variance >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {variance >= 0 ? "+" : ""}
                    {variance}%
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 pt-4 border-t text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Current Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded" />
                <span>Previous Period</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-slate-400">
            <p>Click &quot;Show Comparison&quot; to view period comparison</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}