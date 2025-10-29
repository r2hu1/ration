"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import LeaveTeam from "@/modules/auth/views/ui/leave-team";
import { LogOut, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteTeam from "./delete-team";

export default function DangerPageView({ teamId }: { teamId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<any | null>(null);

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const fetchTeam = async () => {
    setLoading(true);
    const { data, error } = await authClient.organization.getActiveMemberRole();
    setData(data?.role);
    setError(error?.message);
    setLoading(false);
  };
  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium">Danger</h1>
          <p className="text-sm text-foreground/80">
            Delete your team, team projects
          </p>
        </div>
        {loading ? (
          <Skeleton className="h-10 w-28" />
        ) : data == "owner" ? (
          <DeleteTeam teamId={teamId}>
            <Button>
              Delete <Trash2 className="size-3.5" />
            </Button>
          </DeleteTeam>
        ) : (
          <LeaveTeam slug={teamId}>
            <Button>
              Leave <LogOut className="size-3.5" />
            </Button>
          </LeaveTeam>
        )}
      </div>
    </div>
  );
}
