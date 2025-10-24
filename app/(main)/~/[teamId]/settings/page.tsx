import TeamSettings from "@/modules/dashboard/views/ui/settings";

export default async function Settings({
  params,
}: {
  params: { teamId: string };
}) {
  const param = await params;
  return (
    <div>
      <TeamSettings slug={param.teamId} />
    </div>
  );
}
