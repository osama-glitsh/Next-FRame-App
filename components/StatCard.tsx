import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "default" | "signal" | "amber";
}) {
  const iconColor =
    tone === "signal" ? "text-signal" : tone === "amber" ? "text-amber" : "text-paper-dim";

  return (
    <div className="stat-card panel flex items-center justify-between p-4">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl">{value}</p>
      </div>
      <Icon className={`h-7 w-7 ${iconColor}`} strokeWidth={1.5} />
    </div>
  );
}
