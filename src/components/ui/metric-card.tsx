export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="glass-card rounded-[1.5rem] p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{detail}</p>
    </div>
  );
}
