"use client";

import type { ProjectType } from "@/modules/shared/components/change-project-type";
import ProjectSettings from "@/modules/shared/components/project-settings";

interface PersonalProjectSettingsProps {
  slug: string;
  prevName: string;
  prevDescription: string;
  prevType: ProjectType;
  children: React.ReactNode;
}

export default function PersonalProjectSettings({
  slug,
  prevName,
  prevDescription,
  prevType,
  children,
}: PersonalProjectSettingsProps) {
  return (
    <ProjectSettings
      slug={slug}
      prevName={prevName}
      prevDescription={prevDescription}
      prevType={prevType}
      projectType="PERSONAL"
    >
      {children}
    </ProjectSettings>
  );
}
