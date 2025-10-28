"use client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { authClient, signOut } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const Logout = ({ ...props }) => {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const logout = async () => {
    setLoading(true);
    try {
      const session = await authClient.getSession();
      const token = session?.data?.session?.token;

      await signOut();
      if (token) await authClient.revokeSession({ token });

      if (queryClient) queryClient.clear();

      document.cookie =
        "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message ?? "Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button disabled={loading} onClick={logout} {...props}>
      {loading && <Loader size={4} />}
      Logout
    </Button>
  );
};
