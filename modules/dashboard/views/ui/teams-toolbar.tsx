"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { FolderCog, Grid2X2, List, Search } from "lucide-react";
import { useEffect, useState } from "react";
import CreateTeamProject from "./team/create-project";

export default function TeamsToolbar({ teamId }: { teamId: string }) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [role, setRole] = useState<string | null>(null);

  const handleViewTypeChange = (type: "grid" | "list") => {
    setViewType(type);

    const params = new URLSearchParams(window.location.search);
    params.set("viewType", type);

    const qs = params.toString();
    const url = qs ? `?${qs}` : window.location.pathname;

    window.history.replaceState(null, "", url);
  };

  const handleSearchQuery = (query: string) => {
    setViewType("grid");

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
    const { data, error } = await authClient.organization.getActiveMemberRole({
      query: {
        organizationId: teamId,
      },
    });
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
            placeholder="Search your projects"
          />
        </InputGroup>
        <div className="grid grid-cols-2 sm:flex gap-3">
          <ButtonGroup className="border p-[1.5px]">
            <Button
              onClick={() => handleViewTypeChange("grid")}
              variant={viewType === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
            >
              <Grid2X2 className="size-4" />
            </Button>
            <Button
              onClick={() => handleViewTypeChange("list")}
              variant={viewType === "list" ? "secondary" : "ghost"}
              size="icon-sm"
            >
              <List className="size-4" />
            </Button>
          </ButtonGroup>
          <CreateTeamProject>
            <Button>
              Create New <FolderCog className="ml-auto size-4" />
            </Button>
          </CreateTeamProject>
        </div>
      </div>
    </div>
  );
}
