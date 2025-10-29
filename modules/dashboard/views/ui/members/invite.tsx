"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveModal from "@/modules/shared/components/responsive-modal";

export default function InviteMembers({
  children,
  teamId,
}: {
  children: React.ReactNode;
  teamId: string;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<any>("member");
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.teams.invite.mutationOptions(),
  );

  const handleTeamInvite = () => {
    mutate(
      { email: email.trim(), teamId: teamId, role: role },
      {
        onSettled: () => {
          setModalOpen(false);
          setRole("member");
          setEmail("");
        },
        onSuccess: () => {
          toast.success("Collaborator invitation sent successfully");
        },
      },
    );
  };

  if (error) {
    toast.error(error.message);
  }

  const content = (
    <div className="py-2 grid gap-2">
      <Label>Email</Label>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full"
        placeholder="name@domain.com"
      />
      <Label>Role</Label>
      <Select value={role} onValueChange={(value) => setRole(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="member" className="flex items-center">
              Member
            </SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs text-foreground/80">
        {role == "admin" &&
          "Can create, view, edit projects, invite collaborators."}
        {role == "member" && "Can create, view, edit projects."}
        {role == "owner" &&
          "Full access to all projects, members and this organization."}
      </p>
    </div>
  );

  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      title="Invite Collaborator"
      description="Enter the email address of the person you want to invite and select their role."
      content={content}
      confirmText={
        <>
          {isPending && <Loader />}
          Continue
        </>
      }
      cancelText="Cancel"
      onConfirm={handleTeamInvite}
      confirmDisabled={isPending}
      cancelDisabled={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
