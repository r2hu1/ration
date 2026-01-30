"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { FolderCog, Grid2X2, List, Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import InviteMembers from "./invite";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "@/components/providers/auth-context";
import { authClient } from "@/lib/auth-client";

export default function MembersToolbar({ teamId }: { teamId: string }) {
  const [role, setRole] = useState<string | null>(null);

  const handleSearchQuery = (query: string) => {
    const params = new URLSearchParams(window.location.search);

    if (!query.trim()) {
      params.delete("search");
    } else {
      params.set("search", query);
    }
    const qs = params.toString();
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  };

  const fetchRole = async () => {
    const { data, error } = await authClient.organization.getActiveMemberRole();
    if (!error) {
      setRole(data.role);
    }
  };
  useEffect(() => {
    fetchRole();
  }, []);

  return (
    <div>
      <div className="grid sm:flex w-full gap-3">
        <InputGroup>
          <Search className="size-3.5 ml-2.5" />
          <InputGroupInput
            onChange={(e) => handleSearchQuery(e.target.value)}
            type="text"
            placeholder="Search members"
          />
        </InputGroup>
        <InviteMembers teamId={teamId}>
          <Button disabled={role == "member"}>
            Invite Someone <UserPlus className="ml-auto size-4" />
          </Button>
        </InviteMembers>
      </div>
    </div>
  );
}
