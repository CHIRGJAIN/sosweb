"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DisbursementWorkflowUI } from "@/components/finance/DisbursementWorkflowUI";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";

export default function DisbursementsPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: requests = [] } = useQuery({ queryKey: ["disbursements"], queryFn: () => mockApi.fetchDisbursements() });

  const decisionMutation = useMutation({
    mutationFn: (payload: { id: string; decision: "APPROVED" | "REJECTED" }) =>
      mockApi.decideDisbursement({
        id: payload.id,
        decision: payload.decision,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Decision recorded");
      queryClient.invalidateQueries({ queryKey: ["disbursements"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Finance</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Disbursements</h1>
      </div>
      <DisbursementWorkflowUI
        requests={requests}
        onDecision={(id, decision) => decisionMutation.mutate({ id, decision })}
      />
    </div>
  );
}
