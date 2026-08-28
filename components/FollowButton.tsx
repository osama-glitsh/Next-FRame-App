import { toggleFollow } from "@/lib/actions/follows";

export default function FollowButton({
  targetUserId,
  username,
  isFollowing,
}: {
  targetUserId: string;
  username: string;
  isFollowing: boolean;
}) {
  return (
    <form action={toggleFollow.bind(null, targetUserId, username)}>
      <button
        type="submit"
        className={`rounded px-4 py-1.5 font-mono text-xs ${
          isFollowing
            ? "border border-ink-line text-paper-dim hover:border-signal hover:text-signal"
            : "bg-signal text-paper"
        }`}
      >
        {isFollowing ? "متابَع" : "تابع"}
      </button>
    </form>
  );
}
