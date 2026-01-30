"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import EmptyProject from "../project/empty";
import TeamProjectCard from "./project-card";

function ProjectsGrid({ projects }: { projects: any[] }) {
  const searchParams = useSearchParams();

  const viewType = (searchParams.get("viewType") as "list" | "grid") ?? "grid";
  const searchQuery = searchParams.get("search") ?? "";

  const gridView = "gap-4 sm:grid-cols-2 md:grid-cols-3";
  const flexView = "grid-cols-1";

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    return p.name?.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div className={cn("grid", viewType === "list" ? flexView : gridView)}>
      {filteredProjects.map((project) => (
        <TeamProjectCard
          key={project.id}
          project={project}
          viewType={viewType}
        />
      ))}
    </div>
  );
}

export default function AllTeamProjects({ slug }: { slug: string }) {
  const trpc = useTRPC();
  const qc = useQueryClient();

  const queryOptions = trpc.projects.get_all.queryOptions({ type: "TEAM" });

  const { data: projects, isPending } = useQuery(queryOptions);

  useEffect(() => {
    if (slug) {
      qc.invalidateQueries({ queryKey: queryOptions.queryKey });
    }
  }, [slug, qc, queryOptions.queryKey]);

  if (isPending) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return <EmptyProject />;
  }

  return (
    <Suspense
      fallback={
        <div className="grid gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      }
    >
      <ProjectsGrid projects={projects} />
    </Suspense>
  );
}
