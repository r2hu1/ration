"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { useApp } from "@/modules/providers/middleware";
import { useTRPC } from "@/trpc/client";
import TeamSettingsHeader from "./header";
import TeamForm from "./team-form";
import DangerSection from "./danger-section";

export default function TeamSettings({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const { organization } = useApp();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: teamMembers } = useQuery(
    trpc.teams.get_members_in_active_team.queryOptions(),
  );

  const adminCount =
    teamMembers?.members?.filter(
      (m) => m.role === "owner" || m.role === "admin",
    ).length ?? 0;

  const getActiveMemberRole = async () => {
    setLoading(true);
    const { data } = await authClient.organization.getActiveMemberRole();
    setRole(data?.role ?? null);
    setLoading(false);
  };

  const { mutate: deleteAllProjects, isPending: isDeletingProjects } =
    useMutation(
      trpc.teams.delete_all_projects.mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.teams.get_all.queryOptions());
          toast.success("All projects deleted");
          setDeleteProjectsOpen(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }),
    );

  const kickAllMembers = async () => {
    if (!teamMembers?.members) return;
    for (const member of teamMembers.members) {
      await authClient.organization.removeMember({
        memberIdOrEmail: member.userId,
      });
    }
    queryClient.invalidateQueries(
      trpc.teams.get_members_in_active_team.queryOptions(),
    );
    toast.success("All members kicked");
    setKickMembersOpen(false);
  };

  const [deleteProjectsOpen, setDeleteProjectsOpen] = useState(false);
  const [kickMembersOpen, setKickMembersOpen] = useState(false);

  useEffect(() => {
    getActiveMemberRole();
  }, []);

  return (
    <div>
      <TeamSettingsHeader loading={loading} data={role ?? undefined} />

      <div className="mt-8 space-y-8">
        {role === "owner" ||
          (role === "admin" && (
            <TeamForm organization={organization} role={role ?? undefined} />
          ))}

        {(role === "owner" || role === "admin" || role === "member") && (
          <DangerSection
            teamId={slug}
            role={role}
            memberCount={teamMembers?.members?.length ?? 0}
            adminCount={adminCount}
            deleteProjectsOpen={deleteProjectsOpen}
            setDeleteProjectsOpen={setDeleteProjectsOpen}
            kickMembersOpen={kickMembersOpen}
            setKickMembersOpen={setKickMembersOpen}
            isDeletingProjects={isDeletingProjects}
            onDeleteAllProjects={() => deleteAllProjects({ teamId: slug })}
            onKickAllMembers={kickAllMembers}
          />
        )}
      </div>
    </div>
  );
}
