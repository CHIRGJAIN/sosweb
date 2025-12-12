"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { mockApi } from "@/lib/mock/api";
import { EvidenceGallery } from "@/components/evidence/EvidenceGallery";
import { CaseTimeline } from "@/components/cases/CaseTimeline";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/mock/session";

export default function PartnerCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const [resolution, setResolution] = useState("");
  const [caption, setCaption] = useState("");

  const caseQuery = useQuery({
    queryKey: ["case", params.id],
    queryFn: () => mockApi.fetchCaseById(params.id),
  });

  const uploadMutation = useMutation({
    mutationFn: (captionText: string) =>
      mockApi.uploadEvidence({
        caseId: params.id,
        type: "image",
        caption: captionText,
        uploadedBy: session?.name ?? "Partner",
        source: "AUTHORITY",
      }),
    onSuccess: () => {
      toast.success("Evidence uploaded");
      queryClient.invalidateQueries({ queryKey: ["case", params.id] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: () =>
      mockApi.updateCaseStatus({
        caseId: params.id,
        status: "RESOLVED",
        actor: session?.name ?? "Partner",
        role: session?.role ?? "AUTHORITY",
      }),
    onSuccess: () => {
      toast.success("Case marked resolved (mock)");
      queryClient.invalidateQueries({ queryKey: ["case", params.id] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });

  const resolutionMutation = useMutation({
    mutationFn: () =>
      mockApi.addResolution({
        id: `RES-${Date.now()}`,
        caseId: params.id,
        outcome: "Resolved",
        notes: resolution,
        attachments: [],
        submittedBy: session?.name ?? "Partner",
        createdAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      toast.success("Resolution submitted");
      setResolution("");
    },
  });

  if (caseQuery.isLoading || !caseQuery.data) return <div className="p-6 text-sm text-slate-600">Loading...</div>;

  const caseData = caseQuery.data;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Partner</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{caseData.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{caseData.summary}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.65fr,0.35fr]">
        <div className="space-y-4">
          <EvidenceGallery items={caseData.evidence} />
          <CaseTimeline events={caseData.timeline} />
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Upload authority evidence</p>
            <textarea
              placeholder="Caption"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <Button
              onClick={() => uploadMutation.mutate(caption || "New authority evidence")}
              disabled={uploadMutation.isLoading}
              className="mt-2 rounded-lg px-3 py-2 text-xs font-semibold"
            >
              {uploadMutation.isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Submit resolution</p>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={() => resolutionMutation.mutate()} disabled={resolutionMutation.isLoading}>
                Submit
              </Button>
              <Button variant="ghost" onClick={() => statusMutation.mutate()} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                Mark resolved
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
