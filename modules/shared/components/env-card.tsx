"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Copy, EllipsisVertical, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EnvCard({
  kkey,
  value,
}: {
  kkey: string;
  value: string;
}) {
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
        <Button size="icon-sm" variant="ghost">
          <EllipsisVertical className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
