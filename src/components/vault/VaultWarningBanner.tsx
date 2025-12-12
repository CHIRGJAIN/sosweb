export function VaultWarningBanner() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-sm dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-100">
      <p className="font-semibold">Restricted Vault</p>
      <p className="text-xs">
        Content is masked by default. Actions are audited and export is disabled in this mock build.
      </p>
    </div>
  );
}
