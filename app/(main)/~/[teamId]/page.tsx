import EmptyProject from "@/modules/dashboard/views/ui/project/empty";
import AllTeamProjects from "@/modules/dashboard/views/ui/team/all-projects";
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
      <div className="mt-6">
        <h1 className="text-sm font-medium">Projects</h1>
      </div>
      <div className="mt-5">
        <AllTeamProjects slug={param.teamId}/>
      </div>
    </div>
  );
}
