"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

export default function AcceptInvite({ inviteId }: { inviteId: string }) {
  const router = useRouter();
  const [inviteDetails, setInviteDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isPendingAccept, setIsPendingAccept] = useState(false);
  const [isPendingReject, setRejectPending] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleAccept = async () => {
    setIsPendingAccept(true);
    const { data, error } = await authClient.organization.acceptInvitation({
      invitationId: inviteId,
    });
    if (!error) {
      toast.success("Invitation accepted!");
      queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
      router.push(`/~/${inviteDetails.organizationId}`);
    } else {
      toast.error("Something went wrong");
      setError(error);
    }
    setIsPendingAccept(false);
  };

  const handleReject = async () => {
    setRejectPending(true);
    await authClient.organization.rejectInvitation({
      invitationId: inviteId,
    });
    setRejectPending(false);
  };

  const fetchInvite = async () => {
    setLoading(true);
    const { data, error } = await authClient.organization.getInvitation({
      query: {
        id: inviteId,
      },
    });
    if (!error) {
      setInviteDetails(data);
    } else {
      setError(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchInvite();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 max-w-md w-full border bg-background p-6">
        <Loader />
        <h1 className="text-sm text-foreground/80">Loading Invite...</h1>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="flex items-center justify-center gap-3 max-w-md w-full border bg-background p-6">
        <AlertTriangle className="size-4" />
        <h1 className="text-sm text-foreground/80">
          This invite is not for you!
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full border bg-background p-6">
      <div className="grid gap-1.5">
        <h1 className="text-xl font-bold">Invite Details</h1>
        <p className="text-sm text-foreground/80">
          {inviteDetails?.inviterEmail} has invited you to join{" "}
          {inviteDetails?.organizationName}.
        </p>
        <div className="grid gap-2 py-2 mt-4.5">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-sm">Your Email</h1>
            <span className="font-bold text-sm">{inviteDetails?.email}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-sm">Joining As</h1>
            <span className="font-bold text-sm">{inviteDetails?.role}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-sm">Expires On</h1>
            <span className="font-bold text-sm">
              {inviteDetails?.expiresAt
                ? new Date(inviteDetails?.expiresAt).toDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 mt-8 gap-2">
        <Button
          disabled={isPendingAccept || isPendingReject}
          onClick={handleReject}
          variant="outline"
        >
          {isPendingReject && <Loader />}
          Decline
        </Button>
        <Button
          disabled={isPendingAccept || isPendingReject}
          onClick={handleAccept}
        >
          {isPendingAccept && <Loader />}Accept
        </Button>
      </div>
    </div>
  );
}
