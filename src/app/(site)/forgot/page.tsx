"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { AuthCard } from "@/components/layout/auth-card";
import { Button } from "@/components/ui/button";
import { mockApi } from "@/utils/mockApi";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    const response = await mockApi(() => true, {
      delay: 1200,
      shouldFail: !email.includes("@"),
      errorMessage: "Invalid email address",
    });
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(`Password reset failed: ${response.message ?? "Unknown error"}`);
      return;
    }

    toast.success("Password reset email sent successfully.");
    setEmail("");
  };

  return (
    <AuthCard title="Reset Password" description="Send a recovery link to the email you use across SANKATMOCHAN.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="forgot-email" className="text-sm font-semibold text-ink">
            Email Address
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-soft px-4 py-3 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Sending..." : "Send Recovery Email"}
        </Button>
      </form>
    </AuthCard>
  );
}
