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
import { ProjectType, ResponsiveModal } from "@/modules/shared/components";
import { useTRPC } from "@/trpc/client";

interface ProjectSettingsProps {
  slug: string;
  projectType: "PERSONAL" | "TEAM";
  children: React.ReactNode;
}

export default function DeleteProject({
  slug,
  projectType,
  children,
}: ProjectSettingsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const {
    mutate: deleteProject,
    isPending: isDeleting,
    error: deleteError,
    status: deleteStatus,
  } = useMutation(trpc.projects.delete.mutationOptions());
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

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

  if (deleteError) {
    toast.error(deleteError.message);
  }

  return (
    <ResponsiveModal
      content={""}
      open={modalOpen}
      onOpenChange={setModalOpen}
      title={"Are you sure?"}
      description="Do you want to delete this project? This action cannot be undone."
      confirmText={
        <>
          {isDeleting && <Loader />}
          Delete
        </>
      }
      cancelText="Cancel"
      onConfirm={handleDelete}
      confirmDisabled={isDeleting}
      cancelDisabled={isDeleting}
    >
      {children}
    </ResponsiveModal>
  );
}
