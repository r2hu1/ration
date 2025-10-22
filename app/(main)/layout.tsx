import { AuthProvider } from "@/components/providers/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AuthProvider>{children}</AuthProvider>
    </main>
  );
}
