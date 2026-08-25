import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/ProjectForm";
import StatusBadge from "@/components/StatusBadge";
import ActiveProjectHero from "@/components/ActiveProjectHero";
import WorkflowTimeline from "@/components/WorkflowTimeline";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft px-3 py-1 font-mono text-xs uppercase tracking-widest text-signal">
          <span className="rec-dot animate-blink" /> REC — 00:00:04:01
        </p>
        <h1 className="mb-4 font-display text-4xl leading-tight sm:text-6xl">
          مش بس بنعمل محتوى،
          <br />
          <span className="text-signal">بنفريم قصص تفضل.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-paper-dim">
          Next Frame — استوديو إنتاج إبداعي. قدّم مشروعك، تابع تقدمه لحظة
          بلحظة، واتصل بمجتمع من صنّاع المحتوى.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/signup"
            className="btn-primary corner-frame flex items-center gap-2 rounded px-6 py-3 font-mono text-sm text-paper"
          >
            ابدأ دلوقتي
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Link>
          <Link
            href="/login"
            className="rounded border border-ink-line px-6 py-3 font-mono text-sm text-paper-dim hover:border-signal hover:text-signal"
          >
            دخول
          </Link>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("id", user.id)
    .maybeSingle();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, category, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const all = projects ?? [];
  const displayName = profile?.full_name || `@${profile?.username}`;

  // pick the most recently touched non-finished project as the "active" spotlight
  const activeProject = all.find((p) => !["delivered", "archived"].includes(p.status)) ?? null;
  const activeIndex = activeProject ? all.findIndex((p) => p.id === activeProject.id) : 0;

  const countsByStage: Record<string, number> = {};
  for (const p of all) {
    countsByStage[p.status] = (countsByStage[p.status] ?? 0) + 1;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <ActiveProjectHero fullName={displayName} project={activeProject} index={activeIndex} />

      <WorkflowTimeline countsByStage={countsByStage} />

      <div className="grid gap-8 sm:grid-cols-[1fr_1.3fr]">
        <ProjectForm />

        <div id="my-projects" className="flex scroll-mt-24 flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-paper-dim">
            الفريمات المختارة — مشاريعي ({all.length})
          </p>

          {all.length === 0 ? (
            <div className="panel flex flex-col items-center gap-2 border-dashed p-8 text-center text-sm text-paper-dim">
              <FolderKanban className="h-6 w-6 text-paper-dim" strokeWidth={1.5} />
              لسه معملتش أي مشروع. ابعت أول فريم من الفورم.
            </div>
          ) : (
            all.map((p, i) => (
              <div key={p.id} className="panel panel-hover p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] text-signal">
                      FRM // {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-xl leading-snug">{p.title}</h3>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mb-3 text-sm text-paper-dim">{p.description}</p>
                <div className="flex gap-3 border-t border-ink-line pt-3 font-mono text-[10px] text-paper-dim">
                  {p.category && <span>{p.category}</span>}
                  <span>{new Date(p.created_at).toLocaleDateString("ar-EG")}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
