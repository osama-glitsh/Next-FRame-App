"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserCircle, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export default function ProfileMenu({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
      >
        <UserCircle className="h-5 w-5" strokeWidth={1.75} />
        <span className="hidden font-mono text-xs uppercase tracking-wide sm:inline">
          {displayName}
        </span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="panel absolute left-0 top-full z-30 mt-2 w-44 overflow-hidden p-1">
          <Link
            href={`/profile/${username}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded px-3 py-2 text-sm text-paper-dim transition-colors hover:bg-ink hover:text-paper"
          >
            <UserCircle className="h-4 w-4" strokeWidth={1.75} />
            بروفايلي
          </Link>
          <form action={signOut}>
            <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-paper-dim transition-colors hover:bg-ink hover:text-signal">
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              خروج
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
