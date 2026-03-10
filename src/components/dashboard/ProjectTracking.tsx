import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import type { Project } from "@/types";

interface ProjectTrackingProps {
  projects: Project[];
}

const stageColors: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Production: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  QC: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Delivery: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Delivered: "bg-muted text-muted-foreground",
};

export function ProjectTracking({ projects }: ProjectTrackingProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Project Tracking</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{project.id}</span>
                  <Badge variant="outline" className="text-xs">
                    {project.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-10">
                    {project.progress}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={stageColors[project.stage]}>
                  {project.stage}
                </Badge>
                <div className="text-right min-w-[60px]">
                  {project.eta === 0 ? (
                    <span className="text-sm text-success font-medium">Done</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      ETA: {project.eta} days
                    </span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}