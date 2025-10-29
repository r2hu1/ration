"use client";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ResponsiveModal from "@/modules/shared/components/responsive-modal";

export default function LeaveTeam({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const handleTeamLeave = async () => {
    setLoading(true);
    const { data, error } = await authClient.organization.leave({
      organizationId: activeOrganization?.id as string,
    });
    if (!error) {
      toast.success("You have successfully left the team.");
      queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
      router.push("/~/me");
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
      description={`You are about to leave ${activeOrganization?.name}. Are you sure you want to proceed? This action cannot be undone.`}
      content=""
      confirmText={
        <>
          {loading && <Loader />}
          Continue
        </>
      }
      cancelText="Cancel"
      onConfirm={handleTeamLeave}
      confirmDisabled={loading}
      cancelDisabled={loading}
    >
      {children}
    </ResponsiveModal>
  );
}
