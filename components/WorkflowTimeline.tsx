import { STAGE_STEPS } from "@/lib/status";

export default function WorkflowTimeline({
  countsByStage,
}: {
  countsByStage: Record<string, number>;
}) {
  // "current" stage of the pipeline = the earliest stage that still has projects in it
  const currentIndex = STAGE_STEPS.findIndex((s) => (countsByStage[s.key] ?? 0) > 0);

  return (
    <div className="panel mb-8 p-6 sm:p-8 animate-fade-up">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-signal">
        الاستوديو
      </p>
      <h2 className="mb-6 font-display text-2xl sm:text-3xl">
        من الفكرة للفريم النهائي.
      </h2>

      <div className="relative mb-6 flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ink-line" />
        {STAGE_STEPS.map((stage, i) => {
          const isCurrent = i === currentIndex;
          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isCurrent
                    ? "bg-signal shadow-[0_0_8px_2px_rgba(232,54,42,0.6)]"
                    : "bg-ink-line"
                }`}
              />
              <span
                className={`font-mono text-[10px] uppercase tracking-widest ${
                  isCurrent ? "text-signal" : "text-paper-dim"
                }`}
              >
                {stage.label_ar}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-ink-line pt-5 sm:grid-cols-4">
        {STAGE_STEPS.map((stage) => (
          <div key={stage.key}>
            <p className="font-display text-2xl text-signal">
              {String(countsByStage[stage.key] ?? 0).padStart(2, "0")}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              {stage.label_ar}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
