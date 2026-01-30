import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeChanger } from "@/components/ui/theme-changer";
import { Logo } from "./logo";

export default function Header() {
  return (
    <header className="flex items-center justify-between max-w-5xl mx-auto px-6 py-5">
      <Logo />
      <div className="flex items-center gap-2">
        <Button size="sm" asChild>
          <Link href="/auth/login-or-create-account">Get Started</Link>
        </Button>
        <ThemeChanger />
      </div>
    </header>
  );
}
