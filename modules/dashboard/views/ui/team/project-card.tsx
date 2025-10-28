"use client";

import { Badge } from "@/components/ui/badge";
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
  Pickaxe,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  updatedAt: string;
  slug: string;
}

export default function ProjectCard({
  project,
  viewType,
}: {
  project: Project;
  viewType: "grid" | "flex";
}) {
  const Icon = projectTypes[project.type] ?? Pickaxe;
  const pathname = usePathname();

  const basePath = pathname.split("/").slice(0, 3).join("/");

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

          <Link href={`${basePath}/${project.slug}`} className="grid gap-1">
            <h1 className="truncate text-nowrap text-sm font-medium hover:underline">
              {project.name}
            </h1>
            {project.description ? (
              <p className="truncate text-nowrap text-xs text-foreground/90 line-clamp-2">
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
              Updated on {new Date(project.updatedAt).toDateString()}
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

      {viewType !== "flex" && (
        <div className="flex items-end justify-between -mb-2 mt-2">
          <p className="text-[11px] text-foreground/80">
            Updated on {new Date(project.updatedAt).toDateString()}
          </p>
          <Badge variant="secondary">
            {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
          </Badge>
        </div>
      )}
    </div>
  );
}
