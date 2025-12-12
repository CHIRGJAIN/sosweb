import { AuditLog } from "@/types";
import { DataTable } from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  logs: AuditLog[];
};

export function AuditLogTable({ logs }: Props) {
  const columns: ColumnDef<AuditLog>[] = [
    { accessorKey: "createdAt", header: "Time" },
    { accessorKey: "actor", header: "Actor" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "action", header: "Action" },
    { accessorKey: "entity", header: "Entity" },
    { accessorKey: "entityId", header: "Entity ID" },
  ];
  return <DataTable data={logs} columns={columns} pageSize={8} />;
}
