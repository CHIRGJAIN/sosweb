import { useState } from "react";
import { ReservoirRule } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  rules: ReservoirRule[];
  onUpdate: (id: string, value: string) => void;
};

export function ReservoirRulesCard({ rules, onUpdate }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>(
    rules.reduce((acc, rule) => ({ ...acc, [rule.id]: rule.value }), {} as Record<string, string>)
  );

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Reservoir Controls</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">Dual approvals and geo locks are simulated</p>
        </div>
      </div>
      {rules.map((rule) => (
        <div key={rule.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/50">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{rule.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{rule.description}</p>
          <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <input
              value={drafts[rule.id] ?? ""}
              onChange={(e) => setDrafts((prev) => ({ ...prev, [rule.id]: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white md:max-w-sm"
            />
            <Button
              onClick={() => onUpdate(rule.id, drafts[rule.id])}
              className="rounded-lg px-3 py-2 text-xs font-semibold"
            >
              Save
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
