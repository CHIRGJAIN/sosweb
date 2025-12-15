"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/lib/mock/api";
import { ColumnDef } from "@tanstack/react-table";
import { StatsCards } from "@/components/common/StatsCards";
import { DataTable } from "@/components/common/DataTable";
import { CaseRecord } from "@/types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { useRouter } from "next/navigation";

export default function OpsOverviewPage() {
  const router = useRouter();
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });
  const { data: escalations = [] } = useQuery({ queryKey: ["escalations"], queryFn: () => mockApi.fetchEscalations() });

  const regionCases = useMemo(() => cases.filter((c) => c.geo.toLowerCase().includes("delhi")), [cases]);
  const waitingEvidence = regionCases.filter((c) => c.status === "PENDING_EVIDENCE");
  const slaAlerts = regionCases.filter((c) => c.slaHours < 24);

  const stats = [
    { label: "Region cases", value: regionCases.length },
    { label: "Pending evidence", value: waitingEvidence.length, tone: "warning" },
    { label: "SLA warnings", value: slaAlerts.length, tone: "warning" },
    { label: "Escalations", value: escalations.length },
  ];

  const columns: ColumnDef<CaseRecord>[] = [
    { header: "Case", accessorKey: "title" },
    { header: "Status", accessorKey: "status" },
    { header: "Severity", accessorKey: "severity" },
    { header: "Geo", accessorKey: "geo" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Ops</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ops overview</h1>
      </div>
      <div className="space-y-4">
        <StatsCards stats={stats} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Cases by severity</p>
            <div style={{ width: "100%", height: 220 }} className="mt-3">
              <ResponsiveContainer>
                <BarChart data={regionCases.reduce((acc: any, c) => {
                  const key = c.severity ?? "UNKNOWN";
                  const found = acc.find((a: any) => a.name === key);
                  if (found) found.count += 1; else acc.push({ name: key, count: 1 });
                  return acc;
                }, [])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Cases over time</p>
            <div style={{ width: "100%", height: 220 }} className="mt-3">
              <ResponsiveContainer>
                <LineChart data={regionCases.reduce((acc: any, c) => {
                  const day = new Date(c.createdAt).toISOString().slice(0,10);
                  const found = acc.find((a: any) => a.date === day);
                  if (found) found.count += 1; else acc.push({ date: day, count: 1 });
                  return acc;
                }, []).sort((a:any,b:any)=>a.date.localeCompare(b.date))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => router.push('/ops/cases')} className="w-full rounded-lg bg-amber-600 px-3 py-2 text-white">View region cases</button>
              <button onClick={() => router.push('/core/cases')} className="w-full rounded-lg border border-amber-600 px-3 py-2 text-amber-600">Open Core Cases</button>
            </div>
          </div>
        </div>
      </div>

      <DataTable<CaseRecord> data={regionCases} columns={columns} />
    </div>
  );
}
