"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { crimeCategories, type CrimeCategory } from "@/data/crimeCategories";
import { mockApi } from "@/utils/mockApi";

export default function ReportPage() {
  const [category, setCategory] = useState<CrimeCategory | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!category || description.trim().length < 25) {
      toast.error("Please complete all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    const response = await mockApi(() => true, { delay: 1600 });
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(response.message ?? "Unable to submit report.");
      return;
    }

    setShowSuccess(true);
    setCategory("");
    setDescription("");
  };

  const descriptionTooShort = description.length > 0 && description.length < 25;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <header className="mb-8 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
          Confidential Reporting
        </p>
        <h1 className="font-heading text-4xl font-semibold text-ink">
          Report Unlawful Activity
        </h1>
        <p className="text-base text-muted">
          Your identity remains protected. We only share anonymised intel with vetted crisis responders.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="space-y-2">
          <label htmlFor="crime-type" className="text-sm font-semibold text-ink">
            Select Crime Type
          </label>
          <select
            id="crime-type"
            value={category}
            onChange={(event) => setCategory(event.target.value as CrimeCategory)}
            className="w-full rounded-xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-ink"
          >
            <option value="">Choose an option</option>
            {crimeCategories.map((crime) => (
              <option key={crime} value={crime}>
                {crime}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold text-ink">
            Describe the Incident
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            placeholder="Share precise details. Helps field teams act swiftly."
            className={`w-full rounded-2xl border bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-ink placeholder:text-muted ${
              descriptionTooShort ? "border-red-400" : "border-[rgba(255,255,255,0.14)]"
            }`}
          />
          {descriptionTooShort ? (
            <p className="text-xs text-red-500">
              Please provide at least 25 characters so our team can understand the situation.
            </p>
          ) : (
            <p className="text-xs text-muted">
              We anonymise your report, but sharing date, landmarks, and involved parties accelerates action.
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-muted">
          SANKATMOCHAN teams operate with strict confidentiality. Your information routes through encrypted nodes mirrored from the Flutter workflow.
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </form>

      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Report Submitted"
      >
        <p className="text-sm text-muted">
          Your report has been successfully submitted. Our crisis intelligence desk is reviewing the information and will deploy responders if needed.
        </p>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowSuccess(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
