import Link from "next/link";
import { LayoutDashboard, Users, MessageCircle, UserCircle, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();
    username = profile?.username ?? null;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-ink-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rec-dot animate-blink" />
          <span className="font-display text-lg tracking-wide">
            NEXT <span className="text-signal">FRAME</span>
          </span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
            >
              <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
              مشاريعي
            </Link>
            <Link
              href="/community"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
            >
              <Users className="h-4 w-4" strokeWidth={1.75} />
              المجتمع
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              الرسائل
            </Link>
            {username && (
              <Link
                href={`/profile/${username}`}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
              >
                <UserCircle className="h-4 w-4" strokeWidth={1.75} />
                بروفايلي
              </Link>
            )}
            <form action={signOut} className="ms-1">
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-paper-dim transition-colors hover:bg-ink-soft hover:text-signal">
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                خروج
              </button>
            </form>
          </nav>
        ) : (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="hover:text-signal">
              دخول
            </Link>
            <Link
              href="/signup"
              className="btn-primary corner-frame rounded px-3 py-1.5 font-mono text-xs text-paper"
            >
              حساب جديد
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
