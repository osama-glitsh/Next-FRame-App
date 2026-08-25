"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitProject, type ActionState } from "@/lib/actions/projects";

const initialState: ActionState = { error: null };

export default function ProjectForm() {
  const [state, formAction, pending] = useActionState(submitProject, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) {
      formRef.current?.reset();
    }
  }, [pending, state.error]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="corner-frame flex flex-col gap-3 border border-ink-line bg-ink-soft p-5"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        + مشروع جديد
      </p>

      <input
        name="title"
        placeholder="عنوان المشروع"
        required
        className="rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
      />

      <textarea
        name="description"
        placeholder="وصف المشروع… إيه اللي عايزه بالظبط؟"
        required
        rows={4}
        className="rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
      />

      <div className="grid grid-cols-3 gap-3">
        <select
          name="category"
          defaultValue=""
          className="rounded border border-ink-line bg-ink px-2 py-2 text-xs outline-none focus:border-signal"
        >
          <option value="">النوع</option>
          <option value="LAUNCH">LAUNCH</option>
          <option value="HERO">HERO</option>
          <option value="ENGINE">ENGINE</option>
          <option value="other">حاجة تانية</option>
        </select>
        <input
          name="budget"
          placeholder="الميزانية (اختياري)"
          className="rounded border border-ink-line bg-ink px-2 py-2 text-xs outline-none focus:border-signal"
        />
        <input
          name="deadline"
          type="date"
          className="rounded border border-ink-line bg-ink px-2 py-2 text-xs text-paper-dim outline-none focus:border-signal"
        />
      </div>

      {state.error && <p className="text-sm text-signal">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded bg-signal py-2 font-mono text-sm text-paper disabled:opacity-50"
      >
        {pending ? "بيتبعت..." : "ابعت المشروع"}
      </button>
    </form>
  );
}
