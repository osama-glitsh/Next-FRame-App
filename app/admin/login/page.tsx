"use client";

import { useActionState } from "react";
import { adminLogin, type ActionState } from "@/lib/actions/admin";

const initialState: ActionState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-5 py-24">
      <div className="corner-frame border border-ink-line bg-ink-soft p-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-amber">
          ADMIN ACCESS
        </p>
        <h1 className="mb-6 font-display text-2xl">داش بورد الإدارة</h1>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs text-paper-dim">كلمة السر</label>
            <input
              name="password"
              type="password"
              required
              autoFocus
              className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-amber"
            />
          </div>

          {state.error && <p className="text-sm text-signal">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded bg-amber py-2 font-mono text-sm text-ink disabled:opacity-50"
          >
            {pending ? "..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
