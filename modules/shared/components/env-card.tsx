"use client";
import {
  Copy,
  Edit,
  EllipsisVertical,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import DeleteEnv from "./delete-env";
import EditEnv from "./edit-env";

interface EnvCardProps {
  kkey: string;
  value: string;
  projectSlug: string;
  projectType: "PERSONAL" | "TEAM";
}

export default function EnvCard({
  kkey,
  value,
  projectSlug,
  projectType,
}: EnvCardProps) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(`${key}=${value}`);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const toggleView = (kkey: string) => {
    setVisible((prev) => ({ ...prev, [kkey]: !prev[kkey] }));
  };
  return (
    <div
      key={kkey}
      className="flex bg-background sm:flex-nowrap flex-wrap items-center justify-between gap-3 border p-3 pl-5"
    >
      <h1 className="font-medium text-sm w-full">{kkey}</h1>
      <div className="flex items-center w-full">
        <InputGroup className="border-0 w-full flex items-center justify-between active:ring-0 active:border-0 active:outline-0">
          <InputGroupButton onClick={() => toggleView(kkey)}>
            {visible[kkey] ? (
              <EyeOff className="size-3" />
            ) : (
              <Eye className="size-3" />
            )}
          </InputGroupButton>
          <InputGroupInput
            className="border-0 active:ring-0 active:border-0 active:outline-0"
            value={String(value)}
            type={visible[kkey] ? "text" : "password"}
            readOnly
          />
          <InputGroupButton onClick={() => handleCopy(kkey, String(value))}>
            <Copy className="size-3" />
          </InputGroupButton>
        </InputGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost">
              <EllipsisVertical className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditEnv
              projectSlug={projectSlug}
              projectType={projectType}
              currentKey={kkey}
              currentValue={value}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="size-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
            </EditEnv>
            <DropdownMenuSeparator />
            <DeleteEnv
              projectSlug={projectSlug}
              projectType={projectType}
              envKey={kkey}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="size-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DeleteEnv>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
