"use client";

import { useActionState, useRef, useEffect } from "react";
import { Rocket, Star, Settings, Megaphone } from "lucide-react";
import { submitProject, type ActionState } from "@/lib/actions/projects";

const initialState: ActionState = { error: null };

const FRAME_TYPES = [
  { value: "LAUNCH", label: "LAUNCH", icon: Rocket },
  { value: "HERO", label: "HERO", icon: Star },
  { value: "ENGINE", label: "ENGINE", icon: Settings },
  { value: "CAMPAIGN", label: "CAMPAIGN", icon: Megaphone },
];

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
      id="new-project"
      ref={formRef}
      action={formAction}
      className="panel flex scroll-mt-24 flex-col gap-4 p-5"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          + فريم جديد
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          01 / بريف المشروع
        </p>
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          اسم المشروع
        </label>
        <input
          name="title"
          placeholder="اكتب اسم المشروع"
          required
          className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          إحنا بنبني إيه؟
        </label>
        <textarea
          name="description"
          placeholder="وصف المشروع… إيه اللي عايزه بالظبط؟"
          required
          rows={4}
          className="w-full rounded border border-ink-line bg-ink px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          نوع الفريم
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FRAME_TYPES.map(({ value, label, icon: Icon }) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col items-center gap-1.5 rounded border border-ink-line px-2 py-3 text-paper-dim transition-colors hover:border-paper-dim hover:text-paper has-[:checked]:border-signal has-[:checked]:bg-signal/10 has-[:checked]:text-signal"
            >
              <input type="radio" name="category" value={value} className="sr-only" />
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-mono text-[9px] uppercase tracking-wide">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            الميزانية
          </label>
          <input
            name="budget"
            placeholder="اختياري"
            className="w-full rounded border border-ink-line bg-ink px-2 py-2 text-xs outline-none focus:border-signal"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            الديدلاين
          </label>
          <input
            name="deadline"
            type="date"
            className="w-full rounded border border-ink-line bg-ink px-2 py-2 text-xs text-paper-dim outline-none focus:border-signal"
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-signal">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-1 flex items-center justify-center gap-2 rounded py-2.5 font-mono text-sm text-paper disabled:opacity-50"
      >
        {pending ? "بيتبعت..." : "ابعت الفريم"}
      </button>
    </form>
  );
}
