"use client";

import ProjectView from "@/modules/shared/components/project-view";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TeamProjectView({
  projectSlug,
}: {
  projectSlug: string;
}) {
  const pathname = usePathname();
  const basePath = pathname.split("/").slice(0, 3).join("/");
  const qc = useQueryClient();
  const trpc = useTRPC();

  useEffect(() => {
    qc.invalidateQueries(
      trpc.projects.get_by_slug.queryOptions({
        slug: projectSlug,
        type: "TEAM",
      })
    );
  }, [projectSlug, qc]);

  return (
    <ProjectView
      projectSlug={projectSlug}
      projectType="TEAM"
      backPath={basePath}
    />
  );
}
