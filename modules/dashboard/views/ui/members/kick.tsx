"use client";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import ResponsiveModal from "@/modules/shared/components/responsive-modal";

export default function KickUser({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleKickMember = async () => {
    setLoading(true);
    const { data, error } = await authClient.organization.removeMember({
      memberIdOrEmail: email,
    });
    if (!error) {
      toast.success("Kicked user from team.");
      queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
      queryClient.invalidateQueries(
        trpc.teams.get_members_in_active_team.queryOptions(),
      );
      setModalOpen(false);
    }
    if (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      title="Are you sure?"
      description={`You are about to kick ${email} from the ${activeOrganization?.name}.`}
      content=""
      confirmText={
        <>
          {loading && <Loader />}
          Continue
        </>
      }
      cancelText="Cancel"
      onConfirm={handleKickMember}
      confirmDisabled={loading}
      cancelDisabled={loading}
    >
      {children}
    </ResponsiveModal>
  );
}
