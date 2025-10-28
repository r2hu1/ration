import TeamProjectView from "@/modules/dashboard/views/ui/team/team-project-view";

export default async function TeamProjectPage({
  params,
}: {
  params: { projectSlug: string };
}) {
  const param = await params;

  return (
    <div>
      <TeamProjectView projectSlug={param.projectSlug} />
    </div>
  );
}
