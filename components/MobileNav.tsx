"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Users, MessageCircle, UserCircle, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export default function MobileNav({ username }: { username: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-paper-dim hover:bg-ink-soft hover:text-paper"
        aria-label="القائمة"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-ink-line bg-ink px-5 py-3">
          <nav className="flex flex-col gap-1 text-sm">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-paper-dim hover:bg-ink-soft hover:text-paper"
            >
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
              Workspace
            </Link>
            <Link
              href="/community"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-paper-dim hover:bg-ink-soft hover:text-paper"
            >
              <Users className="h-4 w-4" strokeWidth={1.75} />
              Studio
            </Link>
            <Link
              href="/messages"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-paper-dim hover:bg-ink-soft hover:text-paper"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              Messages
            </Link>
            <Link
              href={`/profile/${username}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-paper-dim hover:bg-ink-soft hover:text-paper"
            >
              <UserCircle className="h-4 w-4" strokeWidth={1.75} />
              Profile
            </Link>
            <form action={signOut}>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-paper-dim hover:bg-ink-soft hover:text-signal">
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                خروج
              </button>
            </form>
          </nav>
        </div>
      )}
    </div>
  );
}
