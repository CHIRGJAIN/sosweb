"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/lib/mock/api";
import { ColumnDef } from "@tanstack/react-table";
import { StatsCards } from "@/components/common/StatsCards";
import { DataTable } from "@/components/common/DataTable";
import { CaseRecord } from "@/types";

export default function OpsOverviewPage() {
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });
  const { data: escalations = [] } = useQuery({ queryKey: ["escalations"], queryFn: () => mockApi.fetchEscalations() });

  const regionCases = useMemo(() => cases.filter((c) => c.geo.toLowerCase().includes("delhi")), [cases]);
  const waitingEvidence = regionCases.filter((c) => c.status === "PENDING_EVIDENCE");
  const slaAlerts = regionCases.filter((c) => c.slaHours < 24);

  const stats = [
    { label: "Region cases", value: regionCases.length },
    { label: "Pending evidence", value: waitingEvidence.length, tone: "warning" },
    { label: "SLA warnings", value: slaAlerts.length, tone: "warning" },
    { label: "Escalations", value: escalations.length },
  ];

  const columns: ColumnDef<CaseRecord>[] = [
    { header: "Case", accessorKey: "title" },
    { header: "Status", accessorKey: "status" },
    { header: "Severity", accessorKey: "severity" },
    { header: "Geo", accessorKey: "geo" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Ops</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ops overview</h1>
      </div>
      <StatsCards stats={stats} />
      <DataTable<CaseRecord> data={regionCases} columns={columns} />
    </div>
  );
}
