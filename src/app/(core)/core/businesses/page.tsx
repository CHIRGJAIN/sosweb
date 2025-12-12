"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import { mockApi } from "@/lib/mock/api";
import { Business } from "@/types";
import { useSessionStore } from "@/lib/mock/session";
import { Button } from "@/components/ui/button";

export default function BusinessesPage() {
  const queryClient = useQueryClient();
  const { session } = useSessionStore();
  const { data: businesses = [] } = useQuery({ queryKey: ["businesses"], queryFn: () => mockApi.fetchBusinesses() });

  const kycMutation = useMutation({
    mutationFn: (payload: { id: string; status: Business["kycStatus"] }) =>
      mockApi.updateBusinessKyc({
        id: payload.id,
        status: payload.status,
        actor: session?.name ?? "Core Admin",
        role: session?.role ?? "CORE_ADMIN",
      }),
    onSuccess: () => {
      toast.success("Business updated");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });

  const columns: ColumnDef<Business>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Geo", accessorKey: "geo" },
    { header: "Contact", accessorKey: "contact" },
    {
      header: "KYC",
      cell: ({ row }) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {row.original.kycStatus}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => kycMutation.mutate({ id: row.original.id, status: "VERIFIED" })}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            Verify
          </Button>
          <Button
            variant="ghost"
            onClick={() => kycMutation.mutate({ id: row.original.id, status: "REJECTED" })}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Alliances</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Businesses</h1>
      </div>
      <DataTable<Business> data={businesses} columns={columns} />
    </div>
  );
}
