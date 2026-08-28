import Link from "next/link";
import { LayoutDashboard, Users, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProfileMenu from "@/components/ProfileMenu";
import MobileNav from "@/components/MobileNav";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  let displayName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", user.id)
      .maybeSingle();
    username = profile?.username ?? null;
    displayName = profile?.full_name || (profile?.username ? `@${profile.username}` : "");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-ink-line bg-ink/90 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rec-dot animate-blink" />
          <span className="font-display text-lg tracking-wide">
            NEXT <span className="text-signal">FRAME</span>
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-1 text-sm sm:flex">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
              >
                <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
                Workspace
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
              >
                <Users className="h-4 w-4" strokeWidth={1.75} />
                Studio
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper-dim transition-colors hover:bg-ink-soft hover:text-paper"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                Messages
              </Link>
              {username && <ProfileMenu username={username} displayName={displayName} />}
            </nav>
            {username && <MobileNav username={username} />}
          </div>
        ) : (
          <nav className="flex items-center gap-3 text-sm sm:gap-4">
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
