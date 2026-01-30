"use client";

import { useQuery } from "@tanstack/react-query";
import { LogOut, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "@/components/providers/auth-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import LeaveTeam from "@/modules/auth/views/ui/leave-team";
import { useApp } from "@/modules/providers/middleware";
import { useTRPC } from "@/trpc/client";

export default function TeamSettingsHeader({
  loading,
  data,
}: {
  data: string;
  loading: boolean;
}) {
  const { organization } = useApp();

  return (
    <div>
      {/*<div className="mt-6">
        <h1 className="text-sm font-medium">Settings</h1>
      </div>*/}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">{organization?.name}</h1>
          <p className="text-sm text-foreground/80">
            {loading ? (
              <Skeleton className="h-3 w-40" />
            ) : data == "owner" ? (
              "You created this team"
            ) : (
              "You are a member of this team"
            )}
          </p>
        </div>
        {loading ? (
          <Skeleton className="h-10 w-28" />
        ) : data == "owner" ? (
          <Button asChild>
            <Link href={`/~/${organization?.id}/danger`}>
              Delete <Trash2 className="size-3.5" />
            </Link>
          </Button>
        ) : (
          <LeaveTeam slug={organization?.id as string}>
            <Button>
              Leave <LogOut className="size-3.5" />
            </Button>
          </LeaveTeam>
        )}
      </div>
    </div>
  );
}
