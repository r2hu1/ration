import Header from "@/modules/landing/views/ui/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
