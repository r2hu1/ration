"use client";

import type {
  Invitation,
  Member,
  Organization,
  OrganizationOptions,
} from "better-auth/plugins";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface OrganizationContext extends Organization {
  members: Member[];
  invitations: Invitation[];
}

interface AppContextValue {
  organization: OrganizationContext | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export default function AppProvider({
  orgId,
  children,
}: {
  orgId?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const activeOrg = authClient.useActiveOrganization();

  useEffect(() => {
    if (!orgId) return;
    if (activeOrg.isPending) return;

    let cancelled = false;

    async function run() {
      if (activeOrg.data?.id === orgId) return;

      const { data, error } = await authClient.organization.getFullOrganization(
        {
          query: { organizationId: orgId },
        },
      );

      if (cancelled) return;

      if (error || !data) {
        router.replace("/");
        return;
      }

      if (activeOrg.data?.id && activeOrg.data.id !== data.id) {
        router.replace(`/~/${activeOrg.data.slug}`);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [orgId, activeOrg.data?.id, activeOrg.isPending, router]);

  return (
    <AppContext.Provider
      value={{
        organization: activeOrg.data ?? null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
