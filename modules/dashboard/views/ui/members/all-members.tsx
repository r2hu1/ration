"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Bolt, LogOut } from "lucide-react";

export default function AllMembers() {
  const trpc = useTRPC();
  const { data: members, isPending } = useQuery(
    trpc.teams.get_members_in_active_team.queryOptions(),
  );

  return (
    <div className="grid gap-4 mt-5">
      {!isPending &&
        members?.members.map((member) => (
          <div
            className="border bg-background p-4 flex items-center justify-between space-x-4"
            key={member.id}
          >
            <div className="flex items-center space-x-4">
              <Avatar className="rounded-none h-9 w-9 sm:h-10 sm:w-10">
                <AvatarImage src={member.user.image as string} />
                <AvatarFallback className="rounded-none">
                  {member.user.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-px">
                <h1 className="text-sm sm:text-base font-medium">
                  {member.user.name}
                </h1>
                <p className="text-xs sm:text-sm text-foreground/80">
                  {member.user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="h-8 w-8 sm:w-auto">
                <span className="hidden sm:flex">Manage</span>{" "}
                <Bolt className="size-3.5" />
              </Button>
              <Button size="sm" className="h-8 w-8 sm:w-auto">
                <span className="hidden sm:flex">Kick</span>{" "}
                <LogOut className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
