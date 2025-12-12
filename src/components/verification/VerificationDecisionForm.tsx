"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  decision: z.enum(["VERIFIED_TRUE", "VERIFIED_FALSE", "CANNOT_VERIFY", "NEEDS_INFO"]),
  reason: z.string().min(3, "Add a short reason"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onSubmit: (values: FormValues) => Promise<void> | void;
  isLoading?: boolean;
};

export function VerificationDecisionForm({ onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { decision: "VERIFIED_TRUE", reason: "" },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset();
  });

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 dark:text-white">Decision</label>
        <select
          {...register("decision")}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="VERIFIED_TRUE">Verified true</option>
          <option value="VERIFIED_FALSE">Verified false</option>
          <option value="CANNOT_VERIFY">Cannot verify</option>
          <option value="NEEDS_INFO">Needs more info</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 dark:text-white">Reason / notes</label>
        <textarea
          {...register("reason")}
          className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          placeholder="Add audit-friendly notes"
        />
        {errors.reason ? <p className="text-xs text-red-600">{errors.reason.message}</p> : null}
      </div>
      <Button type="submit" disabled={isLoading} className="rounded-xl px-4 py-2 text-sm font-semibold">
        {isLoading ? "Submitting..." : "Submit decision"}
      </Button>
    </form>
  );
}
