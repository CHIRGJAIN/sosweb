"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { socialCategories, socialPosts, type SocialCategory } from "@/data/command-center";
import { cn } from "@/lib/utils";

const filters: Array<"All" | SocialCategory> = ["All", ...socialCategories];
const placeholderImage = "/assets/background_image.png";

function percent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function formatAmount(value: number) {
  return `Rs ${value.toLocaleString("en-IN")}`;
}

function formatTimestamp(value: string) {
  try {
    return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return value;
  }
}

export default function AdminSocialPostsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const filtered = useMemo(
    () => (filter === "All" ? socialPosts : socialPosts.filter((post) => post.category === filter)),
    [filter]
  );
  const [selectedId, setSelectedId] = useState<string | null>(filtered[0]?.id ?? null);

  useEffect(() => {
    if (filtered.length && !filtered.find((post) => post.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((post) => post.id === selectedId);

  return (
    <div className="space-y-6 pb-12">
      <header className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-ink">Social Posts</h2>
        <p className="text-sm text-muted">Monitor verified posts by category and funding progress.</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((category) => (
            <Chip key={category} active={filter === category} onClick={() => setFilter(category)}>
              {category}
            </Chip>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="space-y-3">
            {filtered.map((post) => {
              const pctRaised = percent(post.goal ? (post.raised / post.goal) * 100 : post.progress);
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedId(post.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition",
                    selectedId === post.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted">{formatTimestamp(post.timestamp)}</p>
                      <p className="font-semibold text-ink">
                        {post.author} <span className="font-normal text-muted">{post.handle}</span>
                      </p>
                      <p className="text-xs text-muted">{post.location}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {post.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink">{post.body}</p>
                  <div className="mt-3">
                    <ProgressBar value={pctRaised} max={100} />
                    <p className="mt-1 text-xs text-muted">
                      {formatAmount(post.raised)} of {formatAmount(post.goal)} | {pctRaised}% tracked
                    </p>
                  </div>
                </button>
              );
            })}
            {!filtered.length ? <p className="text-sm text-muted">No social posts in this category.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Post Detail</h3>
          {selected ? (
            <div className="mt-4 space-y-3">
              <div className="h-36 w-full overflow-hidden rounded-xl bg-white/5">
                {selected.imageUrl ? (
                  <Image
                    src={selected.imageUrl}
                    alt={selected.id}
                    width={640}
                    height={320}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <Image
                    src={placeholderImage}
                    alt="placeholder"
                    width={640}
                    height={320}
                    className="h-36 w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-semibold">
                  {selected.category}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1">{selected.location}</span>
                <span>{formatTimestamp(selected.timestamp)}</span>
              </div>
              <p className="text-sm text-ink">{selected.body}</p>
              <div className="rounded-lg border border-soft bg-white/5 p-3 text-xs text-muted">
                Raised {formatAmount(selected.raised)} of {formatAmount(selected.goal)} (
                {percent(selected.progress)}% progress)
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select a post to view details.</p>
          )}
        </div>
      </section>
    </div>
  );
}
