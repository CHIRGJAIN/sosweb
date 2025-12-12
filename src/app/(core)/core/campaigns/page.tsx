"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CampaignApprovalPanel } from "@/components/business/CampaignApprovalPanel";
import { mockApi } from "@/lib/mock/api";
import { useSessionStore } from "@/lib/mock/session";
import { Campaign } from "@/types";

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: campaigns = [] } = useQuery({ queryKey: ["campaigns"], queryFn: () => mockApi.fetchCampaigns() });
  const { data: businesses = [] } = useQuery({ queryKey: ["businesses"], queryFn: () => mockApi.fetchBusinesses() });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; status: Campaign["status"] }) =>
      mockApi.decideCampaign({
        id: payload.id,
        status: payload.status,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Campaign updated");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Campaigns</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campaign approvals</h1>
      </div>
      <CampaignApprovalPanel campaigns={campaigns} businesses={businesses} onDecision={(id, status) => mutation.mutate({ id, status })} />
    </div>
  );
}
