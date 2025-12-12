import { Campaign, Business } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  campaigns: Campaign[];
  businesses: Business[];
  onDecision: (id: string, status: Campaign["status"], tier?: Campaign["tier"]) => void;
};

const badge: Record<Campaign["status"], string> = {
  REVIEW: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
};

export function CampaignApprovalPanel({ campaigns, businesses, onDecision }: Props) {
  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => {
        const biz = businesses.find((b) => b.id === campaign.businessId);
        return (
          <div
            key={campaign.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{campaign.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {biz?.name ?? campaign.businessId} • Budget ₹{campaign.budget.toLocaleString()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[campaign.status]}`}>
                {campaign.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Tier {campaign.tier}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Submitted {campaign.submittedAt}
              </span>
            </div>
            {campaign.status === "REVIEW" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={() => onDecision(campaign.id, "APPROVED", campaign.tier)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDecision(campaign.id, "REJECTED", campaign.tier)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  Reject
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
