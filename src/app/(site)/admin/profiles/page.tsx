"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { profiles } from "@/data/command-center";
import { cn } from "@/lib/utils";

const placeholderAvatar = "/assets/app_logo.png";

export default function ProfilesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(profiles[0]?.id ?? null);
  const selected = useMemo(() => profiles.find((profile) => profile.id === selectedId), [selectedId]);

  useEffect(() => {
    if (profiles.length && !profiles.find((profile) => profile.id === selectedId)) {
      setSelectedId(profiles[0].id);
    }
  }, [selectedId]);

  return (
    <div className="space-y-6 pb-12">
      <header className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-ink">Profiles</h2>
        <p className="text-sm text-muted">Static operator view of user identity, contacts, and incident history.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="space-y-3">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedId(profile.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedId === profile.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10">
                    <Image
                      src={profile.avatarUrl || placeholderAvatar}
                      alt={profile.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-cover"
                    />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-ink">{profile.name}</p>
                    <p className="text-muted">ID: {profile.id}</p>
                    <p className="text-muted">Phone: {profile.phone}</p>
                  </div>
                </div>
              </button>
            ))}
            {!profiles.length ? <p className="text-sm text-muted">No profiles in mock data.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Profile Detail</h3>
          {selected ? (
            <div className="mt-4 space-y-4 text-sm text-muted">
              <div className="flex items-center gap-3">
                <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-white/10">
                  <Image
                    src={selected.avatarUrl || placeholderAvatar}
                    alt={selected.name}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] object-cover"
                  />
                </div>
                <div>
                  <p className="text-ink font-semibold text-base">{selected.name}</p>
                  <p>User ID: {selected.id}</p>
                  <p>KYC: {selected.kyc}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p>Phone: {selected.phone}</p>
                <p>Emergency contact: {selected.emergencyContact}</p>
                <p>Address: {selected.address}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-soft bg-white/5 p-3">
                  <p className="text-xs font-semibold text-ink">Distress History</p>
                  <div className="mt-2 space-y-2 text-xs text-muted">
                    {selected.distressHistory.map((item) => (
                      <div key={item.id} className="rounded-lg border border-soft bg-[rgba(255,255,255,0.04)] p-2">
                        <p className="font-semibold text-ink">{item.label}</p>
                        <p>Status: {item.status}</p>
                        <p>Response: {item.responseTime}</p>
                      </div>
                    ))}
                    {!selected.distressHistory.length ? <p>No incidents logged.</p> : null}
                  </div>
                </div>
                <div className="rounded-2xl border border-soft bg-white/5 p-3">
                  <p className="text-xs font-semibold text-ink">Contribution Summary</p>
                  <div className="mt-2 space-y-2 text-xs text-muted">
                    {selected.contributions.map((item) => (
                      <div key={item.id} className="rounded-lg border border-soft bg-[rgba(255,255,255,0.04)] p-2">
                        <p className="font-semibold text-ink">{item.title}</p>
                        <p>{item.detail}</p>
                      </div>
                    ))}
                    {!selected.contributions.length ? <p>No contributions logged.</p> : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select a profile to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
