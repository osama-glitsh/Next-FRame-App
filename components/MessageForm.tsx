"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendMessage, type ActionState } from "@/lib/actions/messages";

const initialState: ActionState = { error: null };

export default function MessageForm({
  receiverId,
  receiverUsername,
}: {
  receiverId: string;
  receiverUsername: string;
}) {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-2 border-t border-ink-line p-3">
      <input type="hidden" name="receiver_id" value={receiverId} />
      <input type="hidden" name="receiver_username" value={receiverUsername} />
      <input
        name="content"
        placeholder="اكتب رسالة..."
        required
        className="flex-1 rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
      />
      <button
        disabled={pending}
        className="rounded bg-signal px-4 py-2 font-mono text-xs text-paper disabled:opacity-50"
      >
        {pending ? "..." : "بعت"}
      </button>
      {state.error && <p className="text-xs text-signal">{state.error}</p>}
    </form>
  );
}
