"use client";

import type { ComponentProps, ComponentType } from "react";
import {
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  HeartIcon,
  EyeDropperIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { HeroSection } from "@/components/home/hero-3d";
import { cn } from "@/lib/utils";

type Feature = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ComponentType<ComponentProps<"svg">>;
  eyebrow: string;
  highlights: { title: string; detail: string }[];
  actions: { label: string; href: string }[];
};

const features: Feature[] = [
  {
    id: "ngos",
    title: "NGOs & Public Services",
    description: "Access verified NGOs and services across Trinix districts with crisis-ready contact pathways.",
    href: "/ngos",
    icon: BuildingOffice2Icon,
    eyebrow: "Trusted Partners",
    highlights: [
      {
        title: "District-level directories",
        detail:
          "Filter by locality, speciality, language, or operating hours to reach the right organisation without losing time.",
      },
      {
        title: "Continuously validated contacts",
        detail:
          "Numbers, field officers, and logistic channels are re-verified every 48 hours so outreach never hits an inactive line.",
      },
      {
        title: "Resource readiness snapshots",
        detail:
          "Each listing carries current capacity signals—beds, relief kits, counsellors—allowing coordinators to match demand intelligently.",
      },
    ],
    actions: [
      { label: "Browse NGO network", href: "/ngos" },
      { label: "Request a partner addition", href: "/ops" },
    ],
  },
  {
    id: "social-feed",
    title: "Social Feed",
    description: "View the curated crisis feed with live updates, alerts, and high-signal field intelligence.",
    href: "/social",
    icon: ChatBubbleLeftRightIcon,
    eyebrow: "Signal, Not Noise",
    highlights: [
      {
        title: "Curated incident stream",
        detail:
          "AI-assisted moderation keeps the feed human-readable, clustering related alerts and filtering unverified chatter.",
      },
      {
        title: "Geo-mapped context",
        detail:
          "Stories anchor to live maps, allowing command to see proximity, potential impact radius, and neighbouring support nodes.",
      },
      {
        title: "Responder annotations",
        detail:
          "Ground teams can append short status bursts—\"containment in progress\", \"medical en route\"—so everyone shares the same picture.",
      },
    ],
    actions: [
      { label: "Open Crisis Feed", href: "/social" },
      { label: "Post an update", href: "/social" },
    ],
  },
  {
    id: "ops",
    title: "SANKATMOCHAN Ops",
    description: "Coordinate emergency workflows, escalation matrices, and rapid deployment tasking.",
    href: "/ops",
    icon: ShieldCheckIcon,
    eyebrow: "Command & Control",
    highlights: [
      {
        title: "Role-based playbooks",
        detail:
          "Ops hub centralises SOPs for police, health, and citizen responders so everyone acts from the same script when seconds matter.",
      },
      {
        title: "Tasking grid",
        detail:
          "Assign missions, set deadlines, and attach live intelligence—each instruction syncs with mobile responders in real time.",
      },
      {
        title: "After-action retros",
        detail:
          "Every campaign feeds a retrospective timeline, capturing lessons that automatically inform the next incident response.",
      },
    ],
    actions: [
      { label: "Enter Ops Grid", href: "/ops" },
      { label: "Download SOP bundle", href: "/ops" },
    ],
  },
  {
    id: "donations",
    title: "Donations",
    description: "Support relief missions directly with transparent utilisation metrics and outcomes.",
    href: "/donations",
    icon: HeartIcon,
    eyebrow: "Transparent Impact",
    highlights: [
      {
        title: "Mission-tied contributions",
        detail:
          "Back specific relief efforts—medical camps, shelters, supply drops—and follow fund allocation down to the receipt.",
      },
      {
        title: "Real-time utilisation ledger",
        detail:
          "Ledger view shows money-in versus expenditure with automated receipts and NGO acknowledgements.",
      },
      {
        title: "Impact storytelling",
        detail:
          "Receive brief human stories and outcome photos that correlate directly with the mission you funded.",
      },
    ],
    actions: [
      { label: "Support a Mission", href: "/donations" },
      { label: "See utilisation reports", href: "/donations" },
    ],
  },
  {
    id: "anonymous-reports",
    title: "Anonymous Reports",
    description: "Report suspicious activity discreetly with encrypted routing to Trinix responders.",
    href: "/anonymous",
    icon: EyeDropperIcon,
    eyebrow: "Protected Whistleblowing",
    highlights: [
      {
        title: "Multi-layer anonymity",
        detail:
          "Zero metadata logging, optional voice masking, and time-delayed routing keep whistleblowers shielded from retaliation.",
      },
      {
        title: "Contextual templates",
        detail:
          "Guided prompts help you report violence, trafficking, or corruption with the specifics investigators need.",
      },
      {
        title: "Safe follow-up channels",
        detail:
          "Create a secure code to retrieve investigator questions later without revealing identity or location.",
      },
    ],
    actions: [
      { label: "File a secure report", href: "/anonymous" },
      { label: "Read safety guidelines", href: "/anonymous" },
    ],
  },
  {
    id: "community-broadcasts",
    title: "Community Broadcasts",
    description:
      "Live messaging keeps neighbourhood volunteers, shelters, and support circles synchronised during prolonged incidents.",
    href: "/social",
    icon: MegaphoneIcon,
    eyebrow: "Community Amplification",
    highlights: [
      {
        title: "Targeted announcements",
        detail:
          "Segment broadcasts by ward or demographic so alerts reach the people who can assist or need to evacuate.",
      },
      {
        title: "Volunteer muster tools",
        detail:
          "Coordinate citizen responders with arrival slots, duty checklists, and safety briefings straight in their chat window.",
      },
      {
        title: "Multilingual delivery",
        detail:
          "Messages auto-localise across primary regional languages so no one misses a life-saving direction.",
      },
    ],
    actions: [
      { label: "Schedule a broadcast", href: "/social" },
      { label: "View community guidelines", href: "/social" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />

      <div className="space-y-12 bg-[color:var(--background)]">
        <header className="mx-auto max-w-4xl px-6 text-left">
          <h2 className="font-heading text-3xl font-semibold text-ink md:text-4xl">
            Rapid Response, Trusted Partners
          </h2>
          <p className="mt-3 text-base text-muted">
            Move through the verified Trinix crisis grid with instant navigation between NGOs, command ops, anonymous escalations, and fund transparency.
          </p>
        </header>

        <div className="space-y-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const sectionBackground = index % 2 === 0 ? "bg-[color:var(--surface)]" : "bg-[color:var(--surface-alt)]";

            return (
              <section
                key={feature.title}
                id={feature.id}
                className={cn("py-16 sm:py-20", sectionBackground)}
              >
                <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6">
                  <header className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary">
                        {feature.eyebrow}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-heading text-3xl font-semibold text-ink md:text-4xl">
                        {feature.title}
                      </h3>
                      <p className="max-w-3xl text-base leading-relaxed text-muted">
                        {feature.description}
                      </p>
                    </div>
                  </header>

                  <div className="grid gap-6 md:grid-cols-2">
                    {feature.highlights.map((item) => (
                      <article key={item.title} className="space-y-2 border-l-2 border-primary/40 pl-4">
                        <h4 className="font-semibold text-ink">{item.title}</h4>
                        <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
                      </article>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-primary">
                    {feature.actions.map((action) => (
                      <a key={action.label} href={action.href} className="hover:underline">
                        {action.label}
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
