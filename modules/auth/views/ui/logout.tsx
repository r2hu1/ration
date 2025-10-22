"use client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { signOut } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export const Logout = ({ ...props }) => {
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
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
