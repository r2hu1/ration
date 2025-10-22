import { AuthProvider } from "@/components/providers/auth-context";
import Header from "@/modules/dashboard/views/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AuthProvider>
        <Header />
        <div className="px-6 max-w-5xl mx-auto py-20">{children}</div>
      </AuthProvider>
    </main>
  );
}
