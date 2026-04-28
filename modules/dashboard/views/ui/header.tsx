"use client";
import { Bell, Container, Star } from "lucide-react";
import Link from "next/link";
import { ThemeChanger } from "@/components/ui/theme-changer";
import { Logout } from "@/modules/auth/views/ui/logout";
import TeamSwitcher from "@/modules/auth/views/ui/team-switcher";
import User from "@/modules/auth/views/ui/user";
import { Logo } from "@/modules/landing/views/ui/logo";
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
          <User />
        </div>
      </div>
      <TeamsNav />
    </header>
  );
}
