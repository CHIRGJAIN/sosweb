"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { mockApi } from "@/lib/mock/api";
import { UserAccount } from "@/types";
import { useSessionStore } from "@/lib/mock/session";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: () => mockApi.fetchUsers() });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; enabled: boolean }) =>
      mockApi.toggleUser({
        id: payload.id,
        enabled: payload.enabled,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("User updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });

  const columns: ColumnDef<UserAccount>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
    { header: "Department", accessorKey: "department" },
    { header: "Geo", accessorKey: "geo" },
    {
      header: "Enabled",
      cell: ({ row }) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.original.enabled
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {row.original.enabled ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => mutation.mutate({ id: row.original.id, enabled: !row.original.enabled })}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          {row.original.enabled ? "Disable" : "Enable"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Identity</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
      </div>
      <DataTable<UserAccount> data={users} columns={columns} />
    </div>
  );
}
