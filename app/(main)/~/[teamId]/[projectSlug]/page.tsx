import TeamProjectView from "@/modules/dashboard/views/ui/team/team-project-view";
import { caller } from "@/trpc/caller";
import { trpc } from "@/trpc/server";

export const generateMetadata = async ({
  params,
}: {
  params: { projectSlug: string };
}) => {
  const param = await params;
  const data = await caller.projects.get_by_slug({
    slug: param.projectSlug,
    type: "TEAM",
  });

  return {
    title: {
      template: `${data?.name} | %s`,
      default: data?.name ?? "My Project",
      description: data?.description ?? "No description.",
    },
  };
};

export default async function TeamProjectPage({
  params,
}: {
  params: { projectSlug: string };
}) {
  return (
    <div>
      <TeamProjectView projectSlug={params.projectSlug} />
    </div>
  );
}
