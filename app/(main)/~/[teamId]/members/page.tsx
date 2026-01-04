import AllMembers from "@/modules/dashboard/views/ui/members/all-members";
import MembersToolbar from "@/modules/dashboard/views/ui/members/members-toolbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Members",
};

export default async function Members({
  params,
}: {
  params: { teamId: string };
}) {
  const param = await params;
  return (
    <div>
      <MembersToolbar teamId={param.teamId} />
      <div className="mt-6">
        <h1 className="text-sm font-medium">Members</h1>
      </div>
      <AllMembers />
    </div>
  );
}
