"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { mockApi } from "@/utils/mockApi";

export default function AnonymousPage() {
  const [problem, setProblem] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const problemTooShort = useMemo(() => problem.trim().length > 0 && problem.trim().length < 10, [problem]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (nextFile) {
      setFile(nextFile);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (problem.trim().length < 10) {
      toast.error("Please describe your problem with at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    const response = await mockApi(() => true, { delay: 1200 });
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(response.message ?? "Unable to submit problem right now.");
      return;
    }

    toast.success("Problem submitted successfully!");
    setProblem("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[color:var(--background)] py-16">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-8 space-y-3 text-center">
          <h1 className="font-heading text-4xl font-semibold text-ink">
            Anonymous Problem Reporting
          </h1>
          <p className="text-base text-muted">
            Continue to file sensitive reports without revealing your identity—mirroring the anonymous channel in the Flutter app.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="space-y-2">
            <label htmlFor="anonymous-problem" className="text-sm font-semibold text-ink">
              Describe your problem anonymously…
            </label>
            <textarea
              id="anonymous-problem"
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              rows={5}
              placeholder="Share as much detail as possible while staying safe."
              className={`w-full rounded-2xl border bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-ink placeholder:text-muted ${
                problemTooShort ? "border-red-400" : "border-[rgba(255,255,255,0.14)]"
              }`}
            />
            {problemTooShort ? (
              <p className="text-xs text-red-500">
                Please provide at least 10 characters so our team can understand the issue.
              </p>
            ) : (
              <p className="text-xs text-muted">
                Details stay encrypted inside SANKATMOCHAN command servers. Share contexts, times, or evidence if possible.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-ink">Evidence (optional)</label>
            <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Pick an Image (Optional)
            </Button>
            <input
              id="anonymous-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {previewUrl ? (
              <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
              </div>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Anonymously"}
          </Button>
        </form>
      </div>
    </div>
  );
}
