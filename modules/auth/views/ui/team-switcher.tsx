"use client";
import { useAuthState } from "@/components/providers/auth-context";
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
import CreateTeam from "@/modules/dashboard/views/ui/create-team";
import { useTRPC } from "@/trpc/client";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamSwitcher() {
  const [position, setPosition] = useState("");
  const { data } = useAuthState();

  const trpc = useTRPC();
  const {
    data: teams,
    error,
    isPending,
  } = useQuery(trpc.teams.get_all.queryOptions());

  const evalRole = (userId: string | undefined, team: any) => {
    return team.owner === userId
      ? "Owner"
      : team.admins?.includes(userId)
        ? "Admin"
        : team.members?.includes(userId)
          ? "Member"
          : team.guests?.includes(userId)
            ? "Guest"
            : "Unknown";
  };

  const router = useRouter();
  const handleTeamSwitch = (e: any) => {
    setPosition(e);
    router.push(`/~/${e}`);
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="bg-secondary/40 sm:min-w-[150px] gap-2"
          size="sm"
        >
          {teams?.filter((team) => team.slug === position)?.[0]?.name ||
            data?.user.name}
          <ChevronsUpDown className="size-3.5 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] ml-[70px]">
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
            <DropdownMenuRadioItem
              value={data?.user?.name.split(" ").join("-").toLowerCase()}
              className="grid gap-px"
            >
              {data?.user?.name}
              <div className="flex items-center justify-between w-full">
                <p className="text-xs">Personal Workspace</p>
                <Badge variant="outline">Owner</Badge>
              </div>
            </DropdownMenuRadioItem>
            {teams?.map((team) => (
              <DropdownMenuRadioItem
                key={team.id}
                value={team.slug}
                className="grid gap-px"
              >
                {team.name}
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs">
                    {Object.keys(team?.projects || {}).length} Projects
                  </p>
                  <Badge variant="outline">
                    {evalRole(data?.session?.userId, team)}
                  </Badge>
                </div>
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
