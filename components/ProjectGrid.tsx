"use client";

import ProjectEntry from "./ProjectEntry";
import WorkEmptyState from "./WorkEmptyState";
import type { Project } from "@/lib/types";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <WorkEmptyState />;

  return (
    <div className="pe-grid-root">
      {projects.map((project, index) => (
        <div key={project.routeSlug} className="pe-col-item">
          <ProjectEntry project={project} index={index} />
        </div>
      ))}
    </div>
  );
}
