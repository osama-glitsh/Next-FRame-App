"use client";

import { useActionState, useRef, useEffect } from "react";
import { createPost, type ActionState } from "@/lib/actions/posts";

const initialState: ActionState = { error: null };

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2 border border-ink-line bg-ink-soft p-4">
      <textarea
        name="content"
        placeholder="شاركنا حاجة..."
        required
        rows={2}
        className="rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
      />
      {state.error && <p className="text-xs text-signal">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-end rounded bg-signal px-4 py-1.5 font-mono text-xs text-paper disabled:opacity-50"
      >
        {pending ? "..." : "انشر"}
      </button>
    </form>
  );
}
