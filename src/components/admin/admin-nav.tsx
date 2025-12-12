"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  match?: string[];
  exact?: boolean;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/ngos", label: "NGOs" },
  { href: "/admin/social-posts", label: "Social Posts" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/distress", label: "Distress Signals" },
  { href: "/admin/resource-handling", label: "Resource Handling" },
  { href: "/admin/services", label: "Services Directory" },
  { href: "/admin/contributions", label: "Contributions" },
  { href: "/donations", label: "Donations" },
  { href: "/admin/profiles", label: "Profiles" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {navItems.map((item) => {
        const matchActive = item.match?.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ?? false;
        const isActive =
          pathname === item.href ||
          (!item.exact && pathname.startsWith(`${item.href}/`)) ||
          matchActive;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-[color:var(--pill-border,rgba(255,255,255,0.14))] bg-[color:var(--pill-bg,rgba(255,255,255,0.06))] text-muted hover:border-primary hover:bg-[color:var(--pill-hover-bg,rgba(255,115,0,0.12))] hover:text-primary"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
