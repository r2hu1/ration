"use client";
import { useAuthState } from "@/components/providers/auth-context";
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
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

export default function TeamSwitcher() {
  const [position, setPosition] = useState("default");
  const { data } = useAuthState();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {" "}
          {data?.user?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 ml-[70px]">
        <DropdownMenuLabel className="flex items-center">
          Select or Create team <Users className="size-4 ml-auto" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="default">
            {data?.user?.name}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0 border-0 outline-0">
          <Button variant="outline" className="w-full" size="sm">
            Create Team <Plus className="size-4 ml-auto" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
