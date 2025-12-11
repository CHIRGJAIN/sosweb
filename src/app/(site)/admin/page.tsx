"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ngosData from "../../../../mobile/src/data/ngos";
import socialPostsData, { SOCIAL_CATEGORIES } from "../../../../mobile/src/data/socialPosts";
import resourcesData from "../../../../mobile/src/data/resources";
import distressSignalsData from "../../../../mobile/src/data/distressSignals";
import resourceHandlingData from "../../../../mobile/src/data/resourceHandling";
import servicesData from "../../../../mobile/src/data/services";
import contributionsData from "../../../../mobile/src/data/contributions";
import profileData from "../../../../mobile/src/data/profile";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

type NgoLevel = "district" | "state" | "national" | "global";

type Ngo = {
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

type SocialCategory = "Disaster Relief" | "Medical Aid" | "Awareness" | "Food Support";

type SocialPost = {
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

type Resource = {
  id: string;
  category: string;
  title: string;
  description: string;
  contact: string;
  region: string;
  escalation: string;
};

type DistressSignal = {
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

type ResourceHandling = {
  id: string;
  mode: "used" | "received" | "reservoir";
  for: string;
  date: string;
  time: string;
  amount: string;
  description: string;
};

type Service = {
  id: string;
  name: string;
  desc: string;
  state: string;
  district: string;
};

type Contribution = {
  id: string;
  mode: "made" | "received";
  title: string;
  date: string;
  amount: string;
};

type Profile = {
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

const ngoFilters: Array<"all" | NgoLevel> = ["all", "district", "state", "national", "global"];
const socialFilters: Array<"All" | SocialCategory> = [
  "All",
  ...(((SOCIAL_CATEGORIES as SocialCategory[]) ?? []) as SocialCategory[]),
];
const resourceModes: Array<ResourceHandling["mode"] | "all"> = ["all", "used", "received", "reservoir"];
const placeholderImage = "/assets/background_image.png";

const ngos: Ngo[] = (ngosData as Ngo[]).map((ngo) => ({
  ...ngo,
  level: (ngo.level ?? "district") as NgoLevel,
}));

const socialPosts: SocialPost[] = (socialPostsData as SocialPost[]).map((post) => ({
  ...post,
  category: post.category as SocialCategory,
}));

const resources = resourcesData as Resource[];
const distressSignals: DistressSignal[] = (distressSignalsData as DistressSignal[]).map((signal) => ({
  ...signal,
  sender: signal.sender ?? { id: "unknown", name: "Unknown sender" },
  location: signal.location ?? {},
  feedback: signal.feedback ?? "Awaiting operator response",
}));
const resourceHandlingEntries = resourceHandlingData as ResourceHandling[];
const services = (servicesData?.services ?? []) as Service[];
const statesList = (servicesData?.states ?? []) as string[];
const districtsMap = (servicesData?.districts ?? {}) as Record<string, string[]>;
const contributions = contributionsData as Contribution[];
const profile = profileData as Profile;

function formatAmount(value: number | string) {
  if (typeof value === "number") {
    return `Rs ${value.toLocaleString("en-IN")}`;
  }
  return value;
}

function formatTimestamp(value: string) {
  try {
    return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return value;
  }
}

function percent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

export default function AdminDashboard() {
  const [ngoFilter, setNgoFilter] = useState<(typeof ngoFilters)[number]>("all");
  const filteredNgos = useMemo(
    () => (ngoFilter === "all" ? ngos : ngos.filter((ngo) => ngo.level === ngoFilter)),
    [ngoFilter]
  );
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(filteredNgos[0]?.id ?? null);

  const [socialFilter, setSocialFilter] = useState<(typeof socialFilters)[number]>("All");
  const filteredSocial = useMemo(
    () => (socialFilter === "All" ? socialPosts : socialPosts.filter((post) => post.category === socialFilter)),
    [socialFilter]
  );
  const [selectedSocialId, setSelectedSocialId] = useState<string | null>(filteredSocial[0]?.id ?? null);

  const resourceCategories = useMemo(
    () => ["All", ...new Set(resources.map((resource) => resource.category))],
    []
  );
  const [resourceCategory, setResourceCategory] = useState<string>("All");
  const filteredResources = useMemo(
    () =>
      resourceCategory === "All" ? resources : resources.filter((resource) => resource.category === resourceCategory),
    [resourceCategory]
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(filteredResources[0]?.id ?? null);

  const [selectedDistressId, setSelectedDistressId] = useState<string | null>(distressSignals[0]?.id ?? null);

  const [resourceMode, setResourceMode] = useState<ResourceHandling["mode"] | "all">("used");
  const filteredResourceHandling = useMemo(
    () =>
      resourceMode === "all"
        ? resourceHandlingEntries
        : resourceHandlingEntries.filter((entry) => entry.mode === resourceMode),
    [resourceMode]
  );
  const [selectedResourceHandlingId, setSelectedResourceHandlingId] = useState<string | null>(
    filteredResourceHandling[0]?.id ?? null
  );

  const [contributionTab, setContributionTab] = useState<Contribution["mode"]>("made");
  const filteredContributions = useMemo(
    () => contributions.filter((item) => item.mode === contributionTab),
    [contributionTab]
  );
  const [selectedContributionId, setSelectedContributionId] = useState<string | null>(
    filteredContributions[0]?.id ?? null
  );

  const [selectedState, setSelectedState] = useState<string>(statesList[0] ?? "");
  const districts = useMemo(() => districtsMap[selectedState] ?? [], [selectedState]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(districts[0] ?? "");
  const filteredServices = useMemo(
    () =>
      services.filter(
        (service) =>
          (!selectedState || service.state === selectedState) &&
          (!selectedDistrict || service.district === selectedDistrict)
      ),
    [selectedDistrict, selectedState]
  );

  useEffect(() => {
    if (filteredNgos.length && !filteredNgos.find((ngo) => ngo.id === selectedNgoId)) {
      setSelectedNgoId(filteredNgos[0].id);
    }
  }, [filteredNgos, selectedNgoId]);

  useEffect(() => {
    if (filteredSocial.length && !filteredSocial.find((post) => post.id === selectedSocialId)) {
      setSelectedSocialId(filteredSocial[0].id);
    }
  }, [filteredSocial, selectedSocialId]);

  useEffect(() => {
    if (filteredResources.length && !filteredResources.find((resource) => resource.id === selectedResourceId)) {
      setSelectedResourceId(filteredResources[0].id);
    }
  }, [filteredResources, selectedResourceId]);

  useEffect(() => {
    if (distressSignals.length && !distressSignals.find((signal) => signal.id === selectedDistressId)) {
      setSelectedDistressId(distressSignals[0]?.id ?? null);
    }
  }, [selectedDistressId]);

  useEffect(() => {
    if (filteredResourceHandling.length && !filteredResourceHandling.find((entry) => entry.id === selectedResourceHandlingId)) {
      setSelectedResourceHandlingId(filteredResourceHandling[0].id);
    }
  }, [filteredResourceHandling, selectedResourceHandlingId]);

  useEffect(() => {
    if (filteredContributions.length && !filteredContributions.find((entry) => entry.id === selectedContributionId)) {
      setSelectedContributionId(filteredContributions[0].id);
    }
  }, [filteredContributions, selectedContributionId]);

  useEffect(() => {
    setSelectedDistrict(districts[0] ?? "");
  }, [districts]);

  const selectedNgo = filteredNgos.find((ngo) => ngo.id === selectedNgoId);
  const selectedSocial = filteredSocial.find((post) => post.id === selectedSocialId);
  const selectedResource = filteredResources.find((resource) => resource.id === selectedResourceId);
  const selectedDistress = distressSignals.find((signal) => signal.id === selectedDistressId);
  const selectedResourceHandling = filteredResourceHandling.find((entry) => entry.id === selectedResourceHandlingId);
  const selectedContribution = filteredContributions.find((entry) => entry.id === selectedContributionId);

  const summaryCards = [
    { label: "NGOs", value: ngos.length },
    { label: "Social posts", value: socialPosts.length },
    { label: "Resources", value: resources.length },
    { label: "Distress signals", value: distressSignals.length },
  ];

  return (
    <div className="space-y-10 pb-6">
      <header className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">SOS Command Center</p>
          <h1 className="font-heading text-4xl font-bold text-ink">Admin Dashboard</h1>
          <p className="text-sm text-muted">
            All data below is pulled from the Expo app&apos;s local mocks. No network calls or auth required.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-soft bg-[color:var(--surface)] px-4 py-3 text-sm shadow"
            >
              <p className="text-muted">{card.label}</p>
              <p className="text-ink text-2xl font-semibold">{card.value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-ink">NGO Oversight</h2>
              <p className="text-sm text-muted">Filter by level and inspect the partner&apos;s fundraiser status.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ngoFilters.map((level) => (
                <Chip key={level} active={ngoFilter === level} onClick={() => setNgoFilter(level)}>
                  {level === "all" ? "All" : titleCase(level)}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {filteredNgos.map((ngo) => {
              const pctRaised = percent(
                ngo.goalAmount ? (ngo.raisedAmount / ngo.goalAmount) * 100 : ngo.progress
              );
              return (
                <button
                  key={ngo.id}
                  onClick={() => setSelectedNgoId(ngo.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition",
                    selectedNgoId === ngo.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                  )}
                >
                  <Image
                    src={ngo.imageUrl || placeholderImage}
                    alt={ngo.name}
                    width={64}
                    height={64}
                    className="size-16 rounded-xl object-cover"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                        {titleCase(ngo.level)}
                      </span>
                      <span className="text-muted">{ngo.category}</span>
                    </div>
                    <p className="font-semibold text-ink">{ngo.name}</p>
                    <ProgressBar value={pctRaised} max={100} />
                    <p className="text-xs text-muted">
                      {formatAmount(ngo.raisedAmount)} of {formatAmount(ngo.goalAmount)} | {pctRaised}% progress
                    </p>
                    <p className="text-xs text-muted">Location: {ngo.location}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">NGO Detail</h3>
          {selectedNgo ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedNgo.imageUrl || placeholderImage}
                  alt={selectedNgo.name}
                  width={72}
                  height={72}
                  className="rounded-xl object-cover"
                />
                <div>
                  <p className="text-ink font-semibold">{selectedNgo.name}</p>
                  <p>
                    {titleCase(selectedNgo.level)} | {selectedNgo.category}
                  </p>
                  <p>{selectedNgo.location}</p>
                </div>
              </div>
              <p>{selectedNgo.description}</p>
              <div className="rounded-xl border border-soft bg-white/5 p-3 text-xs">
                Raised {formatAmount(selectedNgo.raisedAmount)} of {formatAmount(selectedNgo.goalAmount)} (
                {percent(selectedNgo.goalAmount ? (selectedNgo.raisedAmount / selectedNgo.goalAmount) * 100 : selectedNgo.progress)}%)
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Select an NGO to view details.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-ink">Social Signals</h2>
              <p className="text-sm text-muted">Filter by category to review field updates and needs.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {socialFilters.map((category) => (
                <Chip key={category} active={socialFilter === category} onClick={() => setSocialFilter(category)}>
                  {category}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredSocial.map((post) => {
              const pctRaised = percent(post.goal ? (post.raised / post.goal) * 100 : post.progress);
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedSocialId(post.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition",
                    selectedSocialId === post.id
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted">{formatTimestamp(post.timestamp)}</p>
                      <p className="font-semibold text-ink">
                        {post.author} <span className="font-normal text-muted">{post.handle}</span>
                      </p>
                      <p className="text-xs text-muted">{post.location}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {post.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink">{post.body}</p>
                  <div className="mt-3">
                    <ProgressBar value={pctRaised} max={100} />
                    <p className="mt-1 text-xs text-muted">
                      {formatAmount(post.raised)} of {formatAmount(post.goal)} | {pctRaised}% tracked
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Social Detail</h3>
          {selectedSocial ? (
            <div className="mt-4 space-y-3">
              <div className="h-36 w-full overflow-hidden rounded-xl bg-white/5">
                {selectedSocial.imageUrl ? (
                  <Image
                    src={selectedSocial.imageUrl}
                    alt={selectedSocial.id}
                    width={640}
                    height={320}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">No image</div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-semibold">
                  {selectedSocial.category}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1">{selectedSocial.location}</span>
                <span>{formatTimestamp(selectedSocial.timestamp)}</span>
              </div>
              <p className="text-sm text-ink">{selectedSocial.body}</p>
              <div className="rounded-lg border border-soft bg-white/5 p-3 text-xs text-muted">
                Raised {formatAmount(selectedSocial.raised)} of {formatAmount(selectedSocial.goal)} (
                {percent(selectedSocial.progress)}% progress)
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No post selected.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-ink">Resource Library</h2>
              <p className="text-sm text-muted">Filter resources by category.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {resourceCategories.map((category) => (
                <Chip key={category} active={resourceCategory === category} onClick={() => setResourceCategory(category)}>
                  {category}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {filteredResources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => setSelectedResourceId(resource.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  selectedResourceId === resource.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">{resource.title}</p>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{resource.category}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{resource.description}</p>
                <p className="mt-2 text-xs text-muted">Region: {resource.region}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Resource Detail</h3>
          {selectedResource ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-ink font-semibold">{selectedResource.title}</p>
              <p className="text-muted">{selectedResource.description}</p>
              <p className="text-muted">Category: {selectedResource.category}</p>
              <p className="text-muted">Region: {selectedResource.region}</p>
              <p className="text-muted">Contact: {selectedResource.contact}</p>
              <p className="text-muted">Escalation: {selectedResource.escalation}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No resource selected.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-ink">Distress Monitor</h2>
              <p className="text-sm text-muted">Incoming SOS/media signals with sender identity and precise location.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {distressSignals.length} active
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {distressSignals.map((signal) => (
              <button
                key={signal.id}
                onClick={() => setSelectedDistressId(signal.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedDistressId === signal.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase",
                        signal.type === "sos" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      )}
                    >
                      {signal.type}
                    </span>
                    <span className="text-muted">
                      {signal.date} | {signal.time}
                    </span>
                  </div>
                  <span className="text-muted">{signal.geo}</span>
                </div>
                <p className="mt-2 text-sm text-ink">
                  {signal.sender?.name} ({signal.sender?.id})
                </p>
                <p className="text-xs text-muted">
                  {signal.location?.address || signal.geo}
                  {signal.location?.lat ? ` | ${signal.location.lat}, ${signal.location.lng}` : ""}
                </p>
                <p className="mt-2 text-xs text-muted">Feedback: {signal.feedback}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h3 className="font-heading text-xl font-semibold text-ink">Distress Detail</h3>
          {selectedDistress ? (
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase",
                    selectedDistress.type === "sos" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  )}
                >
                  {selectedDistress.type}
                </span>
                <span>
                  {selectedDistress.date} | {selectedDistress.time}
                </span>
              </div>
              <p className="text-ink font-semibold">{selectedDistress.sender?.name}</p>
              <p>User ID: {selectedDistress.sender?.id}</p>
              <p>Geo: {selectedDistress.geo}</p>
              <p>Address: {selectedDistress.location?.address ?? "Not provided"}</p>
              {selectedDistress.location?.lat ? (
                <p>
                  Coordinates: {selectedDistress.location.lat}, {selectedDistress.location.lng}
                </p>
              ) : null}
              {selectedDistress.mediaType ? <p>Media: {selectedDistress.mediaType}</p> : null}
              <p>Feedback: {selectedDistress.feedback}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No distress signal selected.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold text-ink">Resource Handling</h2>
            <div className="flex gap-2">
              {resourceModes.map((mode) => (
                <Chip key={mode} active={resourceMode === mode} onClick={() => setResourceMode(mode)}>
                  {mode === "all" ? "All" : mode}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredResourceHandling.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedResourceHandlingId(entry.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedResourceHandlingId === entry.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{entry.for}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{entry.mode}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {entry.date} | {entry.time}
                </p>
                <p className="mt-1 text-sm text-muted">{entry.description}</p>
                <p className="mt-2 text-xs font-semibold text-primary">{entry.amount}</p>
              </button>
            ))}
          </div>
          {selectedResourceHandling ? (
            <div className="mt-4 rounded-2xl border border-soft bg-white/5 p-4 text-sm text-muted">
              <p className="font-semibold text-ink">Detail</p>
              <p className="mt-1">{selectedResourceHandling.description}</p>
              <p className="mt-1">Mode: {selectedResourceHandling.mode}</p>
              <p className="mt-1">Amount: {selectedResourceHandling.amount}</p>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold text-ink">Contributions</h2>
            <div className="flex gap-2">
              {(["made", "received"] as Contribution["mode"][]).map((mode) => (
                <Chip key={mode} active={contributionTab === mode} onClick={() => setContributionTab(mode)}>
                  {mode}
                </Chip>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredContributions.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedContributionId(item.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedContributionId === item.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-soft hover:border-primary/60 hover:bg-[rgba(255,115,0,0.05)]"
                )}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{item.title}</span>
                  <span className="text-primary">{item.amount}</span>
                </div>
                <p className="text-xs text-muted">{item.date}</p>
              </button>
            ))}
          </div>
          {selectedContribution ? (
            <div className="mt-4 rounded-2xl border border-soft bg-white/5 p-4 text-sm text-muted">
              <p className="font-semibold text-ink">Detail</p>
              <p className="mt-1">{selectedContribution.title}</p>
              <p className="mt-1">Mode: {selectedContribution.mode}</p>
              <p className="mt-1">Date: {selectedContribution.date}</p>
              <p className="mt-1">Amount: {selectedContribution.amount}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-ink">Service Directory</h2>
              <p className="text-sm text-muted">Select state and district to view available services.</p>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedState}
                onChange={(event) => setSelectedState(event.target.value)}
                className="rounded-lg border border-soft bg-[color:var(--surface-alt,#0c1424)] px-3 py-2 text-sm text-ink"
              >
                {statesList.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <select
                value={selectedDistrict}
                onChange={(event) => setSelectedDistrict(event.target.value)}
                className="rounded-lg border border-soft bg-[color:var(--surface-alt,#0c1424)] px-3 py-2 text-sm text-ink"
              >
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredServices.map((service) => (
              <div key={service.id} className="rounded-2xl border border-soft bg-white/5 p-4">
                <p className="font-semibold text-ink">{service.name}</p>
                <p className="text-sm text-muted">{service.desc}</p>
                <p className="mt-1 text-xs text-muted">
                  {service.state} | {service.district}
                </p>
              </div>
            ))}
            {!filteredServices.length ? <p className="text-sm text-muted">No services for this district.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-soft bg-[color:var(--surface-alt,#0c1424)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <h2 className="font-heading text-2xl font-semibold text-ink">Profile Snapshot</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-white/10">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={72}
                  height={72}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-[72px] w-[72px] items-center justify-center text-xs text-muted">No avatar</div>
              )}
            </div>
            <div>
              <p className="font-semibold text-ink">{profile.name}</p>
              <p className="text-sm text-muted">User ID: {profile.id}</p>
              <p className="text-sm text-muted">KYC: {profile.kyc}</p>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-sm text-muted">
            <p>Phone: {profile.phone}</p>
            <p>Emergency: {profile.emergencyContact}</p>
            <p>Address: {profile.address}</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-soft bg-white/5 p-3">
              <p className="text-xs font-semibold text-ink">Distress History</p>
              <div className="mt-2 space-y-2 text-xs text-muted">
                {profile.distressHistory.map((item) => (
                  <div key={item.id} className="rounded-lg border border-soft bg-[rgba(255,255,255,0.04)] p-2">
                    <p className="font-semibold text-ink">{item.label}</p>
                    <p>Status: {item.status}</p>
                    <p>Response: {item.responseTime}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-soft bg-white/5 p-3">
              <p className="text-xs font-semibold text-ink">Contribution Summary</p>
              <div className="mt-2 space-y-2 text-xs text-muted">
                {profile.contributions.map((item) => (
                  <div key={item.id} className="rounded-lg border border-soft bg-[rgba(255,255,255,0.04)] p-2">
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-soft bg-[color:var(--surface)] p-6 shadow-lg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div>
          <p className="font-heading text-xl font-semibold text-ink">Quick Actions</p>
          <p className="text-sm text-muted">Jump to the most-used static panels.</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" onClick={() => window.location.assign("/admin")}>
            Admin Overview
          </Button>
          <Button type="button" variant="ghost" onClick={() => window.location.assign("/donations")}>
            Donations
          </Button>
        </div>
      </div>
    </div>
  );
}
