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
  return { ok: true };
}
