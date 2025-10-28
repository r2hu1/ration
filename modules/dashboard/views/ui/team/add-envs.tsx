"use client";

import { useState, ClipboardEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Loader } from "@/components/ui/loader";

interface Env {
  key: string;
  value: string;
}

export default function AddEnvs({ projectSlug }: { projectSlug: string }) {
  const [envs, setEnvs] = useState<Env[]>([{ key: "", value: "" }]);

  const handleAdd = () => setEnvs([...envs, { key: "", value: "" }]);
  const handleRemove = (index: number) =>
    setEnvs(envs.filter((_, i) => i !== index));
  const handleChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const updated = [...envs];
    updated[index][field] = value;
    setEnvs(updated);
  };

  const parseEnvText = (text: string) => {
    const lines = text.split("\n");
    const parsed: Env[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (!key) continue;
      parsed.push({
        key: key.trim(),
        value: rest
          .join("=")
          .trim()
          .replace(/^['"]|['"]$/g, ""),
      });
    }
    if (parsed.length) setEnvs(parsed);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.includes("\n") && text.includes("=")) {
      e.preventDefault();
      parseEnvText(text);
      toast.success("Loaded environment variables from clipboard");
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    parseEnvText(text);
    toast.success("Loaded environment variables from file");
  };

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.projects.update_by_slug.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleSave = async () => {
    const filtered = envs.filter(
      (e) => e.key.trim() !== "" && e.value.trim() !== "",
    );
    mutate(
      {
        slug: projectSlug,
        envs: Object.fromEntries(
          filtered.map(({ key, value }) => [key, value]),
        ),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.projects.get_by_slug.queryOptions({
              slug: projectSlug,
              type: "TEAM",
            }),
          );
          setEnvs([{ key: "", value: "" }]);
          toast.success("Saved environment variables");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
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
                value={env.key}
                onChange={(e) => handleChange(index, "key", e.target.value)}
                onPaste={index === 0 ? handlePaste : undefined}
                placeholder="DATABASE_URL"
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
                value={env.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                onPaste={index === 0 ? handlePaste : undefined}
                placeholder="postgresql://user:password@localhost/db"
              />
            </div>
          </div>
          {index === 0 ? (
            <Button size="icon" variant="outline" onClick={handleAdd}>
              <Plus />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleRemove(index)}
            >
              <Minus />
            </Button>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline">
            <label className="flex items-center gap-2 cursor-pointer">
              Import .env <FileText className="size-3.5" />
              <input
                type="file"
                accept=".env,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
          <p className="hidden sm:flex text-xs text-foreground/80">
            or paste the .env contents above
          </p>
        </div>
        <Button size="sm" disabled={isPending} onClick={handleSave}>
          {isPending && <Loader />}
          Save
        </Button>
      </div>
    </div>
  );
}
