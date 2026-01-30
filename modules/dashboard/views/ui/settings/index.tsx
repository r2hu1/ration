"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import TeamSettingsHeader from "./header";

export default function TeamSettings({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<any | null>(null);

  const getActiveMemberRole = async () => {
    setLoading(true);
    const { data, error } = await authClient.organization.getActiveMemberRole();
    setRole(data?.role);
    setLoading(false);
  };
  useEffect(() => {
    getActiveMemberRole();
  }, []);

  return (
    <div>
      <TeamSettingsHeader loading={loading} data={role} />
    </div>
  );
}
