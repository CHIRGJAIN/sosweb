import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

export type Feature = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <Link
      href={feature.href}
      className="group flex flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(255,140,26,0.65)]"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-[rgba(255,140,26,0.16)] text-primary ring-1 ring-[rgba(255,140,26,0.28)] transition group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <h3 className="font-heading text-xl font-semibold text-ink">{feature.title}</h3>
        <p className="text-sm text-muted">{feature.description}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Explore
        <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}
