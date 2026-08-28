"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, FolderKanban, Users, MessageSquareText, Menu, X, LogOut, ExternalLink } from "lucide-react";
import { adminLogout } from "@/lib/actions/admin";

const LINKS = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutGrid, exact: true },
  { href: "/admin/projects", label: "المشاريع", icon: FolderKanban, exact: false },
  { href: "/admin/users", label: "المستخدمين", icon: Users, exact: false },
  { href: "/admin/posts", label: "البوستات", icon: MessageSquareText, exact: false },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-amber/10 text-amber"
                : "text-paper-dim hover:bg-ink-soft hover:text-paper"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-line bg-ink/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber">Admin</p>
          <p className="font-display text-lg leading-none">Next Frame</p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-ink-line p-2 text-paper-dim"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-ink-line bg-ink-soft px-3 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-paper-dim hover:bg-ink hover:text-paper"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
              رجوع للموقع
            </Link>
            <form action={adminLogout}>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-paper-dim hover:bg-ink hover:text-signal">
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                خروج
              </button>
            </form>
          </nav>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-e border-ink-line bg-ink-soft/50 p-4 lg:flex">
        <div className="mb-6 px-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber">Admin</p>
          <p className="font-display text-xl leading-tight">
            NEXT <span className="text-signal">FRAME</span>
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="flex flex-col gap-1 border-t border-ink-line pt-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-paper-dim hover:bg-ink hover:text-paper"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            رجوع للموقع
          </Link>
          <form action={adminLogout}>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-paper-dim hover:bg-ink hover:text-signal">
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              خروج
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
