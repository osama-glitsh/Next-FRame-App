import { requireAdmin, adminLogout } from "@/lib/actions/admin";
import { updateProjectStatus } from "@/lib/actions/projects";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_STATUSES, STATUS_LABEL_AR } from "@/lib/status";
import StatusBadge from "@/components/StatusBadge";

type AdminProject = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  status: string;
  created_at: string;
  profiles: { username: string; full_name: string | null } | null;
};

export default async function AdminDashboard() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, category, status, created_at, profiles(username, full_name)")
    .order("created_at", { ascending: false });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber">
            ADMIN
          </p>
          <h1 className="font-display text-2xl">
            كل المشاريع ({projects?.length ?? 0}) · المستخدمين ({userCount ?? 0})
          </h1>
        </div>
        <form action={adminLogout}>
          <button className="font-mono text-xs text-paper-dim hover:text-signal">
            خروج
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {!projects || projects.length === 0 ? (
          <p className="text-sm text-paper-dim">لسه مفيش مشاريع.</p>
        ) : (
          (projects as unknown as AdminProject[]).map((p) => (
            <div key={p.id} className="panel panel-hover p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="font-display text-lg">{p.title}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="mb-2 font-mono text-xs text-signal">
                @{p.profiles?.username ?? "unknown"}
                {p.category ? ` · ${p.category}` : ""}
              </p>
              <p className="mb-3 text-sm text-paper-dim">{p.description}</p>

              <form
                action={updateProjectStatus}
                className="flex flex-wrap items-center gap-2 border-t border-ink-line pt-3"
              >
                <input type="hidden" name="project_id" value={p.id} />
                <select
                  name="status"
                  defaultValue={p.status}
                  className="rounded border border-ink-line bg-ink px-2 py-1.5 text-xs outline-none focus:border-amber"
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL_AR[s]}
                    </option>
                  ))}
                </select>
                <input
                  name="message"
                  placeholder="ملاحظة للعميل (اختياري)"
                  className="min-w-[180px] flex-1 rounded border border-ink-line bg-ink px-2 py-1.5 text-xs outline-none focus:border-amber"
                />
                <button className="rounded bg-amber px-3 py-1.5 font-mono text-xs text-ink">
                  حدّث
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
