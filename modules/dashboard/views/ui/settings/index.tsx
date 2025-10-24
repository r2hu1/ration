"use client";

import { useAuthState } from "@/components/providers/auth-context";
import { Button } from "@/components/ui/button";
import LeaveTeam from "@/modules/auth/views/ui/leave-team";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Trash2 } from "lucide-react";
import Link from "next/link";

export default function TeamSettings({ slug }: { slug: string }) {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.teams.get_by_slug.queryOptions({ slug }),
  );
  const { data: user } = useAuthState();
  return (
    <div>
      {/*<div className="mt-6">
        <h1 className="text-sm font-medium">Settings</h1>
      </div>*/}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">{data?.name}</h1>
          <p className="text-sm text-foreground/80">
            {data?.owner === user?.session?.userId
              ? "You created this team"
              : "Someone invited you to this team"}
          </p>
        </div>
        {data?.owner === user?.session?.userId ? (
          <Button asChild>
            <Link href={`/~/${slug}/danger`}>
              Delete <Trash2 className="size-3.5" />
            </Link>
          </Button>
        ) : (
          <LeaveTeam slug={slug}>
            <Button>
              Leave <LogOut className="size-3.5" />
            </Button>
          </LeaveTeam>
        )}
      </div>
    </div>
  );
}
