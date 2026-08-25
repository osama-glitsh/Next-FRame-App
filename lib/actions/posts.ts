"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = { error: string | null };

export async function createPost(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const content = String(formData.get("content") || "").trim();
  if (!content) return { error: "اكتب حاجة الأول." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "لازم تسجل دخول الأول." };

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    content,
  });

  if (error) return { error: "حصل خطأ أثناء النشر." };

  revalidatePath("/community");
  return { error: null };
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("post_likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath("/community");
}

export async function addComment(formData: FormData) {
  const postId = String(formData.get("post_id") || "");
  const content = String(formData.get("content") || "").trim();
  if (!postId || !content) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content,
  });

  revalidatePath("/community");
}
