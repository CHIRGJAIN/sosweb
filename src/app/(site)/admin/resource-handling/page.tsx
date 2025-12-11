"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { resourceHandlingEntries, type ResourceHandling } from "@/data/command-center";
import { cn } from "@/lib/utils";

const modes: Array<ResourceHandling["mode"] | "all"> = ["all", "used", "received", "reservoir"];

export default function ResourceHandlingPage() {
  const [mode, setMode] = useState<(typeof modes)[number]>("all");
  const filtered = useMemo(
    () => (mode === "all" ? resourceHandlingEntries : resourceHandlingEntries.filter((entry) => entry.mode === mode)),
    [mode]
  );
  const [selectedId, setSelectedId] = useState<string | null>(filtered[0]?.id ?? null);

  useEffect(() => {
    if (filtered.length && !filtered.find((entry) => entry.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((entry) => entry.id === selectedId);

  return (
    <div className="space-y-6 pb-12">
      <header className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-ink">Resource Handling</h2>
        <p className="text-sm text-muted">Track how resources are used, received, or stored.</p>
        <div className="flex flex-wrap gap-2">
          {modes.map((item) => (
            <Chip key={item} active={mode === item} onClick={() => setMode(item)}>
              {item === "all" ? "All" : item}
            </Chip>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="space-y-3">
            {filtered.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedId(entry.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedId === entry.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{entry.for}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{entry.mode}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {entry.date} | {entry.time}
                </p>
                <p className="mt-1 text-sm text-muted">{entry.description}</p>
                <p className="mt-2 text-xs font-semibold text-primary">{entry.amount}</p>
              </button>
            ))}
            {!filtered.length ? <p className="text-sm text-muted">No entries in this mode.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Handling Detail</h3>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p className="text-ink font-semibold">{selected.for}</p>
              <p>Mode: {selected.mode}</p>
              <p>Date: {selected.date}</p>
              <p>Time: {selected.time}</p>
              <p>Amount: {selected.amount}</p>
              <p>{selected.description}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select a record to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
