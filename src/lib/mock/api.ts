import { v4 as uuidv4 } from "uuid";
import type {
  Case,
  Evidence,
  RoutingRule,
  DirectoryItem,
  ModerationItem,
  UserProfile,
  AssignedTo,
} from "@/types/sos";
import {
  AuditLog,
  Business,
  Campaign,
  CaseRecord,
  CaseStatus,
  EscalationItem,
  EvidenceItem,
  LedgerEntry,
  PermissionKey,
  PublishingItem,
  Role,
  UtilizationReport,
  VaultReport,
  VerificationDecision,
  VerificationItem,
  ResolutionRecord,
} from "@/types";
import {
  mockAuditLogs,
  mockBusinesses,
  mockCampaigns,
  mockCases,
  mockDisbursements,
  mockEscalations,
  mockLedgerEntries,
  mockPublishingQueue,
  mockReservoirRules,
  mockRoles,
  mockUsers,
  mockVaultReports,
  mockVerificationQueue,
  mockUtilizationReports,
  mockResolutionRecords,
} from "./data";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const nowIso = () => new Date().toISOString();

let casesState = [...mockCases];
let verificationQueueState = [...mockVerificationQueue];
const ledgerState = [...mockLedgerEntries];
let disbursementState = [...mockDisbursements];
let reservoirRulesState = [...mockReservoirRules];
let routingRulesState: RoutingRule[] = [
  { id: "RT-01", category: "MEDICAL", department: "Health Authority", defaultResponderGroup: "Health Responders" },
  { id: "RT-02", category: "FIRE", department: "Fire Department", defaultResponderGroup: "Fire Units" },
  { id: "RT-03", category: "OTHER", department: "Ops Desk", defaultResponderGroup: "Ops" },
];
let directoryState: DirectoryItem[] = [
  { id: "DIR-01", name: "Relief Volunteers", type: "NGO", contact: "volunteers@relief.local", description: "Volunteer coordination and on-ground support" },
  { id: "DIR-02", name: "Health Shield", type: "NGO", contact: "contact@healthshield.org", description: "Medical relief and supplies" },
  { id: "DIR-03", name: "City Water Services", type: "SERVICE", contact: "water@city.local", description: "Water distribution and management" },
];
let moderationState: ModerationItem[] = [
  { id: "MOD-01", postId: "POST-101", reporterId: "USR-04", reason: "Inaccurate medical advice", status: "PENDING" },
  { id: "MOD-02", postId: "POST-102", reporterId: "USR-05", reason: "Hate speech", status: "PENDING" },
];
let publishingState = [...mockPublishingQueue];
let businessesState = [...mockBusinesses];
let campaignsState = [...mockCampaigns];
let vaultReportsState = [...mockVaultReports];
let auditState = [...mockAuditLogs];
let usersState = [...mockUsers];
let rolesState = [...mockRoles];
let escalationsState = [...mockEscalations];
let utilizationState = [...mockUtilizationReports];
let resolutionState = [...mockResolutionRecords];

function recordAudit(entry: Omit<AuditLog, "id" | "createdAt">) {
  const audit: AuditLog = {
    id: `AUD-${auditState.length + 1}`.padStart(7, "0"),
    createdAt: nowIso(),
    ...entry,
  };
  auditState = [audit, ...auditState];
  return audit;
}

function getCase(caseId: string) {
  const caseItem = casesState.find((item) => item.id === caseId);
  if (!caseItem) {
    throw new Error(`Case ${caseId} not found`);
  }
  return caseItem;
}

