"use client";

import { useApp } from "@/modules/providers/middleware";
import { Skeleton } from "@/components/ui/skeleton";

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
      </div>
    </div>
  );
}
