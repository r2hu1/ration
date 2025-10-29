"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import ResponsiveModal from "@/modules/shared/components/responsive-modal";

export default function CreateTeam({
  children,
}: {
  children: React.ReactNode;
}) {
  const [name, setName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.teams.create.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleTeamCreation = () => {
    mutate(
      { name: name.replace(/\s+/g, "-").toLowerCase() },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
          setName("");
        },
        onSettled: () => {
          setModalOpen(false);
        },
      },
    );
  };

  if (error) {
    toast.error(error.message);
  }

  const content = (
    <div className="py-2 grid gap-2">
      <Label>Team Name</Label>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
        placeholder="Unique Team"
      />
    </div>
  );

  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      title="Create Team"
      description="A team can have multiple members and can be used to organize and share projects."
      content={content}
      confirmText={
        <>
          {isPending && <Loader />}
          Continue
        </>
      }
      cancelText="Cancel"
      onConfirm={handleTeamCreation}
      confirmDisabled={isPending}
      cancelDisabled={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
