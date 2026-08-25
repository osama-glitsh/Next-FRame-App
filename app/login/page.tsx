"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-5 py-20">
      <div className="corner-frame border border-ink-line bg-ink-soft p-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-signal">
          ● REC
        </p>
        <h1 className="mb-6 font-display text-2xl">تسجيل الدخول</h1>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs text-paper-dim">الإيميل</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-paper-dim">كلمة السر</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </div>

          {state.error && (
            <p className="text-sm text-signal">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded bg-signal py-2 font-mono text-sm text-paper disabled:opacity-50"
          >
            {pending ? "..." : "دخول"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-paper-dim">
          معندكش حساب؟{" "}
          <Link href="/signup" className="text-signal">
            اعمل حساب
          </Link>
        </p>
      </div>
    </div>
  );
}
