import AcceptInvite from "@/modules/dashboard/views/ui/members/accept-invite";
import EmptyProject from "@/modules/dashboard/views/ui/project/empty";
import TeamsToolbar from "@/modules/dashboard/views/ui/teams-toolbar";

export default async function TeamInvite({
  params,
}: {
  params: { inviteId: string };
}) {
  const param = await params;

  return (
    <div className="flex items-center justify-center py-20">
      <AcceptInvite inviteId={param.inviteId} />
    </div>
  );
}
