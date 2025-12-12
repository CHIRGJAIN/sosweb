import { PermissionKey, Role } from "@/types";
import { mockRoles } from "@/lib/mock/data";

export const PERMISSIONS: PermissionKey[] = [
  "CASE_READ",
  "CASE_WRITE",
  "CASE_ASSIGN",
  "CASE_VERIFY",
  "EVIDENCE_UPLOAD",
  "EVIDENCE_REVIEW",
  "FINANCE_LEDGER_READ",
  "FINANCE_DISBURSE_REQUEST",
  "FINANCE_DISBURSE_APPROVE",
  "RESERVOIR_RULES_MANAGE",
  "PUBLISH_QUEUE_READ",
  "PUBLISH_EXECUTE",
  "BUSINESS_MANAGE",
  "CAMPAIGN_APPROVE",
  "VAULT_READ",
  "VAULT_REDACT",
  "VAULT_EXPORT",
  "USER_MANAGE",
  "ROLE_MANAGE",
  "AUDIT_READ",
];

export const ROLE_PERMISSIONS: Record<Role, PermissionKey[]> = mockRoles.reduce(
  (acc, item) => ({ ...acc, [item.role]: item.grants }),
  {} as Record<Role, PermissionKey[]>
);

export const permissionLabels: Record<PermissionKey, string> = {
  CASE_READ: "Read cases",
  CASE_WRITE: "Update cases",
  CASE_ASSIGN: "Assign cases",
  CASE_VERIFY: "Verify cases",
  EVIDENCE_UPLOAD: "Upload evidence",
  EVIDENCE_REVIEW: "Review evidence",
  FINANCE_LEDGER_READ: "View ledger",
  FINANCE_DISBURSE_REQUEST: "Request disbursement",
  FINANCE_DISBURSE_APPROVE: "Approve disbursement",
  RESERVOIR_RULES_MANAGE: "Manage reservoir rules",
  PUBLISH_QUEUE_READ: "View publishing queue",
  PUBLISH_EXECUTE: "Publish/unpublish",
  BUSINESS_MANAGE: "Manage businesses",
  CAMPAIGN_APPROVE: "Approve campaigns",
  VAULT_READ: "Access vault",
  VAULT_REDACT: "Redact vault content",
  VAULT_EXPORT: "Export vault artifacts",
  USER_MANAGE: "Manage users",
  ROLE_MANAGE: "Manage roles",
  AUDIT_READ: "View audit logs",
};
