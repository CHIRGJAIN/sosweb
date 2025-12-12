"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "./admin-nav";
import { cn } from "@/lib/utils";

export function AdminNavHideOnScroll() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const moved = Math.abs(currentY - lastY) > 2;

      if (moved) {
        setHidden(true);
      }

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setHidden(false), 200);
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={cn(
        "sticky top-20 z-40 transition-all duration-200",
        hidden ? "-translate-y-4 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      )}
    >
      <div className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--surface)] px-3 py-2 shadow-sm">
        <AdminNav />
      </div>
    </div>
  );
}
