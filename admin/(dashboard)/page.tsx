import Link from "next/link";
import { Users, FolderKanban, MessageSquareText, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { STATUS_LABEL_AR } from "@/lib/status";
import StatusBadge from "@/components/StatusBadge";

export default async function AdminOverviewPage() {
  const supabase = createAdminClient();

  const [
    { count: userCount },
    { count: postCount },
    { data: projects },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id, title, status, created_at, profiles(username)")
      .order("created_at", { ascending: false }),
  ]);

  const all = (projects as unknown as {
    id: string;
    title: string;
    status: string;
    created_at: string;
    profiles: { username: string } | null;
  }[]) ?? [];

  const active = all.filter((p) => !["delivered", "archived"].includes(p.status)).length;
  const delivered = all.filter((p) => p.status === "delivered").length;

  const byStatus: Record<string, number> = {};
  for (const p of all) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">Overview</p>
        <h1 className="font-display text-2xl">نظرة عامة على Next Frame</h1>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="stat-card panel flex items-center justify-between p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              المستخدمين
            </p>
            <p className="mt-1 font-display text-2xl">{userCount ?? 0}</p>
          </div>
          <Users className="h-7 w-7 text-paper-dim" strokeWidth={1.5} />
        </div>
        <div className="stat-card panel flex items-center justify-between p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              كل المشاريع
            </p>
            <p className="mt-1 font-display text-2xl">{all.length}</p>
          </div>
          <FolderKanban className="h-7 w-7 text-paper-dim" strokeWidth={1.5} />
        </div>
        <div className="stat-card panel flex items-center justify-between p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              شغالة دلوقتي
            </p>
            <p className="mt-1 font-display text-2xl">{active}</p>
          </div>
          <Clock className="h-7 w-7 text-amber" strokeWidth={1.5} />
        </div>
        <div className="stat-card panel flex items-center justify-between p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              اتسلمت
            </p>
            <p className="mt-1 font-display text-2xl">{delivered}</p>
          </div>
          <CheckCircle2 className="h-7 w-7 text-signal" strokeWidth={1.5} />
        </div>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="panel p-5">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-paper-dim">
            المشاريع حسب الحالة
          </p>
          <div className="flex flex-col gap-3">
            {Object.keys(STATUS_LABEL_AR).map((status) => {
              const count = byStatus[status] ?? 0;
              const pct = all.length ? Math.round((count / all.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-paper-dim">{STATUS_LABEL_AR[status]}</span>
                    <span className="text-paper">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-line">
                    <div
                      className="h-full rounded-full bg-amber transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-paper-dim">
              <MessageSquareText className="me-1.5 inline h-3.5 w-3.5" strokeWidth={1.75} />
              البوستات
            </p>
            <p className="font-display text-2xl">{postCount ?? 0}</p>
          </div>
          <p className="text-sm text-paper-dim">
            كل البوستات المنشورة في المجتمع من كل المستخدمين.
          </p>
          <Link
            href="/admin/posts"
            className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-signal hover:underline"
          >
            راجع البوستات
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-paper-dim">
            أحدث المشاريع
          </p>
          <Link
            href="/admin/projects"
            className="flex items-center gap-1 font-mono text-xs text-signal hover:underline"
          >
            كل المشاريع
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        {all.length === 0 ? (
          <p className="text-sm text-paper-dim">لسه مفيش مشاريع.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {all.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 border-b border-ink-line py-2.5 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.title}</p>
                  <p className="font-mono text-[10px] text-paper-dim">
                    @{p.profiles?.username ?? "unknown"}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
