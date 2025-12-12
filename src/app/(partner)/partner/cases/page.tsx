"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { mockApi } from "@/lib/mock/api";
import { CaseRecord } from "@/types";
import { DataTable } from "@/components/common/DataTable";
import { FilterBar } from "@/components/common/FilterBar";

export default function PartnerCasesPage() {
  const router = useRouter();
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => cases.filter((c) => (search ? c.title.toLowerCase().includes(search.toLowerCase()) : true)),
    [cases, search]
  );

  const columns: ColumnDef<CaseRecord>[] = [
    { header: "Case", accessorKey: "title" },
    { header: "Status", accessorKey: "status" },
    { header: "Severity", accessorKey: "severity" },
    { header: "Geo", accessorKey: "geo" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Partner</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assigned cases</h1>
      </div>
      <FilterBar>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Quick search"
          className="w-60 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </FilterBar>
      <DataTable<CaseRecord> data={filtered} columns={columns} onRowClick={(row) => router.push(`/partner/cases/${row.id}`)} />
    </div>
  );
}
