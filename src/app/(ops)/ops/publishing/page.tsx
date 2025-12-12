"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PublishingQueue } from "@/components/publishing/PublishingQueue";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";

export default function OpsPublishingPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: items = [] } = useQuery({ queryKey: ["publishing"], queryFn: () => mockApi.fetchPublishingQueue() });

  const mutation = useMutation({
    mutationFn: (id: string) =>
      mockApi.updatePublishingStatus({
        id,
        status: "SUBMITTED",
        actor: session?.name ?? "Ops Lead",
        role: session?.role ?? "SUB_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Submitted to core admin");
      queryClient.invalidateQueries({ queryKey: ["publishing"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Publishing</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prepare posts</h1>
      </div>
      <PublishingQueue items={items} onAction={(id) => mutation.mutate(id)} />
    </div>
  );
}
