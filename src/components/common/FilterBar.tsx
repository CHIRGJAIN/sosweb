type FilterBarProps = {
  children: React.ReactNode;
  onReset?: () => void;
};

export function FilterBar({ children, onReset }: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3">{children}</div>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-slate-600 transition hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-200"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
