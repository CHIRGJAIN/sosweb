"use client";

import { useState } from "react";
import { FileText, Image as ImageIcon, Play } from "lucide-react";
import { EvidenceItem } from "@/types";
import { EvidenceViewerModal } from "./EvidenceViewerModal";

export function EvidenceGallery({ items }: { items: EvidenceItem[] }) {
  const [selected, setSelected] = useState<EvidenceItem | null>(null);

  const iconFor = (type: EvidenceItem["type"]) => {
    if (type === "video") return <Play className="h-4 w-4" />;
    if (type === "document") return <FileText className="h-4 w-4" />;
    return <ImageIcon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-amber-400 hover:bg-amber-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-300 dark:hover:bg-amber-500/5"
          >
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              {iconFor(item.type)}
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {item.type}
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
                {item.source}
              </span>
            </div>
            <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
              {item.caption || item.id}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Uploaded by {item.uploadedBy} at {item.createdAt}
            </p>
          </button>
        ))}
      </div>
      <EvidenceViewerModal evidence={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
