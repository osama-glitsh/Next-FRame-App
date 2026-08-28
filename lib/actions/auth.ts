"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type ActionState = { error: string | null };

export async function signUp(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const username = String(formData.get("username") || "").trim();
  const fullName = String(formData.get("full_name") || "").trim();

  if (!email || !password || !username) {
    return { error: "من فضلك املأ كل الحقول." };
  }
  if (password.length < 6) {
    return { error: "كلمة السر لازم تكون 6 حروف/أرقام على الأقل." };
  }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return { error: "اسم المستخدم يكون حروف إنجليزي/أرقام/underscore فقط (3-20)." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existing) {
    return { error: "اسم المستخدم ده مستخدم بالفعل." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: fullName },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "من فضلك دخل الإيميل وكلمة السر." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "الإيميل أو كلمة السر غلط." };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
