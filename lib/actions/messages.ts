"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = { error: string | null };

export async function sendMessage(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const receiverId = String(formData.get("receiver_id") || "");
  const receiverUsername = String(formData.get("receiver_username") || "");
  const content = String(formData.get("content") || "").trim();

  if (!receiverId || !content) return { error: "اكتب رسالة الأول." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "لازم تسجل دخول الأول." };

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content,
  });

  if (error) return { error: "الرسالة معملتش send." };

  revalidatePath(`/messages/${receiverUsername}`);
  return { error: null };
}
