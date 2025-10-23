import { AuthProvider } from "@/components/providers/auth-context";
import Header from "@/modules/dashboard/views/ui/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AuthProvider>
        <Header />
        <div className="px-6 md:px-20 lg:px-28 py-10">{children}</div>
      </AuthProvider>
    </main>
  );
}
