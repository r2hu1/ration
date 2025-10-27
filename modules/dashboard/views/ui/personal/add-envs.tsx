"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Minus, Plus } from "lucide-react";

interface Env {
  key: string;
  value: string;
}

export default function AddEnvs({ projectSlug }: { projectSlug: string }) {
  const [envs, setEnvs] = useState<Env[]>([{ key: "", value: "" }]);

  const handleAdd = () => {
    setEnvs([...envs, { key: "", value: "" }]);
  };

  const handleRemove = (index: number) => {
    setEnvs(envs.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const updated = [...envs];
    updated[index][field] = value;
    setEnvs(updated);
  };

  const handleSave = () => {
    const envObject = Object.fromEntries(envs.map((e) => [e.key, e.value]));
    console.log("Saving envs for:", projectSlug, envObject);
  };

  return (
    <div className="grid gap-4">
      {envs.map((env, index) => (
        <div
          key={index}
          className="flex flex-wrap sm:flex-nowrap items-end w-full gap-3"
        >
          <div className="flex sm:flex-nowrap flex-wrap items-center gap-4 w-full">
            <div className="w-full grid gap-2">
              <Label
                htmlFor={`key-${index}`}
                className="text-xs text-foreground/80"
              >
                Key
              </Label>
              <Input
                id={`key-${index}`}
                placeholder="DATABASE_URL"
                value={env.key}
                onChange={(e) => handleChange(index, "key", e.target.value)}
              />
            </div>
            <div className="w-full grid gap-2">
              <Label
                htmlFor={`value-${index}`}
                className="text-xs text-foreground/80"
              >
                Value
              </Label>
              <Input
                id={`value-${index}`}
                placeholder="postgresql://user:pass@localhost/db"
                value={env.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
              />
            </div>
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={() => (index === 0 ? handleAdd() : handleRemove(index))}
          >
            {index === 0 ? <Plus /> : <Minus />}
          </Button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline">
            Import .env <FileText className="size-3.5" />
          </Button>
          <p className="hidden sm:flex text-xs text-foreground/80">
            or paste the .env contents above
          </p>
        </div>
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
