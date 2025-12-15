"use client";

import React from "react";
import Link from "next/link";

type CaseCard = {
  id: string;
  title?: string;
  category?: string;
  severity?: string;
  description?: string;
};

export function CaseCardList({ items }: { items: CaseCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <article
          key={c.id}
          className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-amber-300"
        >
          <Link href={`/core/cases/${c.id}`} className="block focus:outline-none focus:ring-2 focus:ring-amber-400" aria-label={`Open case ${c.id}`}>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-xs text-muted">{c.category} • {c.severity}</p>
            <p className="mt-2 text-sm text-slate-700">{c.description}</p>
            <div className="mt-3 text-sm font-semibold text-amber-600">View case</div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export default CaseCardList;
