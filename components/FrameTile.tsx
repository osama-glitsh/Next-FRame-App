import { Heart, MessageSquare } from "lucide-react";

export default function FrameTile({
  content,
  createdAt,
  likeCount,
  commentCount,
}: {
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}) {
  return (
    <div className="panel panel-hover flex h-full flex-col justify-between p-4">
      <p className="mb-3 line-clamp-4 whitespace-pre-wrap text-sm text-paper">{content}</p>
      <div className="flex items-center justify-between font-mono text-[10px] text-paper-dim">
        <span>{new Date(createdAt).toLocaleDateString("ar-EG")}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" strokeWidth={1.75} />
            {likeCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" strokeWidth={1.75} />
            {commentCount}
          </span>
        </span>
      </div>
    </div>
  );
}
