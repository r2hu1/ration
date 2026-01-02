"use client";

import ProjectCard from "@/modules/shared/components/project-card";
import { ProjectType } from "@/modules/shared/components/change-project-type";
import { usePathname } from "next/navigation";

interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  envs?: any;
  updatedAt: string;
  slug: string;
}

interface TeamProjectCardProps {
  project: Project;
  viewType: "grid" | "list";
}

export default function TeamProjectCard({
  project,
  viewType,
}: TeamProjectCardProps) {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, 3).join("/");

  return (
    <ProjectCard
      project={project}
      viewType={viewType}
      projectType="TEAM"
      basePath={basePath}
    />
  );
}
