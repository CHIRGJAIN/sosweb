import { type ComponentType } from "react";
import { PermissionKey, Role } from "@/types";
import { ROLE_PERMISSIONS } from "./permissions";

export function hasPermission(role: Role | undefined | null, permission: PermissionKey) {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role | undefined | null, permissions: PermissionKey[]) {
  return permissions.some((perm) => hasPermission(role, perm));
}

export type NavItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  permissions?: PermissionKey[];
  badge?: string;
};

export function filterNav(role: Role | undefined | null, items: NavItem[]) {
  return items.filter((item) => !item.permissions || hasAnyPermission(role, item.permissions));
}
