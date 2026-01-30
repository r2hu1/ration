"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useTRPC } from "@/trpc/client";
import ResponsiveModal from "./responsive-modal";

interface DeleteEnvProps {
  children: React.ReactNode;
  projectSlug: string;
  projectType: "PERSONAL" | "TEAM";
  envKey: string;
}

export default function DeleteEnv({
  children,
  projectSlug,
  projectType,
  envKey,
}: DeleteEnvProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error } = useMutation(
    trpc.projects.update_by_slug.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleDeleteEnv = () => {
    mutate(
      {
        slug: projectSlug,
        projectType,
        deleteEnvKeys: [envKey],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.projects.get_by_slug.queryOptions({
              slug: projectSlug,
              type: projectType,
            }),
          );
          setModalOpen(false);
          toast.success(`Removed "${envKey}" from project`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete environment variable");
        },
      },
    );
  };

  if (error) {
    toast.error(error.message);
  }

  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      title="Delete Environment Variable"
      description={`Are you sure you want to delete "${envKey}"? This action cannot be undone.`}
      content=""
      confirmText={
        <>
          {isPending && <Loader />}
          Delete
        </>
      }
      cancelText="Cancel"
      onConfirm={handleDeleteEnv}
      confirmDisabled={isPending}
      cancelDisabled={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
