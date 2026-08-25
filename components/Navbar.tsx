import Link from "next/link";
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
    <header className="sticky top-0 z-20 border-b border-ink-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rec-dot animate-blink" />
          <span className="font-display text-lg tracking-wide">
            NEXT <span className="text-signal">FRAME</span>
          </span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/" className="hover:text-signal">
              مشاريعي
            </Link>
            <Link href="/community" className="hover:text-signal">
              المجتمع
            </Link>
            <Link href="/messages" className="hover:text-signal">
              الرسائل
            </Link>
            {username && (
              <Link href={`/profile/${username}`} className="hover:text-signal">
                بروفايلي
              </Link>
            )}
            <form action={signOut}>
              <button className="font-mono text-xs text-paper-dim hover:text-signal">
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
              className="corner-frame rounded bg-signal px-3 py-1.5 font-mono text-xs text-paper"
            >
              حساب جديد
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
