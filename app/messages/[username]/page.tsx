import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessageForm from "@/components/MessageForm";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: partner } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (!partner) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${partner.id}),and(sender_id.eq.${partner.id},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto flex h-[calc(100vh-60px)] max-w-lg flex-col px-5 py-6">
      <h1 className="mb-3 font-display text-xl">
        محادثة مع <span className="text-signal">@{partner.username}</span>
      </h1>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto border border-ink-line bg-ink-soft p-4">
        {!messages || messages.length === 0 ? (
          <p className="m-auto text-sm text-paper-dim">ابدأ المحادثة.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[75%] rounded px-3 py-2 text-sm ${
                m.sender_id === user.id
                  ? "self-end bg-signal text-paper"
                  : "self-start border border-ink-line text-paper"
              }`}
            >
              {m.content}
            </div>
          ))
        )}
      </div>

      <MessageForm receiverId={partner.id} receiverUsername={partner.username} />
    </div>
  );
}
