import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    items: [
      { label: "Home", href: "/" },
      { label: "Ops", href: "/ops" },
      { label: "NGOs", href: "/ngos" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--surface)] text-[color:var(--foreground)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--pill-bg,#fff2de)] text-sm font-semibold text-primary">
              SOS
            </div>
            <div className="leading-tight">
              <p className="font-heading text-xl font-semibold text-ink">SANKATMOCHAN</p>
              <p className="text-sm text-muted">Always-on crisis grid.</p>
            </div>
          </div>
          <p className="max-w-md text-sm text-muted">
            Coordinating SOS signals, NGO alliances, and ops teams in one resilient lattice. Stay mission ready 24/7.
          </p>
          <div className="text-xs text-muted">
            © {new Date().getFullYear()} SANKATMOCHAN. All rights reserved.
          </div>
        </div>

        <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="transition hover:text-primary">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
