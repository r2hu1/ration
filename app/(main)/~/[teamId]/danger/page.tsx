import DangerPageView from "@/modules/dashboard/views/ui/danger/danger-page-view";

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
