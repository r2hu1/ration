import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Personal Workspace",
    template: "Personal Workspace | %s",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
