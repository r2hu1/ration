"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import EmptyProject from "../project/empty";
import { Button } from "@/components/ui/button";
import ProjectCard from "./project-card";
import { Loader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AllPersonalProjects() {
  const trpc = useTRPC();
  const { data: projects, isPending } = useQuery(
    trpc.projects.get_all.queryOptions(),
  );

  const [viewType, setViewType] = useState<"flex" | "grid">("flex");
  const gridView = "gap-4 sm:grid-cols-2 md:grid-cols-3";
  const flexView = "grid-cols-1";
  const param = useSearchParams().get("viewType");

  useEffect(() => {
    if (param) {
      setViewType(param as "flex" | "grid");
    }
  }, [param]);

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton className="h-16 w-full" key={i} />
        ))}
      </div>
    );
  }
  if (!isPending && !projects) return <EmptyProject />;

  return (
    <Suspense
      fallback={
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton className="h-16 w-full" key={i} />
          ))}
        </div>
      }
    >
      <div className={cn("grid", viewType == "flex" ? flexView : gridView)}>
        {projects.map((project) => (
          <ProjectCard viewType={viewType} project={project} key={project.id} />
        ))}
      </div>
    </Suspense>
  );
}
