import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const kpiCardVariants = cva(
  "relative overflow-hidden transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "hover:shadow-md hover:border-border/80",
        interactive:
          "hover:shadow-lg hover:border-border/80 hover:-translate-y-0.5 cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconVariants = cva(
  "flex items-center justify-center rounded-lg p-2.5 transition-colors duration-200",
  {
    variants: {
      color: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        success: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
        warning: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
        info: "bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);

const trendVariants = cva(
  "inline-flex items-center gap-1.5 text-sm font-medium px-2 py-0.5 rounded-full transition-colors",
  {
    variants: {
      trend: {
        up: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
        down: "bg-destructive/10 text-destructive",
        neutral: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  }
);

interface KPICardProps
  extends VariantProps<typeof kpiCardVariants>,
    VariantProps<typeof iconVariants> {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  className?: string;
}

export function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  variant,
  color = "default",
  className,
}: KPICardProps) {
  const getTrendDirection = (trendValue: number | undefined) => {
    if (trendValue === undefined) return "neutral";
    if (trendValue > 0) return "up";
    if (trendValue < 0) return "down";
    return "neutral";
  };

  const trendDirection = getTrendDirection(trend);

  const TrendIcon = trend === 0 || trend === undefined ? Minus : trend > 0 ? TrendingUp : TrendingDown;

  return (
    <Card className={cn(kpiCardVariants({ variant }), className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-2">
                <span
                  className={trendVariants({ trend: trendDirection })}
                  role="status"
                  aria-label={`Trend: ${trend >= 0 ? "up" : "down"} ${Math.abs(trend)} percent`}
                >
                  <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {trend >= 0 ? "+" : ""}
                    {trend}%
                  </span>
                </span>
                {trendLabel && (
                  <span className="text-xs text-muted-foreground">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={cn(iconVariants({ color }))} aria-hidden="true">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { kpiCardVariants, iconVariants, trendVariants };