import Link from "next/link";
import { redirect } from "next/navigation";
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
    <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-8">
      <h1 className="font-display text-2xl">الرسائل</h1>

      {partners.length === 0 ? (
        <div className="border border-dashed border-ink-line p-6 text-center text-sm text-paper-dim">
          لسه مفيش محادثات. روح على بروفايل حد من المجتمع وابدأ رسالة.
        </div>
      ) : (
        partners.map((p) => (
          <Link
            key={p.username}
            href={`/messages/${p.username}`}
            className="border border-ink-line bg-ink-soft p-4 hover:border-signal"
          >
            <p className="font-mono text-sm text-signal">@{p.username}</p>
            <p className="mt-1 truncate text-sm text-paper-dim">{p.last}</p>
          </Link>
        ))
      )}
    </div>
  );
}
