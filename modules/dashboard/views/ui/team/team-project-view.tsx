"use client";

import ProjectView from "@/modules/shared/components/project-view";
import { usePathname } from "next/navigation";

export default function TeamProjectView({
  projectSlug,
}: {
  projectSlug: string;
}) {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, 3).join("/");

  return (
    <ProjectView
      projectSlug={projectSlug}
      projectType="TEAM"
      backPath={basePath}
    />
  );
}
