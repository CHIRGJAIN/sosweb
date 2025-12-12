"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { mockApi } from "@/lib/mock/api";
import { CaseRecord } from "@/types";
import { DataTable } from "@/components/common/DataTable";
import { FilterBar } from "@/components/common/FilterBar";

const statuses: CaseRecord["status"][] = ["OPEN", "ASSIGNED", "PENDING_EVIDENCE", "VERIFICATION", "RESOLVED", "CLOSED", "ESCALATED"];
const severities: CaseRecord["severity"][] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function CoreCasesPage() {
  const router = useRouter();
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });
  const [status, setStatus] = useState<CaseRecord["status"] | "all">("all");
  const [severity, setSeverity] = useState<CaseRecord["severity"] | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return cases.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (severity !== "all" && item.severity !== severity) return false;
      if (search) {
        const haystack = `${item.id} ${item.title} ${item.summary} ${item.geo}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [cases, search, severity, status]);

  const columns: ColumnDef<CaseRecord>[] = [
    { header: "Case", accessorKey: "title" },
    { header: "Geo", accessorKey: "geo" },
    { header: "Status", accessorKey: "status" },
    { header: "Severity", accessorKey: "severity" },
    { header: "Stage", accessorKey: "stage" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Core admin</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cases</h1>
      </div>
      <FilterBar onReset={() => { setStatus("all"); setSeverity("all"); setSearch(""); }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cases"
          className="w-56 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CaseRecord["status"] | "all")}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All statuses</option>
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as CaseRecord["severity"] | "all")}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All severity</option>
          {severities.map((sv) => (
            <option key={sv} value={sv}>
              {sv}
            </option>
          ))}
        </select>
      </FilterBar>
      <DataTable<CaseRecord>
        data={filtered}
        columns={columns}
        onRowClick={(row) => router.push(`/core/cases/${row.id}`)}
      />
    </div>
  );
}
