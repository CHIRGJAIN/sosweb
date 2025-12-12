"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/lib/mock/api";
import { LedgerTabs } from "@/components/finance/LedgerTabs";

export default function OpsFinancePage() {
  const { data: ledger = [] } = useQuery({ queryKey: ["ledger"], queryFn: () => mockApi.fetchLedger() });
  const regional = useMemo(() => ledger.filter((entry) => entry.geo.toLowerCase().includes("delhi")), [ledger]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Ops finance</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Regional ledger</h1>
      </div>
      <LedgerTabs entries={regional} />
    </div>
  );
}
