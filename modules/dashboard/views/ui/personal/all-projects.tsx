"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import PersonalProjectCard from "./project-card";
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
        <PersonalProjectCard
          key={project.id}
          viewType={viewType}
          project={project}
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
