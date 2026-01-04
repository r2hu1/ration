import PersonalProjectView from "@/modules/dashboard/views/ui/personal/personal-project-view";

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
    type: "PERSONAL",
  });

  return {
    title: {
      template: `${data?.name} | %s`,
      default: data?.name ?? "My Project",
      description: data?.description ?? "No description.",
    },
  };
};

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
