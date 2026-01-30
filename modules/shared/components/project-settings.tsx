"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import DeleteProject from "@/modules/dashboard/views/ui/project/delete-project";
import { useTRPC } from "@/trpc/client";
import ChangeProjectType, { type ProjectType } from "./change-project-type";
import ResponsiveModal from "./responsive-modal";

interface ProjectSettingsProps {
  slug: string;
  prevName: string;
  prevDescription: string;
  prevType: ProjectType;
  projectType: "PERSONAL" | "TEAM";
  children: React.ReactNode;
}

export default function ProjectSettings({
  slug,
  prevName,
  prevDescription,
  prevType,
  projectType,
  children,
}: ProjectSettingsProps) {
  const [name, setName] = useState(prevName);
  const [description, setDescription] = useState(prevDescription);
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.projects.update_by_slug.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleProjectUpdate = () => {
    mutate(
      {
        slug: slug,
        name: name,
        description: description,
        projectType,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.projects.get_all.queryOptions({ type: projectType }),
          );
          queryClient.invalidateQueries(
            trpc.projects.get_by_slug.queryOptions({
              slug: slug,
              type: projectType,
            }),
          );
          setModalOpen(false);
          toast.success("Project updated successfully");
        },
      },
    );
  };

  if (error) {
    toast.error(error.message);
  }

  const content = (
    <div className="py-3 grid gap-3">
      <Label>Project Name</Label>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
        placeholder="My Cool Project"
      />
      <Label>Project Description</Label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full"
        placeholder="Describe your project"
      />
      <Label>Project Type</Label>
      <ChangeProjectType
        slug={slug}
        prevType={prevType}
        projectType={projectType}
      />
    </div>
  );

  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      title={prevName}
      description="Rename, edit or delete your project."
      content={content}
      confirmText={
        <>
          {isPending && <Loader />}
          Save
        </>
      }
      cancelText="Cancel"
      onConfirm={handleProjectUpdate}
      confirmDisabled={isPending}
      cancelDisabled={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
