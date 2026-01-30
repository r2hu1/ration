"use client";

import { useAuthState } from "@/components/providers/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Bolt, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import KickUser from "./kick";
import { useSearchParams } from "next/navigation";

export default function AllMembers() {
  const trpc = useTRPC();
  const { data: user } = useAuthState();

  const [role, setRole] = useState<string | null>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const query = searchParams.get("search");

  useEffect(() => {
    setSearchQuery(query ?? "");
  }, [query]);

  const membersQuery = useQuery(
    trpc.teams.get_members_in_active_team.queryOptions(),
  );

  useEffect(() => {
    authClient.organization.getActiveMemberRole().then((res) => {
      if (!res.error) setRole(res.data.role);
    });

    authClient.organization.listInvitations({}).then((res) => {
      if (!res.error) setPending(res.data ?? []);
    });
  }, []);

  const memberList = membersQuery.data?.members ?? [];

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return memberList;
    return memberList.filter((m) =>
      m.user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [memberList, searchQuery]);

  if (membersQuery.isPending) {
    return (
      <div className="grid gap-3 mt-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton className="h-16 w-full" key={i} />
        ))}
      </div>
    );
  }

  if (!memberList.length) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No members found.
      </p>
    );
  }

  return (
    <div className="grid gap-4 mt-5">
      {filteredMembers.map((member) => (
        <div
          key={member.id}
          className="border bg-background p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Avatar className="rounded-none h-9 w-9 sm:h-10 sm:w-10">
              <AvatarImage src={member.user.image as string} />
              <AvatarFallback className="rounded-none">
                {(member.user.name || "??").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-sm sm:text-base font-medium flex gap-2">
                {member.user.name}
                <Badge variant="secondary">{member.role}</Badge>
              </h1>
              <p className="text-xs sm:text-sm text-foreground/80">
                {member.user.email}
              </p>
            </div>
          </div>

          {user &&
            ((role === "owner" && member.userId !== user.session.userId) ||
              (role === "admin" &&
                member.userId !== user.session.userId &&
                !["owner", "admin"].includes(member.role))) && (
              <div className="flex items-center gap-3">
                <Button size="icon-sm" variant="outline">
                  <Bolt className="size-3.5" />
                </Button>

                <KickUser email={member.user.email}>
                  <Button size="sm" className="h-8 w-8 sm:w-auto">
                    <span className="hidden sm:flex">Kick</span>
                    <LogOut className="size-3.5" />
                  </Button>
                </KickUser>
              </div>
            )}
        </div>
      ))}

      {pending
        .filter((p) => p.status === "pending")
        .map((invite) => (
          <div
            key={invite.id}
            className="border bg-background p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Avatar className="rounded-none h-9 w-9 sm:h-10 sm:w-10">
                <AvatarFallback className="rounded-none">
                  <AlertTriangle className="size-3.5" />
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-sm sm:text-base font-medium flex gap-2">
                  Pending Invite
                  <Badge variant="secondary">{invite.role}</Badge>
                </h1>
                <p className="text-xs sm:text-sm text-foreground/80">
                  {invite.email}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
