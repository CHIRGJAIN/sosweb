"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PublishingQueue } from "@/components/publishing/PublishingQueue";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";
import { PublishingItem } from "@/types";

export default function PublishingPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: items = [] } = useQuery({ queryKey: ["publishing"], queryFn: () => mockApi.fetchPublishingQueue() });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; status: PublishingItem["status"] }) =>
      mockApi.updatePublishingStatus({
        id: payload.id,
        status: payload.status,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Publishing queue updated");
      queryClient.invalidateQueries({ queryKey: ["publishing"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Publishing</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Publishing queue</h1>
      </div>
      <PublishingQueue items={items} onAction={(id, status) => mutation.mutate({ id, status })} />
    </div>
  );
}
