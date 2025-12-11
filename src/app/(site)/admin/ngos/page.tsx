"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ngos, ngoLevels, type Ngo, type NgoLevel } from "@/data/command-center";
import { cn } from "@/lib/utils";

const filters: Array<"all" | NgoLevel> = ["all", ...ngoLevels];
const placeholderImage = "/assets/background_image.png";

function percent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function formatAmount(value: number) {
  return `Rs ${value.toLocaleString("en-IN")}`;
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

export default function AdminNgosPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const filtered = useMemo(() => (filter === "all" ? ngos : ngos.filter((ngo) => ngo.level === filter)), [filter]);
  const [selectedId, setSelectedId] = useState<string | null>(filtered[0]?.id ?? null);

  useEffect(() => {
    if (filtered.length && !filtered.find((ngo) => ngo.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((ngo) => ngo.id === selectedId);

  return (
    <div className="space-y-6 pb-12">
      <header className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-ink">NGO Oversight</h2>
        <p className="text-sm text-muted">Filter partners by level and inspect fundraising progress.</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((level) => (
            <Chip key={level} active={filter === level} onClick={() => setFilter(level)}>
              {level === "all" ? "All" : titleCase(level)}
            </Chip>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.08fr,0.92fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((ngo) => {
              const pctRaised = percent(
                ngo.goalAmount ? (ngo.raisedAmount / ngo.goalAmount) * 100 : ngo.progress
              );
              return (
                <button
                  key={ngo.id}
                  onClick={() => setSelectedId(ngo.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                    selectedId === ngo.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                  )}
                >
                  <Image
                    src={ngo.imageUrl || placeholderImage}
                    alt={ngo.name}
                    width={64}
                    height={64}
                    className="size-16 rounded-xl object-cover"
                  />
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                        {titleCase(ngo.level)}
                      </span>
                      <span className="text-muted">{ngo.category}</span>
                    </div>
                    <p className="font-semibold text-ink">{ngo.name}</p>
                    <ProgressBar value={pctRaised} max={100} />
                    <p className="text-xs text-muted">
                      {formatAmount(ngo.raisedAmount)} of {formatAmount(ngo.goalAmount)} | {pctRaised}% progress
                    </p>
                    <p className="text-xs text-muted">Location: {ngo.location}</p>
                  </div>
                </button>
              );
            })}
            {!filtered.length ? <p className="text-sm text-muted">No NGOs match this level.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">NGO Detail</h3>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex items-center gap-3">
                <Image
                  src={selected.imageUrl || placeholderImage}
                  alt={selected.name}
                  width={72}
                  height={72}
                  className="rounded-xl object-cover"
                />
                <div>
                  <p className="text-ink font-semibold">{selected.name}</p>
                  <p>
                    {titleCase(selected.level)} | {selected.category}
                  </p>
                  <p>{selected.location}</p>
                </div>
              </div>
              <p>{selected.description}</p>
              <div className="rounded-xl border border-soft bg-white/5 p-3 text-xs">
                Raised {formatAmount(selected.raisedAmount)} of {formatAmount(selected.goalAmount)} (
                {percent(
                  selected.goalAmount ? (selected.raisedAmount / selected.goalAmount) * 100 : selected.progress
                )}
                %)
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select an NGO to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
