"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Clock4, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { mockApi } from "@/lib/mock/api";
import { StatsCards, type Stat } from "@/components/common/StatsCards";
import { DataTable } from "@/components/common/DataTable";
import { CaseRecord, VerificationItem } from "@/types";
import { useRouter } from "next/navigation";

export default function CommandCenterPage() {
  const router = useRouter();
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });
  const { data: queue = [] } = useQuery({ queryKey: ["verification-queue"], queryFn: () => mockApi.fetchVerificationQueue() });
  const { data: publishing = [] } = useQuery({ queryKey: ["publishing"], queryFn: () => mockApi.fetchPublishingQueue() });
  const { data: audits = [] } = useQuery({ queryKey: ["audit"], queryFn: () => mockApi.fetchAuditLogs() });

  const criticalCases = useMemo(() => cases.filter((c) => c.severity === "CRITICAL"), [cases]);
  const pendingVerifications = queue.filter((item) => item.stage !== "FINAL_APPROVAL");
  const slaBreaches = useMemo(() => cases.filter((c) => c.slaHours < 24 && c.status !== "RESOLVED"), [cases]);
  const reservoirBalance = 500000; // mock

  const stats: Stat[] = [
    { label: "Active cases", value: cases.length, helper: `${criticalCases.length} critical` },
    { label: "Pending verifications", value: pendingVerifications.length, helper: "User + authority", tone: "warning" },
    { label: "SLA warnings", value: slaBreaches.length, helper: "Under 24h", tone: "warning" },
    { label: "Reservoir balance", value: `₹${reservoirBalance.toLocaleString()}`, helper: "Mocked ledger" },
  ];

  const caseColumns = [
    { header: "Case", accessorKey: "title" },
    { header: "Geo", accessorKey: "geo" },
    { header: "Status", accessorKey: "status" },
    { header: "Severity", accessorKey: "severity" },
    { header: "Stage", accessorKey: "stage" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Core admin</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Command Center</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            KPI snapshot + live queues. Data is mocked with TanStack Query.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 dark:border-amber-400/40 dark:bg-amber-500/10 dark:text-amber-100">
          <Sparkles className="h-4 w-4" />
          Fast actions: click a KPI to jump to the filtered list.
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 lg:grid-cols-[0.55fr,0.45fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-500" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Incident map (static)</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300">Markers list only (mock)</p>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-200">
            {cases.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/60"
              >
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{c.geo}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-100">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <QueueCard
            title="User evidence review"
            items={queue.filter((q) => q.stage === "USER_EVIDENCE_REVIEW")}
            onClick={(item) => router.push(`/core/cases/${item.caseId}`)}
          />
          <QueueCard
            title="Authority evidence"
            items={queue.filter((q) => q.stage === "AUTHORITY_VERIFICATION")}
            onClick={(item) => router.push(`/core/cases/${item.caseId}`)}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.6fr,0.4fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Open cases</p>
            <button
              type="button"
              onClick={() => router.push("/core/cases")}
              className="text-xs font-semibold text-amber-700 hover:underline dark:text-amber-200"
            >
              View all
            </button>
          </div>
          <DataTable<CaseRecord>
            data={cases}
            columns={caseColumns}
            onRowClick={(row) => router.push(`/core/cases/${row.id}`)}
          />
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Publishing ready</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">{publishing.length} items</p>
            </div>
            <div className="mt-2 space-y-2">
              {publishing.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{item.channel}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Clock4 className="h-5 w-5 text-amber-500" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Recent activity</p>
            </div>
            <div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {audits.slice(0, 5).map((audit) => (
                <div key={audit.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {audit.actor} • {audit.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {audit.entity} {audit.entityId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QueueCard({
  title,
  items,
  onClick,
}: {
  title: string;
  items: VerificationItem[];
  onClick: (item: VerificationItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-300">{items.length} items</span>
      </div>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onClick(item)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/70 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-amber-300 dark:hover:bg-amber-500/10"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{item.caseId}</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300">{item.stage}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
