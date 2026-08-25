"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const COOKIE_NAME = "nf_admin_session";

function expectedToken() {
  const secret = process.env.ADMIN_PASSWORD || "";
  return crypto.createHash("sha256").update(`nf-admin:${secret}`).digest("hex");
}

export type ActionState = { error: string | null };

export async function adminLogin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") || "");
  const configured = process.env.ADMIN_PASSWORD;

  if (!configured) {
    return { error: "ADMIN_PASSWORD مش متظبط في الإعدادات (.env.local)." };
  }
  if (password !== configured) {
    return { error: "كلمة السر غلط." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value || !process.env.ADMIN_PASSWORD) return false;
  return value === expectedToken();
}

export async function requireAdmin() {
  const ok = await isAdminSession();
  if (!ok) {
    redirect("/admin/login");
  }
}
