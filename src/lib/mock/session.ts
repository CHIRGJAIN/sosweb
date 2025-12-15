"use client";

import { create } from "zustand";
import { Role, SessionUser } from "@/types";

type SessionRecord = SessionUser & { defaultRoute: string };

type SessionState = {
  session: SessionRecord | null;
  isReady: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; route?: string }>;
  logout: () => void;
  switchRole: (role: Role) => void;
};

const STORAGE_KEY = "sos_admin_session";

const ACCOUNTS: Array<SessionRecord & { password: string }> = [
  {
    name: "Core Admin",
    email: "core.admin@sos.local",
    password: "core-ops-123",
    role: "CORE_ADMIN",
    geoScope: { region: "National" },
    department: "Command Center",
    defaultRoute: "/core/command-center",
  },
  {
    name: "Ops Sub Admin",
    email: "ops.lead@sos.local",
    password: "ops-ops-123",
    role: "SUB_ADMIN",
    geoScope: { region: "Delhi - East" },
    department: "Operations",
    defaultRoute: "/ops/overview",
  },
  {
    name: "Authority Desk",
    email: "authority.partner@sos.local",
    password: "authority-123",
    role: "AUTHORITY",
    geoScope: { region: "Delhi" },
    partnerType: "AUTHORITY",
    department: "Authority",
    defaultRoute: "/responder/assignments",
  },
  {
    name: "NGO Field",
    email: "ngo.partner@sos.local",
    password: "ngo-123",
    role: "NGO",
    geoScope: { region: "Jaipur" },
    partnerType: "NGO",
    department: "Partnerships",
    defaultRoute: "/partner/ngo/reports",
  },
  {
    name: "Business PM",
    email: "business.partner@sos.local",
    password: "business-123",
    role: "BUSINESS",
    geoScope: { region: "Mumbai" },
    partnerType: "BUSINESS",
    department: "Alliances",
    defaultRoute: "/partner/business/campaigns",
  },
];

const persist = (session: SessionRecord | null) => {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const hydrateSession = (): SessionRecord | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as SessionRecord;
  } catch {
    return null;
  }
};

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  isReady: false,
  hydrate: () => {
    const session = hydrateSession();
    set({ session, isReady: true });
  },
  login: async (email, password) => {
    await delay(450);
    const account = ACCOUNTS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );
    if (!account) {
      return { ok: false, error: "Invalid email or password" };
    }
    const session: SessionRecord = { ...account };
    persist(session);
    set({ session, isReady: true });
    return { ok: true, route: session.defaultRoute };
  },
  logout: () => {
    persist(null);
    set({ session: null, isReady: true });
  },
  switchRole: (role) => {
    const target = ACCOUNTS.find((account) => account.role === role);
    if (!target) return;
    const session: SessionRecord = { ...target };
    persist(session);
    set({ session });
  },
}));

export function getDefaultRouteForRole(role: Role) {
  return ACCOUNTS.find((account) => account.role === role)?.defaultRoute ?? "/core/command-center";
}

export function getMockAccounts() {
  return ACCOUNTS.map((account) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = account;
    return rest;
  });
}

export const HARD_CODED_CREDENTIALS = ACCOUNTS.map((account) => ({
  email: account.email,
  password: account.password,
  role: account.role,
  route: account.defaultRoute,
}));

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
