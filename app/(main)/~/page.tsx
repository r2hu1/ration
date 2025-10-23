import { isAuthenticated } from "@/lib/cache/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await isAuthenticated();
  return redirect("/~/" + user?.user.name.toLowerCase().split(" ").join("-"));
}
