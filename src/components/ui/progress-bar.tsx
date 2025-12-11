type ProgressBarProps = {
  value: number;
  max: number;
};

export function ProgressBar({ value, max }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent = Math.round((safeValue / max) * 100);

  return (
    <div className="h-2 w-full rounded-full bg-[#ffe0cc]">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
