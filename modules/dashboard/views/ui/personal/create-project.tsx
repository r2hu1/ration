"use client";

import CreateProject from "@/modules/shared/components/create-project";

export default function CreatePersonalProject({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CreateProject projectType="PERSONAL">{children}</CreateProject>;
}
