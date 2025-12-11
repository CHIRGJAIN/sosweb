"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { resources } from "@/data/command-center";
import { cn } from "@/lib/utils";

const categories = ["All", ...new Set(resources.map((resource) => resource.category))];

export default function AdminResourcesPage() {
  const [category, setCategory] = useState<string>(categories[0]);
  const filtered = useMemo(
    () => (category === "All" ? resources : resources.filter((resource) => resource.category === category)),
    [category]
  );
  const [selectedId, setSelectedId] = useState<string | null>(filtered[0]?.id ?? null);

  useEffect(() => {
    if (filtered.length && !filtered.find((resource) => resource.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((resource) => resource.id === selectedId);

  return (
    <div className="space-y-6 pb-12">
      <header className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-ink">Resources</h2>
        <p className="text-sm text-muted">Filter by category and drill into contact, region, and escalation.</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Chip key={item} active={category === item} onClick={() => setCategory(item)}>
              {item}
            </Chip>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((resource) => (
              <button
                key={resource.id}
                onClick={() => setSelectedId(resource.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  selectedId === resource.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{resource.title}</p>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{resource.category}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{resource.description}</p>
                <p className="mt-2 text-xs text-muted">Region: {resource.region}</p>
              </button>
            ))}
            {!filtered.length ? <p className="text-sm text-muted">No resources for this category.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Resource Detail</h3>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-ink font-semibold">{selected.title}</p>
              <p className="text-muted">{selected.description}</p>
              <p className="text-muted">Category: {selected.category}</p>
              <p className="text-muted">Region: {selected.region}</p>
              <p className="text-muted">Contact: {selected.contact}</p>
              <p className="text-muted">Escalation: {selected.escalation}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select a resource to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
