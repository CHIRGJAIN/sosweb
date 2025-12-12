"use client";

import { useState } from "react";
import { ShieldCheck, Timer } from "lucide-react";
import { CaseRecord, VerificationDecision, VerificationItem } from "@/types";
import { VerificationDecisionForm } from "./VerificationDecisionForm";
import { cn } from "@/lib/utils";

type Props = {
  items: VerificationItem[];
  cases: CaseRecord[];
  onResolve: (itemId: string, decision: { decision: VerificationDecision; reason: string }) => Promise<void> | void;
};

export function VerificationQueue({ items, cases, onResolve }: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const activeItem = items.find((item) => item.id === activeId);
  const activeCase = cases.find((c) => c.id === activeItem?.caseId);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.55fr,0.45fr]">
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Queue</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300">{items.length} items</p>
        </div>
        <div className="space-y-2">
          {items.map((item) => {
            const caseData = cases.find((c) => c.id === item.caseId);
            return (
              <button
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "w-full rounded-xl border px-3 py-3 text-left transition",
                  activeId === item.id
                    ? "border-amber-400 bg-amber-50/70 dark:border-amber-300 dark:bg-amber-500/10"
                    : "border-slate-200 bg-white hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-300"
                )}
              >
                <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                  <span className="font-semibold">{caseData?.title ?? item.caseId}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {item.stage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300">Submitted by {item.submittedBy}</p>
              </button>
            );
          })}
        </div>
      </div>

      {activeItem ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{activeCase?.title}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                <Timer className="h-4 w-4" />
                {activeCase?.slaHours}h SLA
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{activeCase?.summary}</p>
          </div>
          <VerificationDecisionForm
            onSubmit={(values) => onResolve(activeItem.id, values)}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Select an item to review.
        </div>
      )}
    </div>
  );
}
