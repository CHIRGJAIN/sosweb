"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { VerificationQueue } from "@/components/verification/VerificationQueue";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";
import { VerificationDecision } from "@/types";

export default function VerificationPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });
  const queueQuery = useQuery({ queryKey: ["verification-queue"], queryFn: () => mockApi.fetchVerificationQueue() });

  const decisionMutation = useMutation({
    mutationFn: ({ itemId, decision, reason }: { itemId: string; decision: VerificationDecision; reason: string }) =>
      mockApi.submitVerificationDecision({
        itemId,
        decision,
        reason,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Decision saved");
      queryClient.invalidateQueries({ queryKey: ["verification-queue"] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Core admin</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verification</h1>
      </div>
      <VerificationQueue
        items={queueQuery.data ?? []}
        cases={cases}
        onResolve={(itemId, values) =>
          decisionMutation.mutate({ itemId, decision: values.decision, reason: values.reason })
        }
      />
    </div>
  );
}
