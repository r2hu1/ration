"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "./project-card";
import EmptyProject from "../project/empty";

function ProjectsGrid({ projects }: { projects: any[] }) {
  const [viewType, setViewType] = useState<"flex" | "grid">("grid");
  const searchParams = useSearchParams();
  const param = searchParams.get("viewType");

  useEffect(() => {
    if (param) setViewType(param as "flex" | "grid");
  }, [param]);

  const gridView = "gap-4 sm:grid-cols-2 md:grid-cols-3";
  const flexView = "grid-cols-1";

  return (
    <div className={cn("grid", viewType === "flex" ? flexView : gridView)}>
      {projects.map((project) => (
        <ProjectCard viewType={viewType} project={project} key={project.id} />
      ))}
    </div>
  );
}

export default function AllTeamProjects() {
  const trpc = useTRPC();

  const { data: projects, isPending } = useQuery(
    trpc.projects.get_all.queryOptions({ type: "TEAM" }),
  );

  if (isPending) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton className="h-16 w-full" key={i} />
        ))}
      </div>
    );
  }
  //@ts-ignore
  if (!isPending && !projects.length) return <EmptyProject />;

  return (
    <Suspense
      fallback={
        <div className="grid gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton className="h-16 w-full" key={i} />
          ))}
        </div>
      }
    >
      <ProjectsGrid projects={projects as any} />
    </Suspense>
  );
}
