"use client";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ResponsiveModal from "@/modules/shared/components/responsive-modal";

export default function DeleteTeam({
  teamId,
  children,
}: {
  teamId: string;
  children: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.teams.delete.mutationOptions(),
  );
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleTeamDelete = () => {
    mutate(
      { teamId: teamId },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
          await authClient.organization.setActive({ organizationId: null });
          router.push("/~");
        },
        onSettled: () => {
          setModalOpen(false);
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
      title="Delete Team"
      description="You are about to delete this team, which will also delete all projects and members associated with it. This action cannot be undone."
      content=""
      confirmText={
        <>
          {isPending && <Loader />}
          Continue
        </>
      }
      cancelText="Cancel"
      onConfirm={handleTeamDelete}
      confirmDisabled={isPending}
      cancelDisabled={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
