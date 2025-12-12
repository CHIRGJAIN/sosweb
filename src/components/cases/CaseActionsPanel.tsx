"use client";

import { useState } from "react";
import { CaseRecord, CaseStatus } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  caseData: CaseRecord;
  onAssign: (assignee: string) => void;
  onStatusChange: (status: CaseStatus) => void;
};

const statuses: CaseStatus[] = ["OPEN", "ASSIGNED", "PENDING_EVIDENCE", "VERIFICATION", "RESOLVED", "CLOSED", "ESCALATED"];

export function CaseActionsPanel({ caseData, onAssign, onStatusChange }: Props) {
  const [assignee, setAssignee] = useState(caseData.assignedTo ?? "");
  const [status, setStatus] = useState<CaseStatus>(caseData.status);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Actions</h3>
      <div className="space-y-2">
        <label className="text-xs text-slate-600 dark:text-slate-300">Assign to</label>
        <div className="flex gap-2">
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Team or owner"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <Button
            onClick={() => onAssign(assignee)}
            className="rounded-lg px-3 py-2 text-xs font-semibold"
            disabled={!assignee}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-slate-600 dark:text-slate-300">Status</label>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CaseStatus)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <Button onClick={() => onStatusChange(status)} className="rounded-lg px-3 py-2 text-xs font-semibold">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
