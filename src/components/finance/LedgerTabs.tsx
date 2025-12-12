import { useMemo, useState } from "react";
import { LedgerEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Props = {
  entries: LedgerEntry[];
  onExport?: (entries: LedgerEntry[]) => void;
};

const tabs: LedgerEntry["type"][] = ["RECEIVED", "USED", "RESERVOIR"];

export function LedgerTabs({ entries, onExport }: Props) {
  const [active, setActive] = useState<LedgerEntry["type"]>("RECEIVED");
  const filtered = useMemo(() => entries.filter((entry) => entry.type === active), [active, entries]);
  const total = filtered.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === tab
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() => onExport?.(filtered)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          Export CSV
        </Button>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900 dark:text-white">{entry.category}</p>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">{formatCurrency(entry.amount)}</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {entry.source} — {entry.geo}
            </p>
            {entry.caseId ? <p className="text-xs text-slate-500 dark:text-slate-300">Case {entry.caseId}</p> : null}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-200">
        Total: <span className="font-semibold text-amber-700 dark:text-amber-200">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
