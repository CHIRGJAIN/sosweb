"use client";

import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/lib/mock/api";
import { LedgerTabs } from "@/components/finance/LedgerTabs";
import { LedgerEntry } from "@/types";

export default function LedgerPage() {
  const { data: ledger = [] } = useQuery({ queryKey: ["ledger"], queryFn: () => mockApi.fetchLedger() });

  const handleExport = async (entries: LedgerEntry[]) => {
    const csv = await mockApi.exportLedgerCsv(entries);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ledger.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Finance</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ledger</h1>
      </div>
      <LedgerTabs entries={ledger} onExport={handleExport} />
    </div>
  );
}
