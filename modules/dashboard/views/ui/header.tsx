"use client";
import { ThemeChanger } from "@/components/ui/theme-changer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/modules/landing/views/ui/logo";
import { Logout } from "@/modules/auth/views/ui/logout";
import User from "@/modules/auth/views/ui/user";
import { Bell, Container, Star } from "lucide-react";
import TeamSwitcher from "@/modules/auth/views/ui/team-switcher";
import TeamsNav from "./teams-nav";

export default function Header() {
  return (
    <header className="bg-background">
      <div className="px-6 flex items-center justify-between py-4 pb-2">
        <div className="flex items-center gap-2">
          <Container className="h-4! w-4!" />
          <span className="text-foreground/40 text-sm">/</span>
          <TeamSwitcher />
        </div>
        <div className="flex items-center gap-2.5">
          <Button size="icon-sm" variant="outline">
            <Bell size="4" />
          </Button>
          <User />
        </div>
      </div>
      <TeamsNav />
    </header>
  );
}
