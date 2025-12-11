"use client";

import { useEffect, useMemo, useState } from "react";
import { servicesDirectory } from "@/data/command-center";
import { cn } from "@/lib/utils";

const statesList = servicesDirectory.states ?? [];

export default function ServicesDirectoryPage() {
  const [selectedState, setSelectedState] = useState<string>(statesList[0] ?? "");
  const districts = useMemo(() => servicesDirectory.districts[selectedState] ?? [], [selectedState]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(districts[0] ?? "");

  useEffect(() => {
    setSelectedDistrict(districts[0] ?? "");
  }, [districts]);

  const filtered = useMemo(
    () =>
      servicesDirectory.services.filter(
        (service) =>
          (!selectedState || service.state === selectedState) &&
          (!selectedDistrict || service.district === selectedDistrict)
      ),
    [selectedDistrict, selectedState]
  );
  const [selectedId, setSelectedId] = useState<string | null>(filtered[0]?.id ?? null);

  useEffect(() => {
    if (filtered.length && !filtered.find((service) => service.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((service) => service.id === selectedId);

  return (
    <div className="space-y-6 pb-12">
      <header className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-ink">Services Directory</h2>
        <p className="text-sm text-muted">Pick a state and district to review available services.</p>
        <div className="flex gap-2">
          <select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            className="rounded-lg border border-soft bg-[color:var(--surface-alt,#0c1424)] px-3 py-2 text-sm text-ink"
          >
            {statesList.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            value={selectedDistrict}
            onChange={(event) => setSelectedDistrict(event.target.value)}
            className="rounded-lg border border-soft bg-[color:var(--surface-alt,#0c1424)] px-3 py-2 text-sm text-ink"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="space-y-3">
            {filtered.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedId(service.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedId === service.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{service.name}</p>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
                    {service.state} | {service.district}
                  </span>
                </div>
                <p className="text-sm text-muted">{service.desc}</p>
              </button>
            ))}
            {!filtered.length ? <p className="text-sm text-muted">No services for this district.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Service Detail</h3>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p className="text-ink font-semibold">{selected.name}</p>
              <p>{selected.desc}</p>
              <p>State: {selected.state}</p>
              <p>District: {selected.district}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select a service to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
