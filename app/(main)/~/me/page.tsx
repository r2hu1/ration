import AllPersonalProjects from "@/modules/dashboard/views/ui/personal/all-projects";
import PersonalToolbar from "@/modules/dashboard/views/ui/personal-toolbar";

export default async function PersonalDashboard() {
  return (
    <div>
      <PersonalToolbar />
      <div className="mt-6">
        <h1 className="text-sm font-medium">Projects</h1>
      </div>
      <div className="mt-5">
        <AllPersonalProjects />
      </div>
    </div>
  );
}
