import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import FollowButton from "@/components/FollowButton";
import FrameTile from "@/components/FrameTile";
import ActiveProjectHero from "@/components/ActiveProjectHero";
import WorkflowTimeline from "@/components/WorkflowTimeline";
import { type PostWithRelations } from "@/components/PostCard";

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

  const isOwnProfile = currentUser?.id === profile.id;

  const [{ count: followerCount }, { count: followingCount }, { data: posts }, ownProjects] =
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
      // RLS only ever returns rows here when profile.id === the logged-in user,
      // so this naturally stays private for anyone viewing someone else's page.
      supabase
        .from("projects")
        .select("id, title, category, status, created_at")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false }),
    ]);

  let isFollowing = false;
  if (currentUser && !isOwnProfile) {
    const { data } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", currentUser.id)
      .eq("following_id", profile.id)
      .maybeSingle();
    isFollowing = !!data;
  }

  const postList = (posts as unknown as PostWithRelations[]) ?? [];
  const projectList = isOwnProfile ? ownProjects.data ?? [] : [];
  const activeProject =
    projectList.find((p) => !["delivered", "archived"].includes(p.status)) ?? null;
  const activeIndex = activeProject
    ? projectList.findIndex((p) => p.id === activeProject.id)
    : 0;

  const countsByStage: Record<string, number> = {};
  for (const p of projectList) countsByStage[p.status] = (countsByStage[p.status] ?? 0) + 1;

  const memberSinceYear = new Date(profile.created_at).getFullYear();
  const displayName = profile.full_name || `@${profile.username}`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      {/* header */}
      <div className="panel corner-frame mb-8 p-6 sm:p-8 animate-fade-up">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl">{displayName}</h1>
            <p className="mt-1 font-mono text-sm text-signal">@{profile.username}</p>
            {profile.bio && <p className="mt-3 max-w-lg text-sm text-paper-dim">{profile.bio}</p>}
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-paper-dim">
              NEXT FRAME · MEMBER SINCE {memberSinceYear}
            </p>
          </div>
          {currentUser && !isOwnProfile && (
            <FollowButton
              targetUserId={profile.id}
              username={profile.username}
              isFollowing={isFollowing}
            />
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-line pt-5 sm:grid-cols-4">
          {isOwnProfile ? (
            <>
              <Stat label="مشاريع" value={projectList.length} />
              <Stat label="فريمات" value={postList.length} />
              <Stat label="جودة" value={countsByStage.qa ?? 0} />
              <Stat
                label="شغالة"
                value={
                  projectList.filter((p) => !["delivered", "archived"].includes(p.status)).length
                }
              />
            </>
          ) : (
            <>
              <Stat label="فريمات" value={postList.length} />
              <Stat label="متابِعين" value={followerCount ?? 0} />
              <Stat label="متابَعين" value={followingCount ?? 0} />
            </>
          )}
        </div>
      </div>

      {/* active frame spotlight — only meaningful (and only visible) on your own profile */}
      {isOwnProfile && activeProject && (
        <>
          <ActiveProjectHero fullName={displayName} project={activeProject} index={activeIndex} />
          <WorkflowTimeline countsByStage={countsByStage} />
        </>
      )}

      {/* recent frames */}
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-paper-dim">
          آخر الفريمات
        </p>

        {postList.length === 0 ? (
          <div className="flex items-center gap-2 border-t border-ink-line py-4 text-sm text-paper-dim">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            لسه مفيش فريمات منشورة.
            {isOwnProfile && (
              <Link href="/community" className="font-mono text-xs text-signal hover:underline">
                انشر أول فريم →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {postList.map((post) => (
              <FrameTile
                key={post.id}
                content={post.content}
                createdAt={post.created_at}
                likeCount={post.post_likes?.length ?? 0}
                commentCount={post.comments?.length ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-2xl">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">{label}</p>
    </div>
  );
}
