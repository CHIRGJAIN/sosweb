"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { VaultWarningBanner } from "@/components/vault/VaultWarningBanner";
import { RedactionNotesPanel } from "@/components/vault/RedactionNotesPanel";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";

export default function VaultPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: reports = [] } = useQuery({ queryKey: ["vault"], queryFn: () => mockApi.fetchVaultReports() });
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; notes: string }) =>
      mockApi.updateRedaction({
        id: payload.id,
        notes: payload.notes,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Vault notes saved");
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });

  const evidenceLookup = Object.fromEntries(
    cases.flatMap((c) => c.evidence.map((ev) => [ev.id, ev]))
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Vault</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Restricted vault</h1>
      </div>
      <VaultWarningBanner />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{report.category}</p>
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 dark:bg-rose-500/20 dark:text-rose-100">
                {report.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{report.maskedSummary}</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
              {report.evidenceIds.map((id) => (
                <div key={id}>
                  Evidence {id}: {evidenceLookup[id]?.caption ?? "masked asset"}
                </div>
              ))}
            </div>
            <RedactionNotesPanel
              initialNotes={report.redactionNotes}
              onSave={(notes) => mutation.mutate({ id: report.id, notes })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
