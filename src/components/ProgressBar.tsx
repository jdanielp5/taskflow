import { cn } from "@/lib/utils";

export function ProgressBar({ value, label = "Progresso" }: { value: number; label?: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-soft)]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300",
            safeValue === 100 ? "bg-emerald-600" : "bg-blue-600",
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
