"use client";

import { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/AppShell";

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return <AppShell allowedRoles={["AUTHORITY", "NGO", "BUSINESS"]}>{children}</AppShell>;
}
