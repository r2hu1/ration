"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import ResponsiveModal from "./responsive-modal";
import ChangeProjectType, { ProjectType } from "./change-project-type";

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
  const {
    mutate: deleteProject,
    isPending: isDeleting,
    error: deleteError,
    status: deleteStatus,
  } = useMutation(trpc.projects.delete.mutationOptions());
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

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

  const handleDelete = () => {
    deleteProject(
      {
        slug: slug,
        type: projectType,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(
            trpc.projects.get_all.queryOptions({ type: projectType }),
          );
          if (pathname.includes(data.slug)) {
            router.push("/~");
          }
          setModalOpen(false);
          toast.success("Project deleted successfully");
        },
      },
    );
  };

  if (error) {
    toast.error(error.message);
  }

  if (deleteError) {
    toast.error(deleteError.message);
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
      <div className="flex items-center gap-4 py-2">
        <Button
          onClick={handleDelete}
          disabled={isPending || isDeleting}
          className="h-7 px-3! text-xs w-fit"
        >
          Delete Project{" "}
          {isDeleting ? <Loader /> : <Trash className="size-3.5" />}
        </Button>
        <Label className="text-xs text-foreground/80">
          This action cannot be undone*
        </Label>
      </div>
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
      confirmDisabled={isPending || isDeleting}
      cancelDisabled={isPending || isDeleting}
    >
      {children}
    </ResponsiveModal>
  );
}
