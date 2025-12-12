"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";
import { Button } from "@/components/ui/button";
import { EscalationItem } from "@/types";

export default function EscalationsPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: escalations = [] } = useQuery({ queryKey: ["escalations"], queryFn: () => mockApi.fetchEscalations() });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; status: EscalationItem["status"] }) =>
      mockApi.updateEscalation({
        id: payload.id,
        status: payload.status,
        actor: session?.name ?? "Ops Lead",
        role: session?.role ?? "SUB_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Escalation updated");
      queryClient.invalidateQueries({ queryKey: ["escalations"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Escalations</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Masked escalations</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {escalations.map((item) => (
          <div
            key={item.id}
            className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Case {item.caseId}</p>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-100">
                {item.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{item.maskedNotes}</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => mutation.mutate({ id: item.id, status: "ACKNOWLEDGED" })}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                Reveal
              </Button>
              <Button
                onClick={() => mutation.mutate({ id: item.id, status: "PENDING_REVIEW" })}
                className="rounded-lg px-3 py-2 text-xs font-semibold"
              >
                Request review
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
