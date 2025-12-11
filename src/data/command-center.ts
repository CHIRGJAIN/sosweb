import contributionsData from "../../mobile/src/data/contributions";
import distressSignalsData from "../../mobile/src/data/distressSignals";
import ngosData from "../../mobile/src/data/ngos";
import profileData from "../../mobile/src/data/profile";
import resourceHandlingData from "../../mobile/src/data/resourceHandling";
import resourcesData from "../../mobile/src/data/resources";
import servicesData from "../../mobile/src/data/services";
import socialPostsData, { SOCIAL_CATEGORIES } from "../../mobile/src/data/socialPosts";

export type NgoLevel = "district" | "state" | "national" | "global";

export type Ngo = {
  id: string;
  name: string;
  level: NgoLevel;
  category: string;
  description: string;
  imageUrl?: string | null;
  raisedAmount: number;
  goalAmount: number;
  location: string;
  progress: number;
};

export type SocialCategory = "Disaster Relief" | "Medical Aid" | "Awareness" | "Food Support";

export type SocialPost = {
  id: string;
  author: string;
  handle: string;
  body: string;
  imageUrl?: string | null;
  raised: number;
  goal: number;
  location: string;
  timestamp: string;
  progress: number;
  category: SocialCategory;
};

export type Resource = {
  id: string;
  category: string;
  title: string;
  description: string;
  contact: string;
  region: string;
  escalation: string;
};

export type DistressSignal = {
  id: string;
  type: "sos" | "media";
  geo: string;
  date: string;
  time: string;
  mediaType?: string | null;
  feedback?: string | null;
  sender?: {
    id: string;
    name: string;
  };
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
};

export type ResourceHandling = {
  id: string;
  mode: "used" | "received" | "reservoir";
  for: string;
  date: string;
  time: string;
  amount: string;
  description: string;
};

export type Service = {
  id: string;
  name: string;
  desc: string;
  state: string;
  district: string;
};

export type ServicesDirectory = {
  states: string[];
  districts: Record<string, string[]>;
  services: Service[];
};

export type Contribution = {
  id: string;
  mode: "made" | "received";
  title: string;
  date: string;
  amount: string;
};

export type Profile = {
  id: string;
  name: string;
  phone: string;
  emergencyContact: string;
  address: string;
  kyc: string;
  avatarUrl?: string | null;
  distressHistory: { id: string; label: string; status: string; responseTime: string }[];
  contributions: { id: string; title: string; detail: string }[];
};

export const ngoLevels: NgoLevel[] = ["district", "state", "national", "global"];
export const ngos: Ngo[] = (ngosData as Ngo[]).map((ngo) => ({
  ...ngo,
  level: (ngo.level ?? "district") as NgoLevel,
  imageUrl: ngo.imageUrl ?? null,
  progress:
    typeof ngo.progress === "number" && !Number.isNaN(ngo.progress)
      ? ngo.progress
      : ngo.goalAmount
        ? Math.round((ngo.raisedAmount / ngo.goalAmount) * 100)
        : 0,
}));

export const socialCategories = (SOCIAL_CATEGORIES as SocialCategory[]) ?? [];
export const socialPosts: SocialPost[] = (socialPostsData as SocialPost[]).map((post) => ({
  ...post,
  category: post.category as SocialCategory,
  imageUrl: post.imageUrl ?? null,
}));

export const resources = resourcesData as Resource[];

export const distressSignals: DistressSignal[] = (distressSignalsData as DistressSignal[]).map((signal) => ({
  ...signal,
  sender: signal.sender ?? { id: "unknown", name: "Unknown sender" },
  location: signal.location ?? {},
  feedback: signal.feedback ?? "Awaiting operator response",
}));

export const resourceHandlingEntries = resourceHandlingData as ResourceHandling[];

export const servicesDirectory = servicesData as ServicesDirectory;

export const contributions = contributionsData as Contribution[];

export const profiles: Profile[] = [profileData as Profile];
export const primaryProfile = profiles[0];
