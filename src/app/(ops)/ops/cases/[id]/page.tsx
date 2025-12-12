"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CaseDetail } from "@/components/cases/CaseDetail";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";
import { CaseStatus } from "@/types";

export default function OpsCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { session } = useSessionStore();

  const caseQuery = useQuery({
    queryKey: ["case", params.id],
    queryFn: () => mockApi.fetchCaseById(params.id),
  });

  const assignMutation = useMutation({
    mutationFn: (assignee: string) =>
      mockApi.assignCase({
        caseId: params.id,
        assignee,
        actor: session?.name ?? "Ops Lead",
        role: session?.role ?? "SUB_ADMIN",
      }),
    onSuccess: (data) => {
      toast.success("Assignment saved");
      queryClient.setQueryData(["case", params.id], data);
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: CaseStatus) =>
      mockApi.updateCaseStatus({
        caseId: params.id,
        status,
        actor: session?.name ?? "Ops Lead",
        role: session?.role ?? "SUB_ADMIN",
      }),
    onSuccess: (data) => {
      toast.success("Status updated");
      queryClient.setQueryData(["case", params.id], data);
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });

  if (caseQuery.isLoading || !caseQuery.data) return <div className="p-6 text-sm text-slate-600">Loading case...</div>;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Ops</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Case detail</h1>
      </div>
      <CaseDetail
        caseData={caseQuery.data}
        onAssign={(assignee) => assignMutation.mutate(assignee)}
        onStatusChange={(status) => statusMutation.mutate(status)}
      />
    </div>
  );
}
