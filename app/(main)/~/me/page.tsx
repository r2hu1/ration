import PersonalToolbar from "@/modules/dashboard/views/ui/personal-toolbar";
import EmptyProject from "@/modules/dashboard/views/ui/project/empty";

export default async function PersonalDashboard() {
  return (
    <div>
      <PersonalToolbar />
      <div className="mt-6">
        <h1 className="text-sm font-medium">Projects</h1>
      </div>
      <EmptyProject />
      <div className="mt-5"></div>
    </div>
  );
}
