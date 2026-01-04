import PersonalProjectView from "@/modules/dashboard/views/ui/personal/personal-project-view";

export default async function PersonalProjectPage({
  params,
}: {
  params: { projectSlug: string };
}) {
  const param = await params;

  return (
    <div>
      <PersonalProjectView projectSlug={param.projectSlug} />
    </div>
  );
}
