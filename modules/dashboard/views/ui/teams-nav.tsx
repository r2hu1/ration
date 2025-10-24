"use client";

import { useAuthState } from "@/components/providers/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeamsNav() {
  const path = usePathname();
  const parts = path.split("/").filter(Boolean);
  const { data } = useAuthState();

  const tildeIndex = parts.indexOf("~");
  const teamId = parts.length > tildeIndex + 1 ? parts[tildeIndex + 1] : "";
  const subPage = parts.length > tildeIndex + 2 ? parts[tildeIndex + 2] : "";

  const active =
    subPage === ""
      ? "Dashboard"
      : subPage.charAt(0).toUpperCase() + subPage.slice(1);

  // in-future if i want to simplify personal and team dash
  const base = teamId ? `/~/${teamId}` : `/~`;

  const tabs = [
    { label: "Dashboard", href: base },
    { label: "Members", href: `${base}/members` },
    { label: "Settings", href: `${base}/settings` },
    { label: "Danger", href: `${base}/danger` },
  ];

  const [indicatorStyle, setIndicatorStyle] = useState<{
    width: number;
    left: number;
  } | null>(null);

  const updateIndicator = (el: Element | null) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setIndicatorStyle({
        width: rect.width,
        left: rect.left - parentRect.left,
      });
    }
  };

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) =>
    updateIndicator(e.currentTarget);

  const handleLeave = () => {
    const activeEl = document.querySelector(`[data-active="true"]`);
    updateIndicator(activeEl);
  };

  useEffect(() => {
    const activeEl = document.querySelector(`[data-active="true"]`);
    updateIndicator(activeEl);
  }, [active]);

  return (
    <div className="border-b mb-8 px-6">
      <div
        className="flex space-x-8 sm:overflow-auto overflow-x-scroll relative"
        onMouseLeave={handleLeave}
      >
        {tabs
          .filter((tab) =>
            teamId == data?.user?.name?.split(" ").join("-").toLowerCase()
              ? tab.label !== "Members"
              : true,
          )
          .map((tab) => {
            const isActive = active === tab.label;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                onMouseEnter={handleHover}
                data-active={isActive}
                className={`py-2 px-1 z-10 font-medium text-sm transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}

        {indicatorStyle && (
          <div
            className="hidden sm:block absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
            }}
          />
        )}
      </div>
    </div>
  );
}
