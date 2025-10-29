"use client";

import ProjectView from "@/modules/shared/components/project-view";

export default function PersonalProjectView({
  projectSlug,
}: {
  projectSlug: string;
}) {
  return (
    <ProjectView
      projectSlug={projectSlug}
      projectType="PERSONAL"
      backPath="/~/me"
    />
  );
}
