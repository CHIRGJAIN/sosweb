"use client";

import { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/AppShell";

export default function ResponderLayout({ children }: { children: ReactNode }) {
  return <AppShell allowedRoles={["AUTHORITY"]}>{children}</AppShell>;
}
