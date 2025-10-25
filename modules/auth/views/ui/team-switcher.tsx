"use client";

import { useAuthState } from "@/components/providers/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeamSwitcher() {
  const [position, setPosition] = useState("");
  const { data } = useAuthState();

  const trpc = useTRPC();
  const { data: teams, isPending } = useQuery(
    trpc.teams.get_all.queryOptions(),
  );

  const path = usePathname();
  const teamId = path.split("/")[2];
  const router = useRouter();

  const handleTeamSwitch = async (slug: string) => {
    if (slug == "me") {
      setPosition("me");
      const { data, error } = await authClient.organization.setActive({
        organizationId: null,
      });
      router.push(`/~/me`);
    }
    const { data, error } = await authClient.organization.setActive({
      organizationSlug: slug,
    });
    setPosition(slug);
    router.push(`/~/${slug}`);
  };

  const { data: activeOrganization } = authClient.useActiveOrganization();
  useEffect(() => {
    const filterByName = teams?.filter(
      (t) => t.name === activeOrganization?.name,
    )[0] as any;
    setPosition(filterByName?.slug ? filterByName.slug : "me");
  }, [activeOrganization]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="bg-secondary/40 sm:min-w-[150px] gap-2"
          size="sm"
        >
          {activeOrganization?.name || data?.user?.name}
          <ChevronsUpDown className="size-3.5 ml-auto" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="sm:w-[300px] sm:ml-[70px]">
        <DropdownMenuLabel className="flex items-center">
          Select or create team <Users className="size-4 ml-auto" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea>
          <DropdownMenuRadioGroup
            value={position}
            onValueChange={handleTeamSwitch}
            className="max-h-64"
          >
            <DropdownMenuRadioItem value="me" className="grid gap-px">
              {data?.user?.name}
              <div className="flex items-center gap-3 justify-between w-full">
                <p className="text-xs">Personal Workspace</p>
                <Badge variant="outline">Owner</Badge>
              </div>
            </DropdownMenuRadioItem>

            {teams?.map((team) => (
              <DropdownMenuRadioItem
                key={team.id}
                value={team.slug}
                className="grid gap-2"
              >
                {team.name}
                <p className="text-xs text-foreground/80 flex items-center justify-between">
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

        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="p-0 border-0 outline-0"
        >
          <CreateTeam>
            <Button variant="ghost" className="w-full" size="sm">
              Create Team <Plus className="size-4 ml-auto" />
            </Button>
          </CreateTeam>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
