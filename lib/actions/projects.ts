"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/actions/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type ActionState = { error: string | null };

export async function submitProject(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const budget = String(formData.get("budget") || "").trim();
  const deadline = String(formData.get("deadline") || "").trim();

  if (!title || !description) {
    return { error: "من فضلك اكتب عنوان المشروع ووصفه." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لازم تسجل دخول الأول." };
  }

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    title,
    description,
    category: category || null,
    budget: budget || null,
    deadline: deadline || null,
  });

  if (error) {
    return { error: "حصل خطأ أثناء إرسال المشروع، حاول تاني." };
  }

  revalidatePath("/");
  return { error: null };
}

export async function updateProjectStatus(formData: FormData) {
  await requireAdmin();

  const projectId = String(formData.get("project_id") || "");
  const status = String(formData.get("status") || "");
  const message = String(formData.get("message") || "").trim();

  if (!projectId || !status) return;

  const supabase = createAdminClient();

  await supabase.from("projects").update({ status, updated_at: new Date().toISOString() }).eq("id", projectId);

  if (message) {
    await supabase.from("project_updates").insert({
      project_id: projectId,
      message,
      status,
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/");
}
