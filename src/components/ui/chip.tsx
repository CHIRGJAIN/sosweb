"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ active, className, children, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] text-muted hover-border-primary hover-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
