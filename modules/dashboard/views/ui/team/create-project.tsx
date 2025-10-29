"use client";

import CreateProject from "@/modules/shared/components/create-project";

export default function CreateTeamProject({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CreateProject projectType="TEAM">{children}</CreateProject>;
}
