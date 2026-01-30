"use client";

import type { ProjectType } from "@/modules/shared/components/change-project-type";
import ProjectCard from "@/modules/shared/components/project-card";

interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  envs?: any;
  updatedAt: string;
  slug: string;
}

interface PersonalProjectCardProps {
  project: Project;
  viewType: "grid" | "list";
}

export default function PersonalProjectCard({
  project,
  viewType,
}: PersonalProjectCardProps) {
  return (
    <ProjectCard
      project={project}
      viewType={viewType}
      projectType="PERSONAL"
      basePath="/~/me"
    />
  );
}
