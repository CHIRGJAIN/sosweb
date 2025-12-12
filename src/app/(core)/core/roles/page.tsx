"use client";

import { useQuery } from "@tanstack/react-query";
import { PermissionMatrix } from "@/components/users/PermissionMatrix";
import { mockApi } from "@/lib/mock/api";

export default function RolesPage() {
  const { data: roles = [] } = useQuery({ queryKey: ["roles"], queryFn: () => mockApi.fetchRoles() });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">RBAC</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Roles & permissions</h1>
      </div>
      <PermissionMatrix roles={roles} />
    </div>
  );
}
