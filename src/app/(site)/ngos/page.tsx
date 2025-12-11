"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ngos, type Ngo } from "@/data/ngos";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency } from "@/lib/utils";
import { mockApi } from "@/utils/mockApi";

export default function NgosPage() {
  const [selectedNgo, setSelectedNgo] = useState<Ngo | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const requiredColumns = "grid gap-6 sm:grid-cols-2 xl:grid-cols-3";

  const handleProceed = async () => {
    if (!selectedNgo) return;
    setIsProcessing(true);
    const response = await mockApi(() => selectedNgo, { delay: 1400 });
    setIsProcessing(false);

    if (!response.ok) {
      toast.error(response.message ?? "Unable to process donation right now.");
      return;
    }

    toast.success("Donation Successful");
    setShowSuccess(true);
    setSelectedNgo(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 space-y-3">
        <h1 className="font-heading text-4xl font-semibold text-ink">
          NGOs and Public Services
        </h1>
        <p className="max-w-2xl text-base text-muted">
          Discover the same vetted organisations from the Flutter experience, now optimised for desktop response control rooms.
        </p>
      </div>

      <div className={requiredColumns}>
        {ngos.map((ngo) => {
          const percent = Math.round((ngo.received / ngo.required) * 100);
          return (
            <article
              key={ngo.id}
              className="flex flex-col gap-4 rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[color:var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <Image
                src={ngo.imageUrl}
                alt={ngo.title}
                width={400}
                height={220}
                className="h-48 w-full rounded-2xl object-cover"
              />
              <div className="space-y-3">
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-ink">
                    {ngo.title}
                  </h3>
                  <p className="text-sm text-muted">{ngo.description}</p>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-primary-soft px-4 py-3">
                    <dt className="text-muted">Required</dt>
                    <dd className="font-semibold text-ink">{formatCurrency(ngo.required)}</dd>
                  </div>
                  <div className="rounded-xl bg-[#e8f4ff] px-4 py-3">
                    <dt className="text-muted">Received</dt>
                    <dd className="font-semibold text-secondary">{formatCurrency(ngo.received)}</dd>
                  </div>
                  <div className="col-span-2">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted">
                      <span>Progress</span>
                      <span>{percent}%</span>
                    </div>
                    <ProgressBar value={ngo.received} max={ngo.required} />
                  </div>
                  <div className="col-span-2 text-sm text-muted">
                    Contact: <span className="font-medium text-ink">{ngo.contact}</span>
                  </div>
                </dl>
              </div>
              <Button onClick={() => setSelectedNgo(ngo)}>Donate Now</Button>
            </article>
          );
        })}
      </div>

      <Modal
        open={Boolean(selectedNgo)}
        onClose={() => {
          setSelectedNgo(null);
          setIsProcessing(false);
        }}
        title={selectedNgo?.title ?? ""}
        description="Review the commitment and confirm your pledge to receive payment instructions."
      >
        <div className="space-y-4 text-sm text-muted">
          <p>
            You are supporting <span className="font-semibold text-ink">{selectedNgo?.title}</span>. Funds are routed through verified SANKATMOCHAN coordinators with transparent reconciliation logs.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>We will share an instant payment link and acknowledgement receipt.</li>
            <li>Contribution will be tagged against the organisation&apos;s utilisation ledger.</li>
          </ul>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setSelectedNgo(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleProceed}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Donation Successful"
      >
        <div className="space-y-4 text-sm text-muted">
          <p>
            Thank you for extending support. A confirmation email with reconciliation details has been sent to your registered address.
          </p>
          <Button type="button" onClick={() => setShowSuccess(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
