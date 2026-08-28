import Link from "next/link";
import { toggleLike, addComment } from "@/lib/actions/posts";

type Comment = {
  id: string;
  content: string;
  profiles: { username: string } | null;
};

export type PostWithRelations = {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string; avatar_url: string | null } | null;
  post_likes: { user_id: string }[];
  comments: Comment[];
};

export default function PostCard({
  post,
  currentUserId,
}: {
  post: PostWithRelations;
  currentUserId: string | null;
}) {
  const likeCount = post.post_likes?.length ?? 0;
  const liked = !!currentUserId && post.post_likes?.some((l) => l.user_id === currentUserId);
  const author = post.profiles?.username ?? "unknown";

  return (
    <article className="panel panel-hover p-4">
      <div className="mb-2 flex items-center justify-between">
        <Link href={`/profile/${author}`} className="font-mono text-sm text-signal hover:underline">
          @{author}
        </Link>
        <span className="font-mono text-[10px] text-paper-dim">
          {new Date(post.created_at).toLocaleString("ar-EG")}
        </span>
      </div>

      <p className="mb-3 whitespace-pre-wrap text-sm">{post.content}</p>

      <div className="mb-3 flex items-center gap-4">
        <form action={toggleLike.bind(null, post.id)}>
          <button
            type="submit"
            className={`font-mono text-xs ${liked ? "text-signal" : "text-paper-dim hover:text-signal"}`}
          >
            ♥ {likeCount}
          </button>
        </form>
        <span className="font-mono text-xs text-paper-dim">
          💬 {post.comments?.length ?? 0}
        </span>
      </div>

      {post.comments && post.comments.length > 0 && (
        <div className="mb-3 flex flex-col gap-1.5 border-t border-ink-line pt-3">
          {post.comments.map((c) => (
            <p key={c.id} className="text-xs">
              <span className="text-signal">@{c.profiles?.username ?? "unknown"}</span>{" "}
              <span className="text-paper-dim">{c.content}</span>
            </p>
          ))}
        </div>
      )}

      {currentUserId && (
        <form action={addComment} className="flex gap-2">
          <input type="hidden" name="post_id" value={post.id} />
          <input
            name="content"
            placeholder="اكتب تعليق..."
            className="flex-1 rounded border border-ink-line bg-ink px-2 py-1 text-xs outline-none focus:border-signal"
          />
          <button className="font-mono text-xs text-signal">ابعت</button>
        </form>
      )}
    </article>
  );
}