export async function fetchCases(params: {
  status?: CaseStatus;
  severity?: CaseRecord["severity"];
  search?: string;
  geo?: string;
  stage?: CaseRecord["stage"];
} = {}): Promise<CaseRecord[]> {
  await delay();
  const { status, severity, search, geo, stage } = params;
  return casesState.filter((item) => {
    if (status && item.status !== status) return false;
    if (severity && item.severity !== severity) return false;
    if (geo && !item.geo.toLowerCase().includes(geo.toLowerCase())) return false;
    if (stage && item.stage !== stage) return false;
    if (search) {
      const haystack = `${item.id} ${item.title} ${item.summary} ${item.geo}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });
}

export async function fetchCaseById(caseId: string): Promise<CaseRecord> {
  await delay();
  return structuredClone(getCase(caseId));
}

export async function updateCaseStatus(params: {
  caseId: string;
  status: CaseStatus;
  actor: string;
  role: Role;
  note?: string;
}) {
  await delay();
  const index = casesState.findIndex((item) => item.id === params.caseId);
  if (index === -1) throw new Error("Case not found");
  const updated: CaseRecord = {
    ...casesState[index],
    status: params.status,
    updatedAt: nowIso(),
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: nowIso(),
        actor: params.actor,
        action: `Status updated to ${params.status}`,
        notes: params.note,
        status: params.status,
      },
      ...casesState[index].timeline,
    ],
  };
  casesState[index] = updated;
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "update_case_status",
    entity: "Case",
    entityId: params.caseId,
    meta: { status: params.status },
  });
  return updated;
}

export async function assignCase(params: { caseId: string; assignee: string; actor: string; role: Role }) {
  await delay();
  const index = casesState.findIndex((item) => item.id === params.caseId);
  if (index === -1) throw new Error("Case not found");
  const updated: CaseRecord = {
    ...casesState[index],
    assignedTo: params.assignee,
    updatedAt: nowIso(),
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: nowIso(),
        actor: params.actor,
        action: `Assigned to ${params.assignee}`,
        status: "ASSIGNED",
      },
      ...casesState[index].timeline,
    ],
  };
  casesState[index] = updated;
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "assign_case",
    entity: "Case",
    entityId: params.caseId,
    meta: { assignee: params.assignee },
  });
  return updated;
}

export async function fetchVerificationQueue(stage?: VerificationItem["stage"]) {
  await delay();
  return verificationQueueState.filter((item) => (stage ? item.stage === stage : true));
}

export async function submitVerificationDecision(params: {
  itemId: string;
  decision: VerificationDecision;
  reason?: string;
  actor: string;
  role: Role;
}) {
  await delay();
  const queueItem = verificationQueueState.find((item) => item.id === params.itemId);
  if (!queueItem) throw new Error("Queue item not found");
  const caseIndex = casesState.findIndex((item) => item.id === queueItem.caseId);
  if (caseIndex === -1) throw new Error("Case not found");

  verificationQueueState = verificationQueueState.filter((item) => item.id !== params.itemId);
  const updatedCase: CaseRecord = {
    ...casesState[caseIndex],
    stage: queueItem.stage === "FINAL_APPROVAL" ? "FINAL_APPROVAL" : "AUTHORITY_VERIFICATION",
    status: params.decision === "VERIFIED_TRUE" ? "RESOLVED" : casesState[caseIndex].status,
    updatedAt: nowIso(),
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: nowIso(),
        actor: params.actor,
        action: `Verification decision: ${params.decision.replaceAll("_", " ")}`,
        notes: params.reason,
        status: casesState[caseIndex].status,
      },
      ...casesState[caseIndex].timeline,
    ],
  };
  casesState[caseIndex] = updatedCase;

  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "verification_decision",
    entity: "Case",
    entityId: queueItem.caseId,
    meta: { decision: params.decision },
  });
  return updatedCase;
}

export async function fetchLedger(type?: LedgerEntry["type"]) {
  await delay();
  return ledgerState.filter((item) => (type ? item.type === type : true));
}

export async function exportLedgerCsv(filtered: LedgerEntry[]) {
  const header = ["ID", "Type", "Amount", "Source", "Category", "Geo", "CaseId", "CreatedAt"];
  const rows = filtered.map((entry) =>
    [
      entry.id,
      entry.type,
      entry.amount,
      entry.source,
      entry.category,
      entry.geo,
      entry.caseId ?? "",
      entry.createdAt,
    ].join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

export async function fetchDisbursements() {
  await delay();
  return disbursementState;
}

export async function decideDisbursement(params: {
  id: string;
  decision: "APPROVED" | "REJECTED";
  actor: string;
  role: Role;
  reason?: string;
}) {
  await delay();
  disbursementState = disbursementState.map((item) =>
    item.id === params.id
      ? { ...item, status: params.decision, updatedAt: nowIso(), reason: params.reason ?? item.reason }
      : item
  );
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: params.decision === "APPROVED" ? "approved_disbursement" : "rejected_disbursement",
    entity: "DisbursementRequest",
    entityId: params.id,
    meta: { decision: params.decision },
  });
  return disbursementState.find((item) => item.id === params.id)!;
}

export async function fetchReservoirRules() {
  await delay();
  return reservoirRulesState;
}

export async function listRoutingRules() {
  await delay();
  return routingRulesState;
}

export async function listDirectory(type?: DirectoryItem["type"]) {
  await delay();
  return directoryState.filter((d) => (type ? d.type === type : true));
}

export async function listModerationQueue(status?: ModerationItem["status"]) {
  await delay();
  return moderationState.filter((m) => (status ? m.status === status : true));
}

export async function updateReservoirRule(params: { id: string; value: string; actor: string; role: Role }) {
  await delay();
  reservoirRulesState = reservoirRulesState.map((rule) =>
    rule.id === params.id ? { ...rule, value: params.value, updatedAt: nowIso() } : rule
  );
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "update_reservoir_rule",
    entity: "ReservoirRule",
    entityId: params.id,
  });
  return reservoirRulesState.find((rule) => rule.id === params.id)!;
}

export async function fetchPublishingQueue() {
  await delay();
  return publishingState;
}

export async function updatePublishingStatus(params: {
  id: string;
  status: PublishingItem["status"];
  actor: string;
  role: Role;
  reason?: string;
}) {
  await delay();
  publishingState = publishingState.map((item) =>
    item.id === params.id
      ? { ...item, status: params.status, scheduledFor: item.scheduledFor ?? nowIso() }
      : item
  );
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "update_publishing",
    entity: "PublishingItem",
    entityId: params.id,
    meta: { status: params.status, ...(params.reason && { reason: params.reason }) },
  });
  return publishingState.find((item) => item.id === params.id)!;
}

export async function fetchBusinesses() {
  await delay();
  return businessesState;
}

export async function updateBusinessKyc(params: {
  id: string;
  status: Business["kycStatus"];
  actor: string;
  role: Role;
}) {
  await delay();
  businessesState = businessesState.map((biz) => (biz.id === params.id ? { ...biz, kycStatus: params.status } : biz));
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "update_business_kyc",
    entity: "Business",
    entityId: params.id,
    meta: { status: params.status },
  });
  return businessesState.find((biz) => biz.id === params.id)!;
}

export async function fetchCampaigns() {
  await delay();
  return campaignsState;
}

export async function decideCampaign(params: {
  id: string;
  status: Campaign["status"];
  actor: string;
  role: Role;
  tier?: Campaign["tier"];
}) {
  await delay();
  campaignsState = campaignsState.map((campaign) =>
    campaign.id === params.id ? { ...campaign, status: params.status, tier: params.tier ?? campaign.tier } : campaign
  );
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "campaign_decision",
    entity: "Campaign",
    entityId: params.id,
    meta: { status: params.status },
  });
  return campaignsState.find((campaign) => campaign.id === params.id)!;
}

export async function fetchVaultReports() {
  await delay();
  return vaultReportsState;
}

export async function updateRedaction(params: {
  id: string;
  notes: string;
  status?: VaultReport["status"];
  actor: string;
  role: Role;
}) {
  await delay();
  vaultReportsState = vaultReportsState.map((report) =>
    report.id === params.id ? { ...report, redactionNotes: params.notes, status: params.status ?? report.status } : report
  );
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "update_redaction",
    entity: "VaultReport",
    entityId: params.id,
  });
  return vaultReportsState.find((report) => report.id === params.id)!;
}

export async function fetchAuditLogs() {
  await delay();
  return auditState;
}

export async function fetchUsers() {
  await delay();
  return usersState;
}

export async function toggleUser(params: { id: string; enabled: boolean; actor: string; role: Role }) {
  await delay();
  usersState = usersState.map((user) => (user.id === params.id ? { ...user, enabled: params.enabled } : user));
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "toggle_user",
    entity: "User",
    entityId: params.id,
    meta: { enabled: params.enabled },
  });
  return usersState.find((user) => user.id === params.id)!;
}

export async function fetchRoles() {
  await delay();
  return rolesState;
}

export async function updateRoleGrants(params: { role: Role; grants: PermissionKey[]; actor: string; actorRole: Role }) {
  await delay();
  rolesState = rolesState.map((roleDef) => (roleDef.role === params.role ? { ...roleDef, grants: params.grants } : roleDef));
  recordAudit({
    actor: params.actor,
    role: params.actorRole,
    action: "update_role",
    entity: "Role",
    entityId: params.role,
  });
  return rolesState.find((roleDef) => roleDef.role === params.role)!;
}

export async function fetchEscalations() {
  await delay();
  return escalationsState;
}

export async function updateEscalation(params: { id: string; status: EscalationItem["status"]; actor: string; role: Role }) {
  await delay();
  escalationsState = escalationsState.map((item) => (item.id === params.id ? { ...item, status: params.status } : item));
  recordAudit({
    actor: params.actor,
    role: params.role,
    action: "update_escalation",
    entity: "Escalation",
    entityId: params.id,
    meta: { status: params.status },
  });
  return escalationsState.find((item) => item.id === params.id)!;
}

export async function uploadEvidence(params: {
  caseId: string;
  type: EvidenceItem["type"];
  caption?: string;
  uploadedBy: string;
  source: EvidenceItem["source"];
}) {
  await delay(600);
  const newEvidence: EvidenceItem = {
    id: `ev-${Date.now()}`,
    caseId: params.caseId,
    type: params.type,
    source: params.source,
    url: "https://images.unsplash.com/photo-1502303756780-8b52d9cf6ff1?w=600",
    hash: `hash-${Date.now()}`,
    uploadedBy: params.uploadedBy,
    createdAt: nowIso(),
    caption: params.caption,
  };

  casesState = casesState.map((item) =>
    item.id === params.caseId ? { ...item, evidence: [...item.evidence, newEvidence] } : item
  );

  recordAudit({
    actor: params.uploadedBy,
    role: "AUTHORITY",
    action: "upload_evidence",
    entity: "Case",
    entityId: params.caseId,
  });
  return newEvidence;
}

export async function fetchUtilizationReports() {
  await delay();
  return utilizationState;
}

export async function submitUtilizationReport(params: { id: string; receipts: string[]; status: UtilizationReport["status"] }) {
  await delay();
  utilizationState = utilizationState.map((report) =>
    report.id === params.id ? { ...report, receipts: params.receipts, status: params.status } : report
  );
  return utilizationState.find((report) => report.id === params.id)!;
}

export async function fetchResolutions() {
  await delay();
  return resolutionState;
}

export async function addResolution(params: ResolutionRecord) {
  await delay();
  resolutionState = [params, ...resolutionState];
  recordAudit({
    actor: params.submittedBy,
    role: "AUTHORITY",
    action: "submit_resolution",
    entity: "ResolutionRecord",
    entityId: params.caseId,
  });
  return params;
}

export const mockApi = {
  fetchCases,
  fetchCaseById,
  updateCaseStatus,
  assignCase,
  fetchVerificationQueue,
  submitVerificationDecision,
  fetchLedger,
  exportLedgerCsv,
  fetchDisbursements,
  decideDisbursement,
  fetchReservoirRules,
  listRoutingRules,
  listDirectory,
  listModerationQueue,
  updateReservoirRule,
  fetchPublishingQueue,
  updatePublishingStatus,
  fetchBusinesses,
  updateBusinessKyc,
  fetchCampaigns,
  decideCampaign,
  fetchVaultReports,
  updateRedaction,
  fetchAuditLogs,
  fetchUsers,
  toggleUser,
  fetchRoles,
  updateRoleGrants,
  fetchEscalations,
  updateEscalation,
  uploadEvidence,
  fetchUtilizationReports,
  submitUtilizationReport,
  fetchResolutions,
  addResolution,
};
