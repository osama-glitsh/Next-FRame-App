import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesInboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: messages } = await supabase
    .from("messages")
    .select("sender_id, receiver_id, content, created_at")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const partnerIds = new Map<string, { last: string; at: string }>();
  for (const m of messages ?? []) {
    const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
    if (!partnerIds.has(otherId)) {
      partnerIds.set(otherId, { last: m.content, at: m.created_at });
    }
  }

  let partners: { username: string; full_name: string | null; last: string }[] = [];
  if (partnerIds.size > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .in("id", Array.from(partnerIds.keys()));

    partners = (profiles ?? []).map((p) => ({
      username: p.username,
      full_name: p.full_name,
      last: partnerIds.get(p.id)?.last ?? "",
    }));
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-8">
      <div className="mb-6 animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">MESSAGES</p>
        <h1 className="mb-1 font-display text-3xl">الرسائل</h1>
        <p className="text-sm text-paper-dim">محادثاتك مع باقي أعضاء Next Frame.</p>
      </div>

      {partners.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 border-dashed p-10 text-center">
          <MessageCircle className="h-6 w-6 text-paper-dim" strokeWidth={1.5} />
          <p className="text-sm text-paper-dim">لسه مفيش محادثات.</p>
          <Link href="/community" className="font-mono text-xs text-signal hover:underline">
            روح على الاستوديو وابدأ محادثة →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {partners.map((p) => (
            <Link
              key={p.username}
              href={`/messages/${p.username}`}
              className="panel panel-hover flex items-center justify-between p-4"
            >
              <div>
                <p className="font-mono text-sm text-signal">@{p.username}</p>
                <p className="mt-1 line-clamp-1 text-sm text-paper-dim">{p.last}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
