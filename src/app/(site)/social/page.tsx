"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import { socialPosts, type SocialScope } from "@/data/socialPosts";

const filters: SocialScope[] = ["Global", "National", "State", "District"];

export default function SocialPage() {
  const [activeFilter, setActiveFilter] = useState<SocialScope>("Global");

  const filteredPosts = useMemo(
    () => socialPosts.filter((post) => post.scope === activeFilter),
    [activeFilter]
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-semibold text-ink">
            Social Intelligence Feed
          </h1>
          <p className="text-base text-muted">
            Switch between national and hyper-local alerts mirrored from the Flutter dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <Chip
              key={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[rgba(255,255,255,0.12)] bg-[color:var(--surface)] p-10 text-center text-muted">
            No posts available for this filter.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-6 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] p-6 shadow-sm shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:shadow-lg md:flex-row"
            >
              <div className="md:w-2/5">
                <Image
                  src={post.imageUrl}
                  alt={post.location}
                  width={480}
                  height={320}
                  className="h-56 w-full rounded-2xl object-cover"
                />
              </div>
              <div className="md:w-3/5">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary"
                  style={{ backgroundColor: "rgba(1, 117, 194, 0.15)" }}
                >
                  {post.location}
                </span>
                <p className="mt-4 text-lg font-medium text-ink">{post.description}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
