import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/ProjectForm";
import StatusBadge from "@/components/StatusBadge";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
          ● REC — 00:00:04:01
        </p>
        <h1 className="mb-4 font-display text-4xl leading-tight sm:text-5xl">
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
            className="corner-frame rounded bg-signal px-6 py-3 font-mono text-sm text-paper"
          >
            ابدأ دلوقتي
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

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, category, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-5 py-8 sm:grid-cols-[1fr_1.3fr]">
      <ProjectForm />

      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-paper-dim">
          مشاريعي ({projects?.length ?? 0})
        </p>

        {!projects || projects.length === 0 ? (
          <div className="border border-dashed border-ink-line p-6 text-center text-sm text-paper-dim">
            لسه معملتش أي مشروع. ابعت أول مشروع من الفورم.
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="border border-ink-line bg-ink-soft p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-display text-lg leading-snug">{p.title}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="mb-2 text-sm text-paper-dim">{p.description}</p>
              <div className="flex gap-3 font-mono text-[10px] text-paper-dim">
                {p.category && <span>{p.category}</span>}
                <span>
                  {new Date(p.created_at).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
