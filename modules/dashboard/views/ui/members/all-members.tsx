"use client";

import { useAuthState } from "@/components/providers/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Bolt, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function AllMembers() {
  const trpc = useTRPC();
  const [role, setRole] = useState<string | null>(null);
  const { user } = useAuthState();
  const { data: members, isPending } = useQuery(
    trpc.teams.get_members_in_active_team.queryOptions(),
  );

  const getRole = async () => {
    const { data, error } = await authClient.organization.getActiveMemberRole();
    if (!error) {
      setRole(data.role);
    }
  };
  useEffect(() => {
    getRole();
  }, []);

  if (isPending)
    return (
      <div className="flex items-center justify-center text-center py-20 text-sm text-muted-foreground border my-5">
        <div className="grid text-center gap-1">
          <Loader />
          Loading members...
        </div>
      </div>
    );

  const memberList = members?.members ?? [];
  if (!memberList.length)
    return (
      <p className="text-center text-sm text-muted-foreground">
        No members found.
      </p>
    );

  return (
    <div className="grid gap-4 mt-5">
      {memberList.map((member) => (
        <div
          className="border bg-background p-4 flex items-center justify-between space-x-4"
          key={member.id}
        >
          <div className="flex items-center space-x-4">
            <Avatar className="rounded-none h-9 w-9 sm:h-10 sm:w-10">
              <AvatarImage src={member.user.image as string} />
              <AvatarFallback className="rounded-none">
                {(member.user.name || "??").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-px">
              <h1 className="text-sm flex items-center gap-2 sm:text-base font-medium">
                {member.user.name}
                <Badge variant="secondary">{member.role}</Badge>
              </h1>
              <p className="text-xs sm:text-sm text-foreground/80">
                {member.user.email}
              </p>
            </div>
          </div>
          {(role == "admin" || role == "owner") &&
            (member.role === "admin" || member.role === "member") && (
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 sm:w-auto"
                >
                  <span className="hidden sm:flex">Manage</span>
                  <Bolt className="size-3.5" />
                </Button>
                <Button size="sm" className="h-8 w-8 sm:w-auto">
                  <span className="hidden sm:flex">Kick</span>
                  <LogOut className="size-3.5" />
                </Button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
