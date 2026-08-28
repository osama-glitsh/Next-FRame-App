import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/PostForm";
import PostCard, { type PostWithRelations } from "@/components/PostCard";

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, content, created_at, profiles(username, avatar_url), post_likes(user_id), comments(id, content, profiles(username))"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const list = (posts as unknown as PostWithRelations[]) ?? [];
  const totalLikes = list.reduce((sum, p) => sum + (p.post_likes?.length ?? 0), 0);
  const totalComments = list.reduce((sum, p) => sum + (p.comments?.length ?? 0), 0);

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-6 animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">STUDIO</p>
        <h1 className="mb-1 font-display text-3xl">حيط المجتمع</h1>
        <p className="text-sm text-paper-dim">
          شارك شغلك، اتكلم مع صنّاع Next Frame التانيين، وشوف أحدث الفريمات.
        </p>
      </div>

      {list.length > 0 && (
        <div className="mb-6 flex gap-6 border-b border-ink-line pb-6 font-mono text-xs text-paper-dim">
          <span>
            <span className="font-display text-lg text-paper">{list.length}</span> فريم
          </span>
          <span>
            <span className="font-display text-lg text-paper">{totalLikes}</span> لايك
          </span>
          <span>
            <span className="font-display text-lg text-paper">{totalComments}</span> تعليق
          </span>
        </div>
      )}

      {user && (
        <div className="mb-6">
          <PostForm />
        </div>
      )}

      {list.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 border-dashed p-10 text-center">
          <Sparkles className="h-6 w-6 text-paper-dim" strokeWidth={1.5} />
          <p className="text-sm text-paper-dim">لسه مفيش فريمات منشورة.</p>
          {user ? (
            <p className="font-mono text-xs text-signal">كن أول واحد ينشر ↑</p>
          ) : (
            <Link href="/signup" className="font-mono text-xs text-signal hover:underline">
              اعمل حساب وابدأ تنشر →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user?.id ?? null} />
          ))}
        </div>
      )}
    </div>
  );
}
