"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mockApi } from "@/lib/mock/api";
import { Campaign } from "@/types";
import { Button } from "@/components/ui/button";

export default function PartnerCampaignsPage() {
  const queryClient = useQueryClient();
  const { data: campaigns = [] } = useQuery({ queryKey: ["campaigns"], queryFn: () => mockApi.fetchCampaigns() });
  const [draft, setDraft] = useState({ title: "", budget: 0 });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; status: Campaign["status"] }) =>
      mockApi.decideCampaign({
        id: payload.id,
        status: payload.status,
        actor: "Business PM",
        role: "BUSINESS",
      }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Business</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campaign requests</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.55fr,0.45fr]">
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{campaign.title}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {campaign.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300">Budget ₹{campaign.budget.toLocaleString()}</p>
              {campaign.status === "REVIEW" ? (
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() => mutation.mutate({ id: campaign.id, status: "APPROVED" })}
                    className="rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    Accept terms
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => mutation.mutate({ id: campaign.id, status: "REJECTED" })}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Create campaign request (mock)</p>
          <input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <input
            placeholder="Budget"
            type="number"
            value={draft.budget}
            onChange={(e) => setDraft((prev) => ({ ...prev, budget: Number(e.target.value) }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <Button onClick={() => toast.success("Draft saved (mock)")}>Save draft</Button>
        </div>
      </div>
    </div>
  );
}
