"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { contributions, type Contribution } from "@/data/command-center";
import { cn } from "@/lib/utils";

const modes: Contribution["mode"][] = ["made", "received"];

export default function ContributionsPage() {
  const [mode, setMode] = useState<Contribution["mode"]>("made");
  const filtered = useMemo(() => contributions.filter((entry) => entry.mode === mode), [mode]);
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
        <h2 className="font-heading text-2xl font-semibold text-ink">Contributions</h2>
        <p className="text-sm text-muted">Toggle between made vs received contributions.</p>
        <div className="flex flex-wrap gap-2">
          {modes.map((item) => (
            <Chip key={item} active={mode === item} onClick={() => setMode(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="space-y-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedId === item.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{item.title}</span>
                  <span className="text-primary">{item.amount}</span>
                </div>
                <p className="text-xs text-muted">{item.date}</p>
              </button>
            ))}
            {!filtered.length ? <p className="text-sm text-muted">No contributions for this tab.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Contribution Detail</h3>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p className="text-ink font-semibold">{selected.title}</p>
              <p>Mode: {selected.mode}</p>
              <p>Date: {selected.date}</p>
              <p>Amount: {selected.amount}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select a contribution to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
