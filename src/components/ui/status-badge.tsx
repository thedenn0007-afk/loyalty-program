type StatusTone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneMap: Record<StatusTone, string> = {
  neutral: "bg-neutral-900/5 text-neutral-700",
  success: "bg-emerald-500/12 text-emerald-700",
  warning: "bg-amber-500/16 text-amber-700",
  danger: "bg-rose-500/12 text-rose-700",
  accent: "bg-neutral-950 text-white",
};

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${toneMap[tone]}`}>
      {label}
    </span>
  );
}
