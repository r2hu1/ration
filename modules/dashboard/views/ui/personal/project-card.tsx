"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Copy,
  EllipsisVertical,
  FlaskConical,
  Fullscreen,
  Pickaxe,
  Radio,
} from "lucide-react";
import Link from "next/link";

const projectTypes = {
  development: Pickaxe,
  production: Radio,
  test: FlaskConical,
} as const;

type ProjectType = keyof typeof projectTypes;

interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  envs?: any;
  updatedAt: String;
  slug: string;
}

export default function ProjectCard({
  project,
  viewType,
}: {
  project: Project;
  viewType: "grid" | "flex";
}) {
  const Icon =
    projectTypes[project.type as keyof typeof projectTypes] ?? Pickaxe;

  return (
    <div
      className={cn(
        "bg-background border p-4 hover:border-foreground/30 transition rounded-lg",
        viewType === "grid"
          ? "grid gap-2"
          : "flex items-center justify-between border-b-0 last:border-b hover:border-b",
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="secondary"
                className="bg-secondary/40"
              >
                <Icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
            </TooltipContent>
          </Tooltip>

          <Link href={`/~/me/${project.slug}`} className="grid gap-1">
            <h1 className="text-sm font-medium hover:underline">
              {project.name}
            </h1>
            {project.description ? (
              <p className="text-xs text-foreground/90 line-clamp-2">
                {project.description}
              </p>
            ) : (
              <p className="text-xs text-foreground/90 line-clamp-2">
                No description
              </p>
            )}
          </Link>
        </div>

        <div
          className={cn(
            "flex items-center gap-1.5",
            viewType == "flex" ? "mr-2" : "",
          )}
        >
          {viewType === "flex" && (
            <p className="text-[11px] hidden sm:flex mr-4 text-foreground/80">
              Updated on {new Date(project.updatedAt as any).toDateString()}
            </p>
          )}
          <Tooltip>
            <TooltipTrigger>
              <Button size="icon-sm" variant="ghost">
                <Copy className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
          <Button size="icon-sm" variant="ghost">
            <EllipsisVertical className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex items-end justify-between">
        {viewType != "flex" && (
          <p className="text-[11px] text-foreground/80">
            Updated on {new Date(project.updatedAt as any).toDateString()}
          </p>
        )}
        <Button
          size="sm"
          className="hidden sm:flex text-xs h-[30px] shadow-none"
          variant="outline"
          asChild
        >
          <Link href={`/~/me/${project.slug}`}>
            Open <Fullscreen className="size-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
