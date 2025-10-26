import { Button } from "@/components/ui/button";
import { Bolt, Copy, Download } from "lucide-react";

export default async function PersonalProjectPage({
  params,
}: {
  params: { projectSlug: string };
}) {
  const param = await params;

  return (
    <div>
      <div className="mt-6 flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-sm font-medium">Project Name</h1>
          <p className="text-xs text-foreground/80">
            This is a personal project description.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon-sm" variant="outline">
            <Download className="size-3" />
          </Button>
          <Button size="icon-sm" variant="outline">
            <Copy className="size-3" />
          </Button>
          <Button size="icon-sm">
            <Bolt className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
