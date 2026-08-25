import { ArrowLeft, Camera } from "lucide-react";
import { STATUS_LABEL_AR, STATUS_PROGRESS } from "@/lib/status";

type Project = {
  id: string;
  title: string;
  category: string | null;
  status: string;
};

export default function ActiveProjectHero({
  fullName,
  project,
  index,
}: {
  fullName: string;
  project: Project | null;
  index: number;
}) {
  const progress = project ? STATUS_PROGRESS[project.status] ?? 10 : 0;

  return (
    <div className="panel relative mb-8 overflow-hidden p-8 sm:p-10 animate-fade-up">
      {/* decorative camera-frame backdrop, standing in for a real production still */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] items-center justify-center opacity-90 sm:flex">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(232,54,42,0.16), transparent 65%), linear-gradient(160deg, #17181a, #0c0c0d)",
          }}
        />
        <Camera className="relative h-24 w-24 text-ink-line" strokeWidth={1} />
      </div>

      <div className="relative sm:max-w-[58%]">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-paper-dim">
          أهلاً بيك تاني،
        </p>
        <h1 className="mb-4 font-display text-4xl leading-[0.95] sm:text-6xl">
          {fullName.toUpperCase()}
        </h1>
        <p className="mb-6 text-sm text-paper-dim sm:text-base">
          الفريم الجاي بتاعك في حركة بالفعل.
        </p>

        {project ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-xs text-signal">
                FRM // {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl">{project.title}</span>
            </div>
            <div className="max-w-xs">
              <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span className="text-amber">{STATUS_LABEL_AR[project.status]}</span>
                <span className="text-paper-dim">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-line">
                <div
                  className="h-full rounded-full bg-signal transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <a
              href="#my-projects"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded border border-signal px-4 py-2 font-mono text-xs text-signal hover:bg-signal hover:text-paper"
            >
              اتفرج على المشروع النشط
              <ArrowLeft className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <a
            href="#new-project"
            className="btn-primary inline-flex w-fit items-center gap-2 rounded px-4 py-2 font-mono text-xs text-paper"
          >
            ابدأ أول مشروع
            <ArrowLeft className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
