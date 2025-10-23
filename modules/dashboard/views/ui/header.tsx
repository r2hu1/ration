"use client";
import { ThemeChanger } from "@/components/ui/theme-changer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/modules/landing/views/ui/logo";
import { Logout } from "@/modules/auth/views/ui/logout";
import User from "@/modules/auth/views/ui/user";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-5 px-6">
      <div>
        <Logo />
      </div>
      <div className="flex items-center gap-2">
        <User />
      </div>
    </header>
  );
}
