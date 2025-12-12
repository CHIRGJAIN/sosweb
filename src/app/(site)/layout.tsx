import { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <SiteHeader />
      <main className="bg-[color:var(--background)] pb-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
