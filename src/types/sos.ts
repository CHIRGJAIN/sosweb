export type UserProfile = {
  id: string;
  name?: string;
  phoneMasked?: string;
  addressMasked?: string;
  isGuest?: boolean;
  profileComplete?: boolean;
};

export type CaseCategory = "CRIME" | "MEDICAL" | "FIRE" | "HARASSMENT" | "OTHER";
export type CaseSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type CaseStatus =
  | "NEW"
  | "TRIAGED"
  | "ASSIGNED"
  | "ACKNOWLEDGED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "RESOLVED"
  | "CLOSED";

export type Location = {
  building?: string;
  hostel?: string;
  zone?: string;
  lat?: number;
  lng?: number;
};

export type ReporterRef = {
  isGuest: boolean;
  profileComplete: boolean;
  maskedPhone?: string;
  maskedAddress?: string;
};

export type AssignedTo = {
  responderId?: string;
  responderName?: string;
  department?: string;
};

export type Evidence = {
  id: string;
  caseId: string;
  uploaderType: "REPORTER" | "RESPONDER" | "ADMIN";
  type: "IMAGE" | "VIDEO" | "DOC";
  url: string;
  createdAt: string;
};

export type TimelineEvent = {
  id: string;
  caseId: string;
  at: string;
  actor: string;
  action: string;
  notes?: string;
};

export type RoutingRule = {
  id: string;
  category: CaseCategory;
  department: string;
  defaultResponderGroup?: string;
};

export type DirectoryItem = {
  id: string;
  name: string;
  type: "NGO" | "SERVICE" | "RESOURCE";
  contact?: string;
  description?: string;
};

export type ModerationItem = {
  id: string;
  postId: string;
  reporterId?: string;
  reason?: string;
  status: "PENDING" | "REVIEWED" | "REMOVED";
};

export type AuditLog = {
  id: string;
  at: string;
  actor: string;
  action: string;
  meta?: Record<string, any>;
};

export type Case = {
  id: string;
  createdAt: string;
  updatedAt: string;
  category: CaseCategory;
  severity: CaseSeverity;
  status: CaseStatus;
  location?: Location;
  reporter: ReporterRef;
  assignedTo?: AssignedTo;
  title?: string;
  description?: string;
};
