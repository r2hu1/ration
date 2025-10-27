"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

export default function AddEnvs({ projectSlug }: { projectSlug: string }) {
  return (
    <div className="grid gap-3">
      <div className="flex sm:flex-nowrap flex-wrap items-center gap-3">
        <div className="w-full grid gap-2">
          <Label htmlFor="key" className="text-xs text-foreground/80">
            Key
          </Label>
          <Input id="key" placeholder="DATABASE_URL" />
        </div>
        <div className="w-full grid gap-2">
          <Label htmlFor="value" className="text-xs text-foreground/80">
            Value
          </Label>
          <Input id="value" placeholder="postgresql<user>..." />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline">
            Import .env <FileText className="size-3.5" />
          </Button>
          <p className="hidden sm:flex text-xs text-foreground/80">
            or paste the .env contents above
          </p>
        </div>
        <Button size="sm">Save</Button>
      </div>
    </div>
  );
}
