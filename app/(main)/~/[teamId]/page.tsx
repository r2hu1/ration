import EmptyProject from "@/modules/dashboard/views/ui/project/empty";
import TeamsNav from "@/modules/dashboard/views/ui/teams-nav";
import TeamsToolbar from "@/modules/dashboard/views/ui/teams-toolbar";
import { AlertTriangle } from "lucide-react";

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
      <EmptyProject />
      <div className="mt-5"></div>
    </div>
  );
}
