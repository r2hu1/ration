"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { useTRPC } from "@/trpc/client";
import ResponsiveModal from "./responsive-modal";

interface EditEnvProps {
  children: React.ReactNode;
  projectSlug: string;
  projectType: "PERSONAL" | "TEAM";
  currentKey: string;
  currentValue: string;
}

export default function EditEnv({
  children,
  projectSlug,
  projectType,
  currentKey,
  currentValue,
}: EditEnvProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newKey, setNewKey] = useState(currentKey);
  const [newValue, setNewValue] = useState(currentValue);

  const trpc = useTRPC();
  const { mutate, isPending, error } = useMutation(
    trpc.projects.update_by_slug.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleEditEnv = () => {
    const updates: any = {
      slug: projectSlug,
      projectType,
    };

    if (newKey !== currentKey) {
      updates.deleteEnvKeys = [currentKey];
      updates.envs = { [newKey]: newValue };
    } else {
      updates.envs = { [newKey]: newValue };
    }

    mutate(updates, {
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.projects.get_by_slug.queryOptions({
            slug: projectSlug,
            type: projectType,
          }),
        );
        setModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update environment variable");
      },
    });
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setNewKey(currentKey);
      setNewValue(currentValue);
    }
    setModalOpen(open);
  };

  if (error) {
    toast.error(error.message);
  }

  const content = (
    <div className="py-2 grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="env-key">Key</Label>
        <Input
          id="env-key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="DATABASE_URL"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="env-value">Value</Label>
        <Input
          id="env-value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="postgresql://user:password@localhost/db"
        />
      </div>
    </div>
  );

  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={handleModalClose}
      title="Edit Environment Variable"
      description="Update the key and value for this environment variable."
      content={content}
      confirmText={
        <>
          {isPending && <Loader />}
          Save Changes
        </>
      }
      cancelText="Cancel"
      onConfirm={handleEditEnv}
      confirmDisabled={isPending || !newKey.trim() || !newValue.trim()}
      cancelDisabled={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
