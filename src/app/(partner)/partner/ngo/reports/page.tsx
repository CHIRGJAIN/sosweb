"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mockApi } from "@/lib/mock/api";
import { UtilizationReport } from "@/types";
import { Button } from "@/components/ui/button";

export default function NgoReportsPage() {
  const queryClient = useQueryClient();
  const { data: reports = [] } = useQuery({ queryKey: ["utilization"], queryFn: () => mockApi.fetchUtilizationReports() });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; status: UtilizationReport["status"] }) =>
      mockApi.submitUtilizationReport({ id: payload.id, receipts: [], status: payload.status }),
    onSuccess: () => {
      toast.success("Report submitted");
      queryClient.invalidateQueries({ queryKey: ["utilization"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">NGO</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Utilization reports</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{report.ngo}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {report.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{report.period}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">₹{report.amount.toLocaleString()}</p>
            <Button
              onClick={() => mutation.mutate({ id: report.id, status: "SUBMITTED" })}
              disabled={report.status === "SUBMITTED"}
              className="rounded-lg px-3 py-2 text-xs font-semibold"
            >
              Submit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
