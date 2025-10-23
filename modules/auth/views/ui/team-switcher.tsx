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
import CreateTeam from "@/modules/dashboard/views/ui/create-team";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

export default function TeamSwitcher() {
  const [position, setPosition] = useState("default");
  const { data } = useAuthState();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="bg-secondary/50" size="sm">
          {" "}
          {data?.user?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] ml-[70px]">
        <DropdownMenuLabel className="flex items-center">
          Select or Create team <Users className="size-4 ml-auto" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="default" className="grid gap-px">
            {data?.user?.name}
            <div className="flex items-center justify-between w-full">
              <p className="text-xs">Personal Workspace</p>
              <Badge variant="outline">Owner</Badge>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
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
