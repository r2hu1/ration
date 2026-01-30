"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ProjectCard from "@/modules/shared/components/project-card";
import { useTRPC } from "@/trpc/client";
import EmptyProject from "../project/empty";

function ProjectsGrid({ projects }: { projects: any[] }) {
  const [viewType, setViewType] = useState<"list" | "grid">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const param = searchParams.get("viewType");
  const query = searchParams.get("search");

  useEffect(() => {
    if (param === "list" || param === "grid") {
      setViewType(param);
    }
  }, [param]);

  useEffect(() => {
    setSearchQuery(query ?? "");
  }, [query]);

  const gridView = "gap-4 sm:grid-cols-2 md:grid-cols-3";
  const flexView = "grid-cols-1";

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    return p.name?.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div className={cn("grid", viewType === "list" ? flexView : gridView)}>
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          viewType={viewType}
          projectType="PERSONAL"
        />
      ))}
    </div>
  );
}

export default function AllPersonalProjects() {
  const trpc = useTRPC();

  const { data: projects, isPending } = useQuery(
    trpc.projects.get_all.queryOptions({ type: "PERSONAL" }),
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
  //@ts-expect-error
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
