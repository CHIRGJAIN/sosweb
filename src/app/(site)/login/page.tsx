"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthCard } from "@/components/layout/auth-card";
import { Button } from "@/components/ui/button";
import { mockApi } from "@/utils/mockApi";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login: setLoggedIn } = useAuthStore();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Login failed: Missing email or password");
      return;
    }

    setIsSubmitting(true);
    const response = await mockApi(() => ({ token: "demo" }), {
      delay: 1200,
      shouldFail: password !== "helpline",
      errorMessage: "Invalid credentials",
    });
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error(`Login failed: ${response.message ?? "Unknown error"}`);
      return;
    }

    setLoggedIn();
    toast.success("Welcome back to SANKATMOCHAN");
    router.push("/admin");
  };

  return (
    <AuthCard title="Login" description="Enter the credentials you use in the mobile SANKATMOCHAN app.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-soft bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-ink placeholder:text-muted"
            placeholder="test@example.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-soft bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-ink placeholder:text-muted"
            placeholder="Enter password"
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="flex items-center justify-between text-sm">
        <Link href="/forgot" className="text-primary">
          Forgot Password?
        </Link>
        <Link href="/signup" className="text-muted hover-text-primary">
          Create Account
        </Link>
      </div>
    </AuthCard>
  );
}
