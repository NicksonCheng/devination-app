"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getIsAdmin } from "@/lib/admin";
import {
  CONTENT_DEFAULTS,
  isContentKey,
  validateShape,
} from "@/lib/content";

type ActionResult = { ok: true } | { ok: false; error: string };

const NOT_ADMIN: ActionResult = { ok: false, error: "沒有後台權限。" };

export async function saveContent(
  key: string,
  value: unknown,
): Promise<ActionResult> {
  if (!(await getIsAdmin())) return NOT_ADMIN;
  if (!isContentKey(key)) return { ok: false, error: "未知的內容項目。" };

  const shapeError = validateShape(value, CONTENT_DEFAULTS[key]);
  if (shapeError) return { ok: false, error: `格式錯誤：${shapeError}` };

  if (key === "energyLink") {
    try {
      const url = new URL(value as string);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw 0;
    } catch {
      return { ok: false, error: "請輸入完整網址（https:// 開頭）。" };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("site_content").upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
    updated_by: user?.id,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetContent(key: string): Promise<ActionResult> {
  if (!(await getIsAdmin())) return NOT_ADMIN;
  if (!isContentKey(key)) return { ok: false, error: "未知的內容項目。" };

  const supabase = await createClient();
  const { error } = await supabase.from("site_content").delete().eq("key", key);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function setNumerologyPassword(
  password: string,
): Promise<ActionResult> {
  if (!(await getIsAdmin())) return NOT_ADMIN;

  const trimmed = password.trim();
  if (trimmed.length < 4) {
    return { ok: false, error: "密碼至少需要 4 個字元。" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_numerology_password", {
    p_password: trimmed,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/*  後台帳號管理                                                        */
/* ------------------------------------------------------------------ */

export interface AdminUser {
  user_id: string;
  email: string;
  nickname: string | null;
  phone: string | null;
  birthdate: string | null;
  created_at: string;
  last_sign_in: string | null;
  quiz_count: number;
  is_admin: boolean;
}

export interface AdminHistoryRow {
  id: string;
  quiz_type: string;
  result_data: Record<string, unknown>;
  created_at: string;
}

export async function getAllUsers(): Promise<
  { ok: true; users: AdminUser[] } | { ok: false; error: string }
> {
  if (!(await getIsAdmin())) return { ok: false, error: "沒有後台權限。" };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_all_users_for_admin");
  if (error) return { ok: false, error: error.message };

  return {
    ok: true,
    users: (data as AdminUser[]).map((u) => ({
      ...u,
      quiz_count: Number(u.quiz_count),
    })),
  };
}

export async function getUserHistory(userId: string): Promise<
  { ok: true; rows: AdminHistoryRow[] } | { ok: false; error: string }
> {
  if (!(await getIsAdmin())) return { ok: false, error: "沒有後台權限。" };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_user_history_for_admin", {
    p_user_id: userId,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true, rows: data as AdminHistoryRow[] };
}
