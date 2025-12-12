"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { ProfilePanel } from "./profile-panel";
import { useSessionStore } from "@/lib/mock/session";

type NavLink = {
  href: string;
  label: string;
  match?: string[];
};

const publicLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/ngos", label: "NGOs" },
  { href: "/social", label: "Social Feed" },
  { href: "/anonymous", label: "Anonymous Help" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, hydrate, logout } = useSessionStore();
  const { isMobileNavOpen, openMobileNav, closeMobileNav } = useUIStore();
  const isLoggedIn = Boolean(session);

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const navLinks = publicLinks;
  const visibleLinks = navLinks;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-[rgba(255,255,255,0.94)] text-[color:var(--color-ink)] shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-200"
      >
        <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 cursor-default select-none opacity-90">
              <Image
                src="/assets/app_logo.png"
                alt="SANKATMOCHAN logo"
                width={42}
                height={42}
                className="size-10 rounded-full border border-[color:var(--color-border)] bg-[color:var(--pill-bg,#fff2de)] object-cover"
                priority
              />
              <div className="hidden flex-col leading-tight lg:flex">
                <span className="font-heading text-lg font-semibold tracking-wide text-ink">
                  SANKATMOCHAN
                </span>
                <span className="text-sm text-muted">First Call in Crisis</span>
              </div>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/app_logo.png"
                alt="SANKATMOCHAN logo"
                width={42}
                height={42}
                className="size-10 rounded-full border border-[color:var(--color-border)] bg-[color:var(--pill-bg,#fff2de)] object-cover"
                priority
              />
              <div className="hidden flex-col leading-tight lg:flex">
                <span className="font-heading text-lg font-semibold tracking-wide text-ink">
                  SANKATMOCHAN
                </span>
                <span className="text-sm text-muted">First Call in Crisis</span>
              </div>
            </Link>
          )}

          {visibleLinks.length ? (
            <nav className="hidden items-center gap-1 text-sm font-medium lg:flex">
              {visibleLinks.map((link) => {
                const matches = link.match?.some((matchPath) => pathname.startsWith(matchPath)) ?? false;
                const isActive = matches || pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-4 py-2 transition-all duration-150",
                      isActive
                        ? "bg-[rgba(255,140,26,0.14)] text-primary shadow-sm"
                        : "text-muted hover:bg-[rgba(255,140,26,0.08)] hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="hidden items-center rounded-full border border-primary/60 bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[rgba(255,140,26,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,140,26,0.65)] lg:inline-flex"
              >
                Login
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--surface)] px-5 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,140,26,0.65)] lg:inline-flex"
              >
                Logout
              </button>
            )}
            {visibleLinks.length ? (
              <button
                type="button"
                onClick={openMobileNav}
                aria-label="Open navigation menu"
                className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--surface)] text-ink transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
              >
                <Bars3Icon className="size-6" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <ProfilePanel />

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[rgba(0,0,0,0.55)] backdrop-blur-sm transition-opacity lg:hidden",
          isMobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!isMobileNavOpen}
        onClick={closeMobileNav}
      />

      {visibleLinks.length ? (
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-72 transform border-l border-[color:var(--color-border)] bg-[rgba(255,255,255,0.98)] p-6 shadow-xl transition-transform lg:hidden",
            isMobileNavOpen ? "translate-x-0" : "translate-x-full"
          )}
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 opacity-90">
                <Image
                  src="/assets/app_logo.png"
                  alt="SANKATMOCHAN logo"
                  width={36}
                  height={36}
                  className="size-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--pill-bg,#fff2de)] object-cover"
                />
                <span className="font-heading text-lg font-semibold text-ink">SANKATMOCHAN</span>
              </div>
            ) : (
              <Link href="/" className="flex items-center gap-3" onClick={closeMobileNav}>
                <Image
                  src="/assets/app_logo.png"
                  alt="SANKATMOCHAN logo"
                  width={36}
                  height={36}
                  className="size-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--pill-bg,#fff2de)] object-cover"
                />
                <span className="font-heading text-lg font-semibold text-ink">SANKATMOCHAN</span>
              </Link>
            )}
            <nav className="space-y-2 text-sm font-medium text-ink">
              {visibleLinks.map((link) => {
                const matches = link.match?.some((matchPath) => pathname.startsWith(matchPath)) ?? false;
                const isActive = matches || pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileNav}
                    className={cn(
                      "block rounded-lg px-4 py-3 transition",
                      isActive
                        ? "bg-[rgba(255,140,26,0.14)] text-primary shadow-sm"
                        : "text-muted hover:bg-[rgba(255,140,26,0.08)] hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,140,26,0.65)]"
              >
                Login
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-auto inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-ink shadow transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,140,26,0.65)]"
              >
                Logout
              </button>
            )}
          </div>
        </aside>
      ) : null}
    </>
  );
}
