import DangerPageView from "@/modules/dashboard/views/ui/danger/danger-page-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danger",
};

export default async function DangerPage({
  params,
}: {
  params: { teamId: string };
}) {
  const param = await params;

  return (
    <div>
      <DangerPageView teamId={param.teamId} />
    </div>
  );
}
