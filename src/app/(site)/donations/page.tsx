"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  receivedDonations,
  usedDonations,
  totals,
  type DonationRecord,
} from "@/data/donations";
import { formatCurrency } from "@/lib/utils";

const views = [
  { key: "received", label: "Received" },
  { key: "used", label: "Used" },
  { key: "remaining", label: "Remaining" },
] as const;

type ViewKey = (typeof views)[number]["key"];

export default function DonationsPage() {
  const [activeView, setActiveView] = useState<ViewKey>("received");

  const renderTable = (records: DonationRecord[]) => (
    <div className="overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <table className="w-full text-left">
        <thead className="bg-[rgba(255,140,26,0.12)] text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(255,255,255,0.06)] text-sm text-ink">
          {records.map((record) => (
            <tr key={record.id} className="transition hover:bg-[rgba(255,140,26,0.06)]">
              <td className="px-6 py-4 font-medium">{record.name}</td>
              <td className="px-6 py-4 text-primary">{formatCurrency(record.amount)}</td>
              <td className="px-6 py-4 text-muted">
                {new Date(record.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 space-y-3">
        <h1 className="font-heading text-4xl font-semibold text-ink">
          Donation Management
        </h1>
        <p className="max-w-2xl text-base text-muted">
          Track inflows and utilisation streams side by side with the same controls the Flutter experience offered.
        </p>
      </header>

      <div className="mb-6 inline-flex rounded-full bg-[rgba(255,255,255,0.06)] p-1 shadow-inner shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        {views.map((view) => (
          <button
            key={view.key}
            onClick={() => setActiveView(view.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeView === view.key
                ? "bg-primary text-white shadow"
                : "text-muted hover-text-primary"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeView === "received" && renderTable(receivedDonations)}
          {activeView === "used" && renderTable(usedDonations)}
          {activeView === "remaining" && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] p-6 shadow-sm shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
                <p className="text-sm text-muted">Total Funds</p>
                <p className="mt-3 font-heading text-2xl font-semibold text-ink">
                  {formatCurrency(totals.totalFunds)}
                </p>
              </div>
              <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] p-6 shadow-sm shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
                <p className="text-sm text-muted">Used Funds</p>
                <p className="mt-3 font-heading text-2xl font-semibold text-primary">
                  {formatCurrency(totals.usedFunds)}
                </p>
              </div>
              <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] p-6 shadow-sm shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
                <p className="text-sm text-muted">Remaining Funds</p>
                <p className="mt-3 font-heading text-2xl font-semibold text-secondary">
                  {formatCurrency(totals.remainingFunds)}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
