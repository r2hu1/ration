"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isPending, refetch } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !data?.session) {
      router.push(
        "/auth/login-or-create-account?callbackURL=" +
          encodeURIComponent(window.location.href),
      );
    }
  }, [isPending]);

  return (
    <AuthContext.Provider value={{ data, error, isPending, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);
