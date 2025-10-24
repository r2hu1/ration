"use client";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isPending, refetch } = useSession();
  const router = useRouter();
  const path = usePathname();

  const parts = path.split("/").filter(Boolean);
  const tildeIndex = parts.indexOf("~");
  const teamId = parts.length > tildeIndex + 1 ? parts[tildeIndex + 1] : "";

  const trpc = useTRPC();
  const {
    data: teams,
    error: teamsError,
    isPending: teamsIsPending,
  } = useQuery(
    trpc.teams.get_by_slug.queryOptions({
      slug: teamId,
    }),
  );

  useEffect(() => {
    if (!isPending && !data?.session) {
      router.push(
        "/auth/login-or-create-account?callbackURL=" +
          encodeURIComponent(window.location.href),
      );
    }
  }, [isPending]);

  if (teamsError) {
    router.push("/~/");
  }

  return (
    <AuthContext.Provider value={{ data, error, isPending, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);
