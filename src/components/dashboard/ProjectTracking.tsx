import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { Project } from "@/types";

interface ProjectTrackingProps {
  projects: Project[];
}

const stageColors: Record<string, string> = {
  Planning: "bg-blue-100 text-blue-700",
  Production: "bg-amber-100 text-amber-700",
  QC: "bg-purple-100 text-purple-700",
  Delivery: "bg-green-100 text-green-700",
  Delivered: "bg-slate-100 text-slate-700",
};

export function ProjectTracking({ projects }: ProjectTrackingProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Project Tracking</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900">{project.id}</span>
                  <Badge variant="outline" className="text-xs">
                    {project.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#006600] rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-10">
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
                    <span className="text-sm text-green-600 font-medium">Done</span>
                  ) : (
                    <span className="text-sm text-slate-600">
                      ETA: {project.eta} days
                    </span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}