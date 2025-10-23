import { AuthProvider } from "@/components/providers/auth-context";
import Header from "@/modules/dashboard/views/ui/header";
import { TRPCReactProvider } from "@/trpc/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <AuthProvider>
        <Header />
        <div className="px-6 md:px-10">{children}</div>
      </AuthProvider>
    </TRPCReactProvider>
  );
}
