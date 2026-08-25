import { STATUS_LABEL_AR } from "@/lib/status";

export default function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABEL_AR[status] || status;
  const isDelivered = status === "delivered";
  const isArchived = status === "archived";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono uppercase tracking-wide ${
        isDelivered
          ? "border-signal text-signal"
          : isArchived
          ? "border-ink-line text-paper-dim"
          : "border-amber text-amber"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isDelivered
            ? "bg-signal shadow-[0_0_6px_1px_rgba(232,54,42,0.6)]"
            : isArchived
            ? "bg-paper-dim"
            : "bg-amber shadow-[0_0_6px_1px_rgba(242,165,65,0.5)]"
        }`}
      />
      {label}
    </span>
  );
}
