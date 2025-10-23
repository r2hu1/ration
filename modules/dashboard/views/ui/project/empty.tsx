import { AlertTriangle } from "lucide-react";

export default function EmptyProject() {
  return (
    <div className="flex mt-5 items-center justify-center border h-[300px] w-full">
      <div className="text-center grid gap-2">
        <AlertTriangle className="size-4 mx-auto" />
        <h1 className="text-sm -mb-1 mt-px text-foreground/90">
          No projects found
        </h1>
        <p className="text-xs text-foreground/70">
          Create a new project to get started.
        </p>
      </div>
    </div>
  );
}
