"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { error: null };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-5 py-16">
      <div className="corner-frame panel panel-hover p-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-signal">
          ● REC
        </p>
        <h1 className="mb-6 font-display text-2xl">حساب جديد</h1>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs text-paper-dim">الاسم بالكامل</label>
            <input
              name="full_name"
              type="text"
              className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-paper-dim">
              اسم المستخدم (إنجليزي بدون مسافات)
            </label>
            <input
              name="username"
              type="text"
              required
              pattern="[a-zA-Z0-9_]{3,20}"
              className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </div>
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
            <label className="mb-1 block text-xs text-paper-dim">
              كلمة السر (6 حروف على الأقل)
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </div>

          {state.error && (
            <p className="text-sm text-signal">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-primary mt-2 rounded py-2 font-mono text-sm text-paper disabled:opacity-50"
          >
            {pending ? "..." : "اعمل حساب"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-paper-dim">
          عندك حساب بالفعل؟{" "}
          <Link href="/login" className="text-signal">
            دخول
          </Link>
        </p>
      </div>
    </div>
  );
}
