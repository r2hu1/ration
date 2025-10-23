import TeamsNav from "@/modules/dashboard/views/ui/teams-nav";
import TeamsToolbar from "@/modules/dashboard/views/ui/teams-toolbar";

export default async function TeamDashboard({
  params,
}: {
  params: { teamId: string };
}) {
  const param = await params;

  return (
    <div>
      <TeamsToolbar teamId={param.teamId} />
      <h1>Team Dashboard</h1>
    </div>
  );
}
