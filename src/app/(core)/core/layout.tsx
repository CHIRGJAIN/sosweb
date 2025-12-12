"use client";

import { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/AppShell";

export default function CoreLayout({ children }: { children: ReactNode }) {
  return <AppShell allowedRoles={["CORE_ADMIN"]}>{children}</AppShell>;
}
