import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AppProvider from "@/modules/providers/middleware";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) => {
  const param = await params;
  const data = await auth.api.getFullOrganization({
    query: {
      organizationId: param.teamId,
    },
    headers: await headers(),
  });
  return {
    title: {
      template: `${data?.name} | %s`,
      default: data?.name ?? "My Team",
    },
    openGraph: {
      title: data?.name,
      siteName: data?.name,
    },
  };
};

export default async function Layout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ teamId: string }>;
}) {
  const param = await params;
  return (
    <AppProvider orgId={param.teamId}>
      <main>{children}</main>
    </AppProvider>
  );
}
