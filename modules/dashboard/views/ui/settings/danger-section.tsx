"use client";

import { LogOut, Trash2, Users } from "lucide-react";
import {
  FieldSet,
  FieldLegend,
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import ResponsiveModal from "@/modules/shared/components/responsive-modal";
import { Loader } from "@/components/ui/loader";
import LeaveTeam from "@/modules/auth/views/ui/leave-team";

export default function DangerSection({
  teamId,
  role,
  memberCount,
  adminCount,
  deleteProjectsOpen,
  setDeleteProjectsOpen,
  kickMembersOpen,
  setKickMembersOpen,
  isDeletingProjects,
  onDeleteAllProjects,
  onKickAllMembers,
}: {
  teamId: string;
  role?: string;
  memberCount: number;
  adminCount: number;
  deleteProjectsOpen: boolean;
  setDeleteProjectsOpen: (open: boolean) => void;
  kickMembersOpen: boolean;
  setKickMembersOpen: (open: boolean) => void;
  isDeletingProjects: boolean;
  onDeleteAllProjects: () => void;
  onKickAllMembers: () => void;
}) {
  const isOwner = role === "owner";
  const canLeave = role === "member" || role === "admin" || adminCount > 1;

  console.log("DangerSection:", { role, adminCount, canLeave });

  return (
    <FieldSet>
      {canLeave && (
        <div className="rounded-md border border-destructive/20 p-4">
          <Field>
            <FieldContent>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>Leave Team</FieldLabel>
                  <FieldDescription>
                    Leave this team. You will need to be reinvited to join
                    again.
                  </FieldDescription>
                </div>
                <LeaveTeam slug={teamId}>
                  <Button variant="destructive">
                    <LogOut className="size-4" />
                    Leave
                  </Button>
                </LeaveTeam>
              </div>
            </FieldContent>
          </Field>
        </div>
      )}

      {isOwner && (
        <div className="rounded-md border border-destructive/20 p-4">
          <Field className="text-destructive!">
            <FieldContent>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>Delete All Projects</FieldLabel>
                  <FieldDescription>
                    Permanently delete all projects in this team.
                  </FieldDescription>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteProjectsOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Delete All
                </Button>
              </div>
            </FieldContent>
          </Field>

          <Field className="hidden">
            <FieldContent>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>Kick All Members</FieldLabel>
                  <FieldDescription>
                    Remove all members from this team (except yourself). They
                    will need to be reinvited to rejoin.
                  </FieldDescription>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setKickMembersOpen(true)}
                  disabled={memberCount <= 1}
                >
                  <Users className="size-4" />
                  Kick All
                </Button>
              </div>
            </FieldContent>
          </Field>
        </div>
      )}

      {isOwner && (
        <>
          <ResponsiveModal
            open={deleteProjectsOpen}
            onOpenChange={setDeleteProjectsOpen}
            title="Delete All Projects"
            description="Are you sure you want to delete all projects? This action cannot be undone."
            content=""
            confirmText={
              <>
                {isDeletingProjects && <Loader className="size-4" />}
                Delete All Projects
              </>
            }
            cancelText="Cancel"
            onConfirm={onDeleteAllProjects}
            confirmDisabled={isDeletingProjects}
          >
            <div />
          </ResponsiveModal>

          <ResponsiveModal
            open={kickMembersOpen}
            onOpenChange={setKickMembersOpen}
            title="Kick All Members"
            description={`Are you sure you want to kick all ${
              memberCount - 1
            } members from this team? They will need to be reinvited.`}
            content=""
            confirmText={<>Kick All Members</>}
            cancelText="Cancel"
            onConfirm={onKickAllMembers}
          >
            <div />
          </ResponsiveModal>
        </>
      )}
    </FieldSet>
  );
}
