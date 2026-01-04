import AppProvider from "@/modules/providers/middleware";

export default async function Layout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { teamId: string };
}) {
  const param = await params;
  return (
    <AppProvider orgId={param.teamId}>
      <main>{children}</main>
    </AppProvider>
  );
}
