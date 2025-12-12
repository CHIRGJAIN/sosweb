import { PermissionKey, Role, RoleDefinition } from "@/types";
import { permissionLabels } from "@/lib/rbac/permissions";

type Props = {
  roles: RoleDefinition[];
};

export function PermissionMatrix({ roles }: Props) {
  const roleOrder: Role[] = ["CORE_ADMIN", "SUB_ADMIN", "AUTHORITY", "NGO", "BUSINESS"];
  const permissions = Object.keys(permissionLabels) as PermissionKey[];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-200">
              Permission
            </th>
            {roleOrder.map((role) => (
              <th key={role} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-200">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {permissions.map((perm) => (
            <tr key={perm}>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{permissionLabels[perm]}</td>
              {roleOrder.map((role) => {
                const roleEntry = roles.find((r) => r.role === role);
                const granted = roleEntry?.grants.includes(perm) ?? false;
                return (
                  <td key={role} className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        granted
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      {granted ? "✓" : "–"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
