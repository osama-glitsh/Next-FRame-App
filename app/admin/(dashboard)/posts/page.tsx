import { Trash2 } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminDeletePost } from "@/lib/actions/admin";

type AdminPost = {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string } | null;
  post_likes: { user_id: string }[];
  comments: { id: string }[];
};

export default async function AdminPostsPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, content, created_at, profiles(username), post_likes(user_id), comments(id)")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (posts as unknown as AdminPost[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-amber">Posts</p>
        <h1 className="font-display text-2xl">كل البوستات ({list.length})</h1>
      </div>

      <div className="flex flex-col gap-3">
        {list.length === 0 ? (
          <p className="text-sm text-paper-dim">لسه مفيش بوستات.</p>
        ) : (
          list.map((p) => (
            <div key={p.id} className="panel flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="mb-1 font-mono text-xs text-signal">
                  @{p.profiles?.username ?? "unknown"}
                </p>
                <p className="mb-2 whitespace-pre-wrap text-sm">{p.content}</p>
                <div className="flex gap-3 font-mono text-[10px] text-paper-dim">
                  <span>{new Date(p.created_at).toLocaleDateString("ar-EG")}</span>
                  <span>{p.post_likes?.length ?? 0} لايك</span>
                  <span>{p.comments?.length ?? 0} تعليق</span>
                </div>
              </div>
              <form action={adminDeletePost}>
                <input type="hidden" name="post_id" value={p.id} />
                <button
                  className="flex items-center gap-1.5 rounded border border-ink-line px-2.5 py-1.5 font-mono text-[10px] text-paper-dim hover:border-signal hover:text-signal"
                  title="حذف البوست"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  حذف
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
