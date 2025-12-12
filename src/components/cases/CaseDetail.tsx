import { CaseRecord } from "@/types";
import { CaseTimeline } from "./CaseTimeline";
import { EvidenceGallery } from "../evidence/EvidenceGallery";
import { CaseActionsPanel } from "./CaseActionsPanel";
import { format } from "date-fns";

type Props = {
  caseData: CaseRecord;
  onAssign: (assignee: string) => void;
  onStatusChange: (status: CaseRecord["status"]) => void;
};

export function CaseDetail({ caseData, onAssign, onStatusChange }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.65fr,0.35fr]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{caseData.id}</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{caseData.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{caseData.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-100">
              {caseData.status}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {caseData.severity} severity
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {caseData.geo}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Stage {caseData.stage}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-4">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Reporter</p>
              <p>{caseData.reporter.name}</p>
              <p className="text-slate-500">{caseData.reporter.channel}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Assigned to</p>
              <p>{caseData.assignedTo ?? "Unassigned"}</p>
              <p className="text-slate-500">SLA {caseData.slaHours}h</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Created</p>
              <p>{format(new Date(caseData.createdAt), "PP p")}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Updated</p>
              <p>{format(new Date(caseData.updatedAt), "PP p")}</p>
            </div>
          </div>
        </div>
        <EvidenceGallery items={caseData.evidence} />
        <CaseTimeline events={caseData.timeline} />
      </div>
      <div className="space-y-4">
        <CaseActionsPanel caseData={caseData} onAssign={onAssign} onStatusChange={onStatusChange} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {caseData.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
