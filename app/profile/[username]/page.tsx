import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FollowButton from "@/components/FollowButton";
import PostCard, { type PostWithRelations } from "@/components/PostCard";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url, created_at")
    .eq("username", username)
    .maybeSingle();

  if (!profile) notFound();

  const [{ count: followerCount }, { count: followingCount }, { data: posts }] =
    await Promise.all([
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profile.id),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", profile.id),
      supabase
        .from("posts")
        .select(
          "id, content, created_at, profiles(username, avatar_url), post_likes(user_id), comments(id, content, profiles(username))"
        )
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false }),
    ]);

  let isFollowing = false;
  if (currentUser && currentUser.id !== profile.id) {
    const { data } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", currentUser.id)
      .eq("following_id", profile.id)
      .maybeSingle();
    isFollowing = !!data;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-8">
      <div className="corner-frame border border-ink-line bg-ink-soft p-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl">
              {profile.full_name || `@${profile.username}`}
            </h1>
            <p className="font-mono text-sm text-signal">@{profile.username}</p>
          </div>
          {currentUser && currentUser.id !== profile.id && (
            <FollowButton
              targetUserId={profile.id}
              username={profile.username}
              isFollowing={isFollowing}
            />
          )}
        </div>

        {profile.bio && <p className="mt-3 text-sm text-paper-dim">{profile.bio}</p>}

        <div className="mt-4 flex gap-5 font-mono text-xs text-paper-dim">
          <span>
            <span className="text-paper">{followerCount ?? 0}</span> متابِع
          </span>
          <span>
            <span className="text-paper">{followingCount ?? 0}</span> متابَعين
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {!posts || posts.length === 0 ? (
          <p className="text-center text-sm text-paper-dim">لسه مفيش بوستات.</p>
        ) : (
          (posts as unknown as PostWithRelations[]).map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUser?.id ?? null} />
          ))
        )}
      </div>
    </div>
  );
}
