"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, LogOut, Moon, Sun } from "lucide-react";
import { Role } from "@/types";
import { HARD_CODED_CREDENTIALS, useSessionStore } from "@/lib/mock/session";
import { cn } from "@/lib/utils";
import { RoleBasedSidebar } from "@/components/nav/RoleBasedSidebar";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

export function AppShell({ children, allowedRoles }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isReady, hydrate, logout, switchRole } = useSessionStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!session && isReady) {
      const redirectTo = `/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`;
      router.replace(redirectTo);
    }
  }, [pathname, isReady, router, session]);

  const isAllowed = useMemo(() => {
    if (!allowedRoles || !allowedRoles.length) return true;
    return allowedRoles.includes(session?.role ?? "CORE_ADMIN");
  }, [allowedRoles, session?.role]);

  if (!session) {
    return null;
  }

  return (
    <div className={cn("flex min-h-screen", theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900")}>
      <RoleBasedSidebar role={session.role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">SOS Admin</p>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                <p className="text-lg font-semibold">
                  {session.role.replaceAll("_", " ")} dashboard
                </p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Geo scope: {session.geoScope.region}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900">
                <p className="font-semibold">{session.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{session.email}</p>
              </div>
              <select
                value={session.role}
                onChange={(event) => switchRole(event.target.value as Role)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-amber-400 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {HARD_CODED_CREDENTIALS.map((cred) => (
                  <option key={cred.email} value={cred.role}>
                    {cred.role}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:border-amber-400 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-amber-400 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          {!isAllowed ? (
            <div className="border-t border-amber-300/30 bg-amber-50 px-6 py-3 text-sm text-amber-800 dark:border-amber-400/40 dark:bg-amber-900/20 dark:text-amber-100">
              You do not have access to this route with the current role. Switch roles or return to your dashboard.
            </div>
          ) : null}
        </header>
        <main className="flex-1 px-6 py-6">{isAllowed ? children : null}</main>
      </div>
    </div>
  );
}
