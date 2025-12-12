"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";
import { Button } from "@/components/ui/button";

export default function ResolutionPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: resolutions = [] } = useQuery({ queryKey: ["resolutions"], queryFn: () => mockApi.fetchResolutions() });
  const [form, setForm] = useState({ caseId: "", outcome: "", notes: "" });

  const mutation = useMutation({
    mutationFn: () =>
      mockApi.addResolution({
        id: `RES-${Date.now()}`,
        caseId: form.caseId,
        outcome: form.outcome,
        notes: form.notes,
        attachments: [],
        submittedBy: session?.name ?? "Partner",
        createdAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      toast.success("Resolution submitted");
      queryClient.invalidateQueries({ queryKey: ["resolutions"] });
      setForm({ caseId: "", outcome: "", notes: "" });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Partner</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resolution</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.5fr,0.5fr]">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Submit resolution</p>
          <input
            placeholder="Case ID"
            value={form.caseId}
            onChange={(e) => setForm((prev) => ({ ...prev, caseId: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <input
            placeholder="Outcome"
            value={form.outcome}
            onChange={(e) => setForm((prev) => ({ ...prev, outcome: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            rows={4}
          />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isLoading}>
            {mutation.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
        <div className="space-y-2">
          {resolutions.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Case {res.caseId} — {res.outcome}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{res.notes}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">By {res.submittedBy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
