"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function AcceptInvite({ inviteId }: { inviteId: string }) {
  const trpc = useTRPC();
  const { data, isPending, error } = useQuery(
    trpc.teams.get_invite_details.queryOptions({ id: inviteId }),
  );

  const router = useRouter();

  const handleAccept = async () => {};

  const handleReject = async () => {};

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-3 max-w-md w-full border bg-background p-6">
        <Loader />
        <h1 className="text-sm text-foreground/80">Loading Invite...</h1>
      </div>
    );
  }

  if (!isPending && error) {
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
          <span className="font-bold">{data?.invited_by}</span> has invited you
          to join their team.
        </p>
        <div className="grid gap-2 py-2 mt-4.5">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-sm">Invited By</h1>
            <span className="font-bold text-sm">{data?.invited_by}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-sm">Your Email</h1>
            <span className="font-bold text-sm">{data?.email}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-sm">Joining As</h1>
            <span className="font-bold text-sm">{data?.role}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-sm">Invited On</h1>
            <span className="font-bold text-sm">
              {data?.invited_on
                ? new Date(data?.invited_on).toDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 mt-8 gap-2">
        <Button onClick={handleReject} variant="outline">
          Decline
        </Button>
        <Button onClick={handleAccept}>Accept</Button>
      </div>
    </div>
  );
}
