"use client";

import { useApp } from "@/modules/providers/middleware";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteTeam from "../danger/delete-team";
import LeaveTeam from "@/modules/auth/views/ui/leave-team";
import { Button } from "@/components/ui/button";
import { LogOut, Trash2 } from "lucide-react";

export default function TeamSettingsHeader({
  loading,
  data,
}: {
  data?: string;
  loading: boolean;
}) {
  const { organization } = useApp();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">{organization?.name}</h1>
          <p className="text-sm text-foreground/80">
            {loading ? (
              <Skeleton className="h-3 w-40" />
            ) : data === "owner" ? (
              "You created this team"
            ) : (
              "You are a member of this team"
            )}
          </p>
        </div>
        {loading ? (
          <Skeleton className="h-10 w-28" />
        ) : data == "owner" ? (
          <DeleteTeam teamId={organization?.id!}>
            <Button>
              Delete <Trash2 className="size-3.5" />
            </Button>
          </DeleteTeam>
        ) : (
          <LeaveTeam slug={organization?.id!}>
            <Button>
              Leave <LogOut className="size-3.5" />
            </Button>
          </LeaveTeam>
        )}
      </div>
    </div>
  );
}
