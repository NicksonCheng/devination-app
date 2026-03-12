"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = mapAuthError(error.message);
    redirect(`/login?error=${encodeURIComponent(message)}&mode=login`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const message = mapAuthError(error.message);
    redirect(`/login?error=${encodeURIComponent(message)}&mode=signup`);
  }

  revalidatePath("/", "layout");
  // 導向首頁並帶提示，informing user to check email if confirmation needed
  redirect("/login?success=registered");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** 將 Supabase 英文錯誤訊息轉為中文 */
function mapAuthError(message: string): string {
  if (message.includes("Invalid login credentials"))
    return "電子郵件或密碼不正確，請重新確認";
  if (message.includes("Email not confirmed"))
    return "請先至信箱確認驗證信件後再登入";
  if (message.includes("User already registered"))
    return "此電子郵件已被註冊，請直接登入";
  if (message.includes("Password should be at least"))
    return "密碼長度至少需要 6 個字元";
  if (message.includes("Unable to validate email address"))
    return "電子郵件格式不正確";
  if (message.includes("Email rate limit exceeded"))
    return "發送次數過多，請稍後再試";
  return message;
}
