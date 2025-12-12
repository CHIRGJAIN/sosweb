type Stat = {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "default" | "warning" | "success";
};

export function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-300">{stat.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
          {stat.helper ? (
            <p
              className={
                stat.tone === "warning"
                  ? "text-xs text-amber-700 dark:text-amber-200"
                  : stat.tone === "success"
                  ? "text-xs text-emerald-700 dark:text-emerald-200"
                  : "text-xs text-slate-500 dark:text-slate-300"
              }
            >
              {stat.helper}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
