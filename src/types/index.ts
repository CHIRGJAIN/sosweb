export type Role = "CORE_ADMIN" | "SUB_ADMIN" | "AUTHORITY" | "NGO" | "BUSINESS";

export type PermissionKey =
  | "CASE_READ"
  | "CASE_WRITE"
  | "CASE_ASSIGN"
  | "CASE_VERIFY"
  | "EVIDENCE_UPLOAD"
  | "EVIDENCE_REVIEW"
  | "FINANCE_LEDGER_READ"
  | "FINANCE_DISBURSE_REQUEST"
  | "FINANCE_DISBURSE_APPROVE"
  | "RESERVOIR_RULES_MANAGE"
  | "PUBLISH_QUEUE_READ"
  | "PUBLISH_EXECUTE"
  | "BUSINESS_MANAGE"
  | "CAMPAIGN_APPROVE"
  | "VAULT_READ"
  | "VAULT_REDACT"
  | "VAULT_EXPORT"
  | "USER_MANAGE"
  | "ROLE_MANAGE"
  | "AUDIT_READ";

export type CaseSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type CaseStatus = "OPEN" | "ASSIGNED" | "PENDING_EVIDENCE" | "VERIFICATION" | "RESOLVED" | "CLOSED" | "ESCALATED";
export type VerificationStage = "USER_EVIDENCE_REVIEW" | "AUTHORITY_VERIFICATION" | "FINAL_APPROVAL";

export type VerificationDecision = "VERIFIED_TRUE" | "VERIFIED_FALSE" | "CANNOT_VERIFY" | "NEEDS_INFO";

export type EvidenceType = "image" | "video" | "document";
export type EvidenceSource = "REPORTER" | "AUTHORITY" | "ADMIN";

export type LedgerType = "RECEIVED" | "USED" | "RESERVOIR";

export type DisbursementStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PublishingStatus = "READY" | "SCHEDULED" | "PUBLISHED" | "UNPUBLISHED" | "SUBMITTED";
export type VaultStatus = "OPEN" | "MASKED" | "REVIEW" | "CLOSED";
export type CampaignStatus = "REVIEW" | "APPROVED" | "REJECTED";

export type GeoScope = {
  region: string;
  district?: string;
};

export type SessionUser = {
  name: string;
  email: string;
  role: Role;
  geoScope: GeoScope;
  department?: string;
  partnerType?: "AUTHORITY" | "NGO" | "BUSINESS";
};

export type CaseTimelineEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  notes?: string;
  status?: CaseStatus;
};

export type EvidenceItem = {
  id: string;
  caseId: string;
  type: EvidenceType;
  source: EvidenceSource;
  url: string;
  hash: string;
  uploadedBy: string;
  createdAt: string;
  caption?: string;
  visibility?: "masked" | "visible";
};

export type CaseRecord = {
  id: string;
  title: string;
  status: CaseStatus;
  severity: CaseSeverity;
  type: string;
  geo: string;
  createdAt: string;
  updatedAt: string;
  stage: VerificationStage;
  assignedTo?: string;
  slaHours: number;
  reporter: { name: string; channel: string };
  summary: string;
  tags: string[];
  timeline: CaseTimelineEvent[];
  evidence: EvidenceItem[];
};

export type VerificationItem = {
  id: string;
  caseId: string;
  stage: VerificationStage;
  status: "PENDING" | "IN_REVIEW" | "DECIDED";
  submittedBy: string;
  createdAt: string;
  evidenceIds: string[];
  decision?: VerificationDecision;
  reason?: string;
};

export type LedgerEntry = {
  id: string;
  type: LedgerType;
  amount: number;
  currency: "INR";
  source: string;
  category: string;
  geo: string;
  createdAt: string;
  caseId?: string;
  notes?: string;
};

export type DisbursementRequest = {
  id: string;
  caseId: string;
  amount: number;
  requestedBy: string;
  status: DisbursementStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
};

export type ReservoirRule = {
  id: string;
  name: string;
  value: string;
  description: string;
  updatedAt: string;
};

export type PublishingItem = {
  id: string;
  caseId?: string;
  title: string;
  channel: "SMS" | "Social" | "Press";
  status: PublishingStatus;
  scheduledFor?: string;
  createdAt: string;
};

export type Business = {
  id: string;
  name: string;
  category: string;
  geo: string;
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  contact: string;
};

export type Campaign = {
  id: string;
  businessId: string;
  title: string;
  budget: number;
  status: CampaignStatus;
  tier: "A" | "B" | "C";
  submittedAt: string;
};

export type VaultReport = {
  id: string;
  category: string;
  status: VaultStatus;
  createdAt: string;
  assignedReviewer: string;
  maskedSummary: string;
  evidenceIds: string[];
  redactionNotes: string;
};

export type AuditLog = {
  id: string;
  createdAt: string;
  actor: string;
  role: Role;
  action: string;
  entity: string;
  entityId: string;
  meta?: Record<string, string | number | boolean>;
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  geo: string;
  enabled: boolean;
};

export type RoleDefinition = {
  role: Role;
  grants: PermissionKey[];
};

export type EscalationItem = {
  id: string;
  caseId: string;
  status: "ASSIGNED" | "ACKNOWLEDGED" | "PENDING_REVIEW";
  maskedNotes: string;
  assignedTo: string;
  createdAt: string;
};

export type UtilizationReport = {
  id: string;
  ngo: string;
  period: string;
  amount: number;
  receipts: string[];
  status: "DRAFT" | "SUBMITTED" | "ACCEPTED";
};

export type ResolutionRecord = {
  id: string;
  caseId: string;
  outcome: string;
  notes: string;
  attachments: string[];
  submittedBy: string;
  createdAt: string;
};
