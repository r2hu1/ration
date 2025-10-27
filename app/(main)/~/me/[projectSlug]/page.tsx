import { Button } from "@/components/ui/button";
import PersonalProjectView from "@/modules/dashboard/views/ui/personal/personal-project-view";
import { Bolt, Copy, Download } from "lucide-react";

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
