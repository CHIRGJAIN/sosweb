"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Briefcase,
  Building2,
  CheckSquare,
  ClipboardList,
  FileCheck2,
  FileWarning,
  FolderLock,
  LayoutDashboard,
  ListChecks,
  MailOpen,
  ScrollText,
  Shield,
  ShieldCheck,
  ShieldOff,
  Users,
} from "lucide-react";
import { Role } from "@/types";
import { cn } from "@/lib/utils";
import { filterNav, NavItem } from "@/lib/rbac/scope";

type SidebarProps = {
  role: Role;
};

const coreNav: NavItem[] = [
  { label: "Command Center", href: "/core/command-center", icon: LayoutDashboard },
  { label: "Cases", href: "/core/cases", icon: ClipboardList },
  { label: "Routing Rules", href: "/core/routing-rules", icon: ListChecks },
  { label: "Directory: NGOs", href: "/core/directory/ngos", icon: Users },
  { label: "Directory: Services", href: "/core/directory/services", icon: ShieldCheck },
  { label: "Directory: Resources", href: "/core/directory/resources", icon: Building2 },
  { label: "Moderation: Posts", href: "/core/moderation/posts", icon: FileWarning },
  { label: "Users", href: "/core/users", icon: Users },
  { label: "Roles", href: "/core/roles", icon: ShieldOff },
  { label: "Audit Log", href: "/core/audit", icon: ScrollText },
];

const opsNav: NavItem[] = [
  { label: "Overview", href: "/ops/overview", icon: LayoutDashboard },
  { label: "Cases", href: "/ops/cases", icon: ClipboardList },
  { label: "Service Requests", href: "/ops/service-requests", icon: MailOpen },
  { label: "Reports", href: "/ops/reports", icon: BarChart3 },
];

const partnerNav: NavItem[] = [
  { label: "Assigned Cases", href: "/partner/cases", icon: ListChecks },
  { label: "NGO Reports", href: "/partner/ngo/reports", icon: Activity },
];

const responderNav: NavItem[] = [
  { label: "Assignments", href: "/responder/assignments", icon: ListChecks },
  { label: "History", href: "/responder/history", icon: Activity },
];

function navForRole(role: Role) {
  if (role === "CORE_ADMIN") return coreNav;
  if (role === "SUB_ADMIN") return opsNav;
  if (role === "AUTHORITY") return responderNav;
  if (role === "NGO" || role === "BUSINESS") return partnerNav;
  return [];
}

export function RoleBasedSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = filterNav(role, navForRole(role));

  return (
    <aside className="hidden w-[260px] flex-col border-r border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:flex">
      <div className="px-6 pb-4 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">SOS</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Admin Console</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Role: {role.replaceAll("_", " ")}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 pb-4">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-amber-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-amber-200"
              )}
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
