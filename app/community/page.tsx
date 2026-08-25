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

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 py-8">
      <h1 className="font-display text-2xl">المجتمع</h1>
      {user && <PostForm />}

      {!posts || posts.length === 0 ? (
        <div className="border border-dashed border-ink-line p-6 text-center text-sm text-paper-dim">
          لسه مفيش بوستات. كن أول واحد ينشر.
        </div>
      ) : (
        (posts as unknown as PostWithRelations[]).map((post) => (
          <PostCard key={post.id} post={post} currentUserId={user?.id ?? null} />
        ))
      )}
    </div>
  );
}
