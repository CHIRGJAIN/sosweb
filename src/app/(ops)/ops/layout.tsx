"use client";

import { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/AppShell";

export default function OpsLayout({ children }: { children: ReactNode }) {
  return <AppShell allowedRoles={["SUB_ADMIN"]}>{children}</AppShell>;
}
