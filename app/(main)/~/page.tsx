import { auth } from "@/lib/auth";
import { isAuthenticated } from "@/lib/cache/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const sess = await auth.api.getSession({ headers: await headers() });
  if (!sess?.session) return redirect("/");

  const data = await auth.api.getFullOrganization({
    headers: await headers(),
  });
  return redirect(data?.slug ? `/~/${data?.slug}` : "/~/me");
}
