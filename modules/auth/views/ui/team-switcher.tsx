"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "@/components/providers/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { authClient } from "@/lib/auth-client";
import CreateTeam from "@/modules/dashboard/views/ui/create-team";
import { useTRPC } from "@/trpc/client";

export default function TeamSwitcher() {
  const { data: auth } = useAuthState();
  const trpc = useTRPC();
  const router = useRouter();

  const { data: teams } = useQuery(trpc.teams.get_all.queryOptions());
  const { data: activeOrg } = authClient.useActiveOrganization();

  const [value, setValue] = useState("me");

  useEffect(() => {
    if (!teams) return;

    Promise.all(teams.map((t) => router.prefetch(`/~/${t.id}`)));

    if (activeOrg?.id) {
      setValue(activeOrg.id);
    } else {
      setValue("me");
    }
  }, [teams, activeOrg?.id, router]);

  const handleSwitch = async (id: string) => {
    setValue(id);

    if (id === "me") {
      await authClient.organization.setActive({ organizationId: null });
      router.push("/~/me");
      return;
    }

    await authClient.organization.setActive({ organizationId: id });
    router.push(`/~/${id}`);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="bg-secondary/40 sm:min-w-[150px] gap-2"
        >
          {activeOrg?.name ?? auth?.user?.name}
          <ChevronsUpDown className="ml-auto size-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="sm:w-[300px] sm:ml-[70px]">
        <DropdownMenuLabel className="flex items-center">
          Select or create team <Users className="ml-auto size-4" />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScrollArea className="max-h-64">
          <DropdownMenuRadioGroup value={value} onValueChange={handleSwitch}>
            <DropdownMenuRadioItem value="me" className="grid gap-px">
              {auth?.user?.name}
              <div className="flex items-center justify-between">
                <p className="text-xs">Personal Workspace</p>
                <Badge variant="outline">Owner</Badge>
              </div>
            </DropdownMenuRadioItem>

            {teams?.map((team) => (
              <DropdownMenuRadioItem
                key={team.id}
                value={team.id}
                className="grid gap-2"
              >
                {team.name}
                <p className="text-xs text-foreground/80 flex justify-between">
                  created on
                  <span className="text-foreground/60">
                    {new Date(team.createdAt).toDateString()}
                  </span>
                </p>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <ScrollBar />
        </ScrollArea>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
          <CreateTeam>
            <Button variant="ghost" size="sm" className="w-full">
              Create Team <Plus className="ml-auto size-4" />
            </Button>
          </CreateTeam>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
