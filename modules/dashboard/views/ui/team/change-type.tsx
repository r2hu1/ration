"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type ProjectType = "development" | "production" | "test";

export default function ChangeProjectType({
  slug,
  prevType,
}: {
  prevType: string;
  slug: string;
}) {
  const trpc = useTRPC();
  const { mutate, isPending: typePending } = useMutation(
    trpc.projects.update_by_slug.mutationOptions(),
  );
  const [type, setType] = useState<ProjectType | undefined>(undefined);

  useEffect(() => {
    if (prevType) {
      setType(prevType as ProjectType);
    }
  }, [prevType]);

  const queryClient = useQueryClient();

  const handleTypeChange = (value: ProjectType) => {
    setType(value);
    mutate(
      { slug: slug, type: value, projectType: "TEAM" },
      {
        onSuccess: () => {
          toast.success("Project type updated");
          queryClient.invalidateQueries(
            trpc.projects.get_all.queryOptions({ type: "TEAM" }),
          );
          queryClient.invalidateQueries(
            trpc.projects.get_by_slug.queryOptions({
              slug: slug,
              type: "TEAM",
            }),
          );
        },
      },
    );
  };
  return (
    <Select
      disabled={typePending}
      value={type}
      onValueChange={handleTypeChange}
    >
      <SelectTrigger className="w-full h-[34px]!">
        <SelectValue placeholder="Select environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Environment</SelectLabel>
          <SelectItem value="development">Development</SelectItem>
          <SelectItem value="production">Production</SelectItem>
          <SelectItem value="test">Testing</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
