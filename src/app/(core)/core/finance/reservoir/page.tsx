"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ReservoirRulesCard } from "@/components/finance/ReservoirRulesCard";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";

export default function ReservoirPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: rules = [] } = useQuery({ queryKey: ["reservoir-rules"], queryFn: () => mockApi.fetchReservoirRules() });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; value: string }) =>
      mockApi.updateReservoirRule({
        id: payload.id,
        value: payload.value,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Rule updated");
      queryClient.invalidateQueries({ queryKey: ["reservoir-rules"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Finance</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reservoir</h1>
      </div>
      <ReservoirRulesCard rules={rules} onUpdate={(id, value) => mutation.mutate({ id, value })} />
    </div>
  );
}
