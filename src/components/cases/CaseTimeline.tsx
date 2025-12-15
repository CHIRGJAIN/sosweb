"use client";

import React from "react";
import type { TimelineEvent } from "@/types/sos";
import type { CaseTimelineEvent } from "@/types";
import { format, isValid } from "date-fns";

export function CaseTimeline({ events }: { events: (TimelineEvent | CaseTimelineEvent)[] }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Timeline</h3>
        <span className="text-xs text-slate-500 dark:text-slate-300">{events.length} events</span>
      </div>
      <ol className="relative space-y-4 border-l border-slate-200 pl-4 dark:border-slate-700">
        {events.map((event) => {
          const atVal = (event as any).at ?? (event as any).timestamp ?? (event as any).createdAt ?? null;
          const d = atVal ? new Date(atVal) : null;
          const timeLabel = d && isValid(d) ? format(d, "PP p") : "Unknown time";
          const id = (event as any).id ?? Math.random().toString(36).slice(2, 9);
          return (
            <li key={id} className="space-y-1">
              <div className="absolute -left-[7px] h-3 w-3 rounded-full bg-amber-500" />
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {timeLabel} — {(event as any).actor}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{(event as any).action}</p>
              {(event as any).notes ? <p className="text-sm text-slate-600 dark:text-slate-300">{(event as any).notes}</p> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default CaseTimeline;
