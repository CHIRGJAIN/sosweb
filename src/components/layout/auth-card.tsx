import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="space-y-4 rounded-3xl border border-soft bg-[color:var(--surface)] p-10 shadow-lg shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-3xl font-semibold text-ink">{title}</h1>
          {description ? (
            <p className="text-sm text-muted">{description}</p>
          ) : null}
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
