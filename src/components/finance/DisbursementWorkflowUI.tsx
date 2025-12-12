import { DisbursementRequest } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  requests: DisbursementRequest[];
  onDecision: (id: string, decision: "APPROVED" | "REJECTED") => void;
};

const badgeClasses: Record<DisbursementRequest["status"], string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
};

export function DisbursementWorkflowUI({ requests, onDecision }: Props) {
  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {req.id} • Case {req.caseId}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{req.reason}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Requested by {req.requestedBy}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[req.status]}`}>
              {req.status}
            </span>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">₹{req.amount.toLocaleString()}</p>
            {req.status === "PENDING" ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => onDecision(req.id, "REJECTED")}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => onDecision(req.id, "APPROVED")}
                  className="rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  Approve
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
