import { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-theme bg-[color:var(--background)] min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">SOS Command Center</p>
          <h1 className="font-heading text-3xl font-bold text-ink">Admin Dashboard</h1>
          <p className="text-sm text-muted">All panels run purely on local mock data. No authentication needed.</p>
        </div>
        <AdminNav />
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-12">{children}</div>
    </div>
  );
}
