"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import ResponsiveModal from "@/modules/shared/components/responsive-modal";
import { useTRPC } from "@/trpc/client";

export default function ChangeRole({
  memberId,
  memberName,
  currentRole,
  children,
}: {
  memberId: string;
  memberName: string;
  currentRole: string;
  children: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleChangeRole = async () => {
    setLoading(true);
    const { error } = await authClient.organization.updateMemberRole({
      memberId,
      role: selectedRole,
    });

    if (!error) {
      toast.success(`Role changed to ${selectedRole}`);
      queryClient.invalidateQueries(
        trpc.teams.get_members_in_active_team.queryOptions(),
      );
      setModalOpen(false);
    } else {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const roles = ["member", "admin", "owner"];

  const handleOpen = (open: boolean) => {
    setModalOpen(open);
    if (open) {
      setSelectedRole(currentRole);
    }
  };

  return (
    <>
      <div onClick={() => setModalOpen(true)}>{children}</div>

      <ResponsiveModal
        open={modalOpen}
        onOpenChange={handleOpen}
        title="Change Role"
        description={`Select a new role for ${memberName}.`}
        content={
          <div className="flex flex-col gap-3 py-4">
            {roles.map((role) => (
              <label
                key={role}
                className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedRole === role
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={() => setSelectedRole(role)}
                  className="sr-only"
                />
                <div
                  className={`h-4 w-4 rounded-full border ${
                    selectedRole === role
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium capitalize">{role}</span>
                  <span className="text-xs text-muted-foreground">
                    {role === "owner" && "Full control, can delete team"}
                    {role === "admin" && "Manage members, edit team"}
                    {role === "member" && "Basic access"}
                  </span>
                </div>
              </label>
            ))}
          </div>
        }
        confirmText={
          <>
            {loading && <Loader className="mr-2 h-4 w-4" />}
            Change to {selectedRole}
          </>
        }
        cancelText="Cancel"
        onConfirm={handleChangeRole}
        confirmDisabled={loading || selectedRole === currentRole}
        cancelDisabled={loading}
      >
        <div />
      </ResponsiveModal>
    </>
  );
}
