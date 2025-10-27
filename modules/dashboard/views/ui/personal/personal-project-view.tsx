"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bolt, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PersonalProjectSettings from "./project-settings";
import ChangeProjectType, { ProjectType } from "./change-type";
import Link from "next/link";
import AddEnvs from "./add-envs";

export default function PersonalProjectView({
  projectSlug,
}: {
  projectSlug: string;
}) {
  const trpc = useTRPC();

  const {
    data: project,
    isPending,
    error,
  } = useQuery(trpc.projects.get_by_slug.queryOptions({ slug: projectSlug }));

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!isPending && !project) return <div>Project not found</div>;

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-3 sm:gap-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            asChild
            size="icon"
            className="bg-secondary/40"
          >
            <Link href="/~/me">
              <ArrowLeft className="size-3.5" />
            </Link>
          </Button>
          <div className="grid gap-1">
            <h1 className="text-sm font-medium">{project.name}</h1>
            <p className="text-xs text-foreground/80">
              {project.description || "No description provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:justify-normal justify-end sm:w-fit w-full">
          <ChangeProjectType
            slug={projectSlug}
            prevType={project.type as ProjectType}
          />
          <Button size="icon-sm" variant="outline">
            <Download className="size-3" />
          </Button>
          <Button size="icon-sm" variant="outline">
            <Copy className="size-3" />
          </Button>
          <PersonalProjectSettings
            slug={projectSlug}
            prevName={project.name}
            prevDescription={project.description}
            prevType={project.type as ProjectType}
          >
            <Button size="icon-sm">
              <Bolt className="size-3" />
            </Button>
          </PersonalProjectSettings>
        </div>
      </div>
      <div className="mt-6">
        <AddEnvs projectSlug={projectSlug} />
      </div>
    </div>
  );
}
