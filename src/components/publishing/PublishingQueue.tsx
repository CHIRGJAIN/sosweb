import { PublishingItem } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  items: PublishingItem[];
  onAction: (id: string, status: PublishingItem["status"]) => void;
};

const tone: Record<PublishingItem["status"], string> = {
  READY: "bg-emerald-100 text-emerald-800",
  SCHEDULED: "bg-blue-100 text-blue-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  UNPUBLISHED: "bg-rose-100 text-rose-800",
  SUBMITTED: "bg-amber-100 text-amber-800",
};

export function PublishingQueue({ items, onAction }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {item.channel} {item.caseId ? `• Case ${item.caseId}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone[item.status]}`}>{item.status}</span>
            <div className="flex gap-2">
              {item.status !== "PUBLISHED" ? (
                <Button
                  onClick={() => onAction(item.id, "PUBLISHED")}
                  className="rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  Publish
                </Button>
              ) : null}
              {item.status === "PUBLISHED" ? (
                <Button
                  variant="ghost"
                  onClick={() => onAction(item.id, "UNPUBLISHED")}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  Unpublish
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
