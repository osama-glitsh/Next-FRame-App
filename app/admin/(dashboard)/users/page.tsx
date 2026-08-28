import { Shield, ShieldOff } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { toggleUserAdmin } from "@/lib/actions/admin";

type AdminUser = {
  id: string;
  username: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export default async function AdminUsersPage() {
  const supabase = createAdminClient();

  const [{ data: users }, { data: projects }, { data: posts }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name, is_admin, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("projects").select("user_id"),
    supabase.from("posts").select("user_id"),
  ]);

  const projectCounts = new Map<string, number>();
  for (const p of projects ?? []) {
    projectCounts.set(p.user_id, (projectCounts.get(p.user_id) ?? 0) + 1);
  }
  const postCounts = new Map<string, number>();
  for (const p of posts ?? []) {
    postCounts.set(p.user_id, (postCounts.get(p.user_id) ?? 0) + 1);
  }

  const list = (users as AdminUser[]) ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">Users</p>
        <h1 className="font-display text-2xl">كل المستخدمين ({list.length})</h1>
      </div>

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 border-b border-ink-line px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          <span>المستخدم</span>
          <span className="text-center">المشاريع</span>
          <span className="text-center">البوستات</span>
          <span>انضم</span>
          <span>الصلاحية</span>
        </div>

        {list.length === 0 ? (
          <p className="p-4 text-sm text-paper-dim">لسه مفيش مستخدمين.</p>
        ) : (
          list.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 border-b border-ink-line px-4 py-3 text-sm last:border-b-0"
            >
              <div>
                <p className="font-mono text-signal">@{u.username}</p>
                {u.full_name && <p className="text-xs text-paper-dim">{u.full_name}</p>}
              </div>
              <span className="text-center font-display">{projectCounts.get(u.id) ?? 0}</span>
              <span className="text-center font-display">{postCounts.get(u.id) ?? 0}</span>
              <span className="font-mono text-[10px] text-paper-dim">
                {new Date(u.created_at).toLocaleDateString("ar-EG")}
              </span>
              <form action={toggleUserAdmin}>
                <input type="hidden" name="user_id" value={u.id} />
                <input type="hidden" name="make_admin" value={(!u.is_admin).toString()} />
                <button
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${
                    u.is_admin
                      ? "border-amber text-amber"
                      : "border-ink-line text-paper-dim hover:border-paper-dim hover:text-paper"
                  }`}
                >
                  {u.is_admin ? (
                    <Shield className="h-3 w-3" strokeWidth={1.75} />
                  ) : (
                    <ShieldOff className="h-3 w-3" strokeWidth={1.75} />
                  )}
                  {u.is_admin ? "أدمن" : "مستخدم"}
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
