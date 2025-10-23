import MembersToolbar from "@/modules/dashboard/views/ui/members/members-toolbar";

export default async function Members({
  params,
}: {
  params: { teamId: string };
}) {
  const param = await params;
  console.log(param.teamId);
  return (
    <div>
      <MembersToolbar teamId={param.teamId} />
      <div className="mt-6">
        <h1 className="text-sm font-medium">Members</h1>
      </div>
    </div>
  );
}
