"use client";

import type { ProjectType } from "@/modules/shared/components/change-project-type";
import ProjectSettings from "@/modules/shared/components/project-settings";

interface TeamProjectSettingsProps {
  slug: string;
  prevName: string;
  prevDescription: string;
  prevType: ProjectType;
  children: React.ReactNode;
}

export default function TeamProjectSettings({
  slug,
  prevName,
  prevDescription,
  prevType,
  children,
}: TeamProjectSettingsProps) {
  return (
    <ProjectSettings
      slug={slug}
      prevName={prevName}
      prevDescription={prevDescription}
      prevType={prevType}
      projectType="TEAM"
    >
      {children}
    </ProjectSettings>
  );
}
