"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditLogTable } from "@/components/audit/AuditLogTable";
import { mockApi } from "@/lib/mock/api";

export default function AuditPage() {
  const { data: logs = [] } = useQuery({ queryKey: ["audit"], queryFn: () => mockApi.fetchAuditLogs() });
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Audit</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit trail</h1>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  );
}
