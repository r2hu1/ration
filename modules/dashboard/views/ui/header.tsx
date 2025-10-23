"use client";
import { ThemeChanger } from "@/components/ui/theme-changer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/modules/landing/views/ui/logo";
import { Logout } from "@/modules/auth/views/ui/logout";
import User from "@/modules/auth/views/ui/user";
import { Container, Star } from "lucide-react";
import TeamSwitcher from "@/modules/auth/views/ui/team-switcher";
import TeamsNav from "./teams-nav";

export default function Header() {
  return (
    <header className="px-6">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Container className="h-4! w-4!" />
          <span className="text-foreground/40 text-sm">/</span>
          <TeamSwitcher />
        </div>
        <div className="flex items-center gap-2.5">
          <Button asChild size="icon-sm" variant="outline">
            <Link href="https://github.com/r2hu1/ration" target="_blank">
              <Star size="4" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="https://github.com/r2hu1/ration/issues" target="_blank">
              Feedback
            </Link>
          </Button>
          <User />
        </div>
      </div>
      <TeamsNav />
    </header>
  );
}
