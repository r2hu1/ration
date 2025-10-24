"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { FolderCog, Grid2X2, List, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import InviteMembers from "./invite";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "@/components/providers/auth-context";

export default function MembersToolbar({ teamId }: { teamId: string }) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const trpc = useTRPC();
  const { data: user } = useAuthState();
  const { data, isPending, error } = useQuery(
    trpc.teams.get_by_slug.queryOptions({ slug: teamId }),
  );

  const notValidAdmin = (): boolean => {
    const admins = data?.admins as any;
    const owner = data?.owner;
    const isAdmin = admins?.includes(user?.session.userId);
    const isOwner = owner === user?.session.userId;
    return !isAdmin && !isOwner;
  };

  return (
    <div>
      <div className="grid sm:flex w-full gap-3">
        <InputGroup>
          <Search className="size-3.5 ml-2.5" />
          <InputGroupInput type="text" placeholder="Search members" />
        </InputGroup>
        <div className="grid grid-cols-2 sm:flex gap-3">
          <ButtonGroup className="border p-[1.5px]">
            <Button
              onClick={() => setViewType("grid")}
              variant={viewType === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
            >
              <Grid2X2 className="size-4" />
            </Button>
            <Button
              onClick={() => setViewType("list")}
              variant={viewType === "list" ? "secondary" : "ghost"}
              size="icon-sm"
            >
              <List className="size-4" />
            </Button>
          </ButtonGroup>
          <InviteMembers teamId={teamId}>
            <Button disabled={notValidAdmin()}>
              Invite Someone <UserPlus className="ml-auto size-4" />
            </Button>
          </InviteMembers>
        </div>
      </div>
    </div>
  );
}
