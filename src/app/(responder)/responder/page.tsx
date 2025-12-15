"use client";

import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/lib/mock/api";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useRouter } from "next/navigation";

export default function AuthorityDashboard() {
  const router = useRouter();
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: () => mockApi.fetchCases() });
  const { data: queue = [] } = useQuery({ queryKey: ["verification"], queryFn: () => mockApi.fetchVerificationQueue() });

  const statusCounts = Object.values(cases.reduce((acc: any, c: any) => {
    acc[c.status] = (acc[c.status] || 0) + 1; return acc;
  }, {})).length ? Object.entries(cases.reduce((acc: any, c: any) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value })) : [];

  const severityData = Object.entries(cases.reduce((acc: any, c: any) => { const k = c.severity || 'UNKNOWN'; acc[k] = (acc[k]||0)+1; return acc; }, {})).map(([name, value]) => ({ name, value }));
  const COLORS = ["#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#a78bfa"];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Authority</p>
        <h1 className="text-2xl font-bold">Authority dashboard</h1>
        <p className="text-sm text-slate-600">Quick overview for verification and assigned cases.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold">Verification queue</p>
          <p className="text-xs text-slate-500">Pending items: {queue?.length ?? 0}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button onClick={() => router.push('/core/verification')} className="rounded-lg bg-amber-600 px-3 py-2 text-white">Go to verification</button>
            <button onClick={() => router.push('/responder/assignments')} className="rounded-lg border border-slate-200 px-3 py-2">My assignments</button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold">Cases by status</p>
          <div style={{ width: '100%', height: 180 }} className="mt-3">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" outerRadius={60} fill="#8884d8">
                  {statusCounts.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold">Cases by severity</p>
          <div style={{ width: '100%', height: 220 }} className="mt-3">
            <ResponsiveContainer>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold">Quick actions</p>
          <div className="mt-3 flex flex-col gap-2">
            <button onClick={() => router.push('/partner/cases')} className="rounded-lg border px-3 py-2">View partner assigned cases</button>
            <button onClick={() => router.push('/partner/ngo/reports')} className="rounded-lg border px-3 py-2">Open NGO reports</button>
          </div>
        </div>
      </div>
    </div>
  );
}
