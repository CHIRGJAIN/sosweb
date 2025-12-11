"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { distressSignals, type DistressSignal } from "@/data/command-center";
import { cn } from "@/lib/utils";

const filters: Array<"All" | DistressSignal["type"]> = ["All", "sos", "media"];

export default function DistressSignalsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const filtered = useMemo(
    () => (filter === "All" ? distressSignals : distressSignals.filter((entry) => entry.type === filter)),
    [filter]
  );
  const [selectedId, setSelectedId] = useState<string | null>(filtered[0]?.id ?? null);

  useEffect(() => {
    if (filtered.length && !filtered.find((entry) => entry.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((entry) => entry.id === selectedId);

  return (
    <div className="space-y-4 pb-12">
      <header className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-ink">Distress Signals</h2>
        <p className="text-sm text-muted">Sender identity, precise location, and feedback for SOS/media signals.</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <Chip key={item} active={filter === item} onClick={() => setFilter(item)}>
              {item === "All" ? "All Types" : item.toUpperCase()}
            </Chip>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-5 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
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
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase",
                        entry.type === "sos" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      )}
                    >
                      {entry.type}
                    </span>
                    <span className="text-muted">
                      {entry.date} | {entry.time}
                    </span>
                  </div>
                  <span className="text-muted">{entry.geo}</span>
                </div>
                <p className="mt-2 font-semibold text-ink">
                  {entry.sender?.name} ({entry.sender?.id})
                </p>
                <p className="text-xs text-muted">{entry.location?.address || entry.geo}</p>
                {entry.location?.lat && entry.location?.lng ? (
                  <p className="mt-1 text-xs text-muted">
                    {entry.location.lat}, {entry.location.lng}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted">Feedback: {entry.feedback}</p>
              </button>
            ))}
            {!filtered.length ? <p className="text-sm text-muted">No distress signals for this type.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-5 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h2 className="font-heading text-xl font-semibold text-ink">Signal Detail</h2>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase",
                    selected.type === "sos" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  )}
                >
                  {selected.type}
                </span>
                <span>
                  {selected.date} | {selected.time}
                </span>
              </div>
              <p className="text-ink font-semibold text-base">{selected.sender?.name}</p>
              <p>User ID: {selected.sender?.id}</p>
              <p>Geo: {selected.geo}</p>
              <p>Address: {selected.location?.address ?? "Not provided"}</p>
              {selected.location?.lat && selected.location.lng ? (
                <p>
                  Coordinates: {selected.location.lat}, {selected.location.lng}
                </p>
              ) : null}
              {selected.mediaType ? <p>Media: {selected.mediaType}</p> : null}
              <p>Feedback: {selected.feedback}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select a distress signal to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
