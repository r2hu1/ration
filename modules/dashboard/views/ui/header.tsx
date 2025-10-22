"use client";
import { ThemeChanger } from "@/components/ui/theme-changer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/modules/landing/views/ui/logo";
import { Logout } from "@/modules/auth/views/ui/logout";

export default function Header() {
  return (
    <header className="flex items-center justify-between max-w-5xl mx-auto px-6 py-5">
      <Logo />
      <div className="flex items-center gap-2">
        <Logout size="sm" />
        <ThemeChanger />
      </div>
    </header>
  );
}
