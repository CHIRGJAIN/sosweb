"use client";

import { X } from "lucide-react";
import { EvidenceItem } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  evidence?: EvidenceItem | null;
  onClose: () => void;
};

export function EvidenceViewerModal({ evidence, onClose }: Props) {
  if (!evidence) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{evidence.caption ?? evidence.id}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {evidence.uploadedBy} • {evidence.source}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-lg px-3 py-2 text-sm">
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
          {evidence.type === "image" ? (
            <img src={evidence.url} alt={evidence.id} className="max-h-[440px] w-full rounded-lg object-cover" />
          ) : evidence.type === "video" ? (
            <video controls className="w-full rounded-lg">
              <source src={evidence.url} />
            </video>
          ) : (
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <p>Document: {evidence.url}</p>
              <a
                href={evidence.url}
                target="_blank"
                className="text-amber-600 hover:underline dark:text-amber-300"
                rel="noreferrer"
              >
                Open document
              </a>
            </div>
          )}
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p>Hash: {evidence.hash}</p>
          <p>Uploaded: {evidence.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
