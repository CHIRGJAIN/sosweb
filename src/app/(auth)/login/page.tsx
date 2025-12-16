"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HARD_CODED_CREDENTIALS, useSessionStore } from "@/lib/mock/session";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(3, "Password required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-6 py-12 text-white">
          <p className="text-sm text-slate-200">Loading login...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { login, session, hydrate } = useSessionStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (session) {
      router.replace(next ?? session.defaultRoute);
    }
  }, [next, router, session]);

  const onSubmit = handleSubmit(async (values) => {
    const result = await login(values.email, values.password);
    if (!result.ok) {
      toast.error(result.error ?? "Unable to login");
      return;
    }
    toast.success("Logged in to SOS Admin");
    router.replace(next ?? result.route ?? "/core/command-center");
  });

  const quickFill = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black px-6 py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr,0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">SOS Admin</p>
          <h1 className="mt-3 text-3xl font-bold">Secure Operations Suite</h1>
          <p className="mt-2 text-sm text-slate-200/90">
            Select a dashboard role and sign in with the hardcoded credentials below. Auth is mocked client-side only.
          </p>
          <div className="mt-6 space-y-4">
            {HARD_CODED_CREDENTIALS.slice(0, 3).map((cred) => (
              <button
                type="button"
                key={cred.email}
                onClick={() => quickFill(cred.email, cred.password)}
                className="w-full rounded-2xl border border-amber-400/20 bg-white/5 p-4 text-left transition hover:border-amber-300/50 hover:bg-white/10"
              >
                <div className="flex items-center justify-between text-sm text-amber-200">
                  <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200">
                    {cred.role}
                  </span>
                  <span className="text-amber-100/80">{cred.route}</span>
                </div>
                <p className="mt-2 font-semibold">{cred.email}</p>
                <p className="text-sm text-slate-200/80">Password: {cred.password}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Role switcher</p>
            <p className="mt-2 text-slate-200/80">
              After login, use the topbar role switcher to preview CORE, OPS, and AUTHORITY/NGO/BUSINESS permissions.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
            <p className="text-sm text-slate-600">
              Environment is mocked; credentials are provided for preview.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
              {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
              {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/" className="text-slate-600 hover:text-amber-700">
              Back to site
            </Link>
            <p className="text-slate-500">Frontend-only login. No backend calls.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
