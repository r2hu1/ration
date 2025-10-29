"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Bolt, Copy, Download } from "lucide-react";
import ProjectSettings from "./project-settings";
import ChangeProjectType, { ProjectType } from "./change-project-type";
import Link from "next/link";
import AddEnvs from "./add-envs";
import { Skeleton } from "@/components/ui/skeleton";
import EnvCard from "./env-card";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProjectViewProps {
  projectSlug: string;
  projectType: "PERSONAL" | "TEAM";
  backPath?: string;
}

export default function ProjectView({
  projectSlug,
  projectType,
  backPath,
}: ProjectViewProps) {
  const trpc = useTRPC();
  const {
    data: project,
    isPending,
    error,
    refetch,
  } = useQuery(
    trpc.projects.get_by_slug.queryOptions({
      slug: projectSlug,
      type: projectType,
    }),
  );

  const pathname = usePathname();
  useEffect(() => {
    refetch();
  }, [pathname]);

  const defaultBackPath =
    projectType === "PERSONAL"
      ? "/~/me"
      : pathname.split("/").slice(0, 3).join("/");

  const actualBackPath = backPath || defaultBackPath;

  const handleCopyAll = () => {
    const formatToString = Object.entries(project?.envs || {})
      .map(([key, value]) => `${key}="${value}"`)
      .join("\n");
    navigator.clipboard.writeText(formatToString);
    toast.success("Copied to clipboard");
  };

  const handleDownloadAsEnv = () => {
    const formatToString = Object.entries(project?.envs || {})
      .map(([key, value]) => `${key}="${value}"`)
      .join("\n");
    const blob = new Blob([formatToString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.name}.env`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Saved as .env file");
  };

  if (isPending)
    return (
      <div className="grid gap-3">
        <div className="flex items-center gap-3 justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-[200px] mt-4 w-full" />
      </div>
    );

  if (error) return <div>{error.message}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="pb-20">
      <div className="mt-6 flex flex-wrap gap-3 sm:gap-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            asChild
            size="icon"
            className="dark:bg-secondary/40"
          >
            <Link href={actualBackPath}>
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
            projectType={projectType}
          />
          <Button
            onClick={handleDownloadAsEnv}
            size="icon-sm"
            variant="outline"
          >
            <Download className="size-3" />
          </Button>
          <Button onClick={handleCopyAll} size="icon-sm" variant="outline">
            <Copy className="size-3" />
          </Button>
          <ProjectSettings
            slug={projectSlug}
            prevName={project.name}
            prevDescription={project.description}
            prevType={project.type as ProjectType}
            projectType={projectType}
          >
            <Button size="icon-sm">
              <Bolt className="size-3" />
            </Button>
          </ProjectSettings>
        </div>
      </div>

      <div className="my-6">
        <AddEnvs projectSlug={projectSlug} projectType={projectType} />
      </div>

      <div className="grid gap-3">
        {/*@ts-ignore*/}
        {!Object.entries(project.envs as Record<string, any>).length && (
          <div className="flex mt-5 items-center justify-center border h-[300px] w-full">
            <div className="text-center grid gap-2">
              <AlertTriangle className="size-4 mx-auto" />
              <h1 className="text-sm -mb-1 mt-px text-foreground/90">
                Its empty here
              </h1>
              <p className="text-xs text-foreground/70">
                Start by creating an environment.
              </p>
            </div>
          </div>
        )}
        {Object.entries(project.envs as Record<string, any>).map(
          ([key, value]) => (
            <EnvCard
              key={key}
              kkey={key}
              value={value}
              projectSlug={projectSlug}
              projectType={projectType}
            />
          ),
        )}
      </div>
    </div>
  );
}
