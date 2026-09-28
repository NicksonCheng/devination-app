"use server";

import { cookies } from "next/headers";
import { getContent } from "@/lib/content";
import { createClient } from "@/utils/supabase/server";
import { saveQuizHistory } from "./saveQuizHistory";

export interface NumerologyResult {
  yearNumText: string;
  yearTitle: string;
  element: string;
  godName: string;
  quote: string;
  description: string;
  challenge: string;
  talent: string;
  action: string;
  scents: string[];
  purchaseLink: string;
}

const COOKIE_NAME = "numerology_access";
const CURRENT_YEAR = 2026;

// 密碼雜湊與 access token 存在 Supabase（見 db.sql），調香師在後台改密碼後 token 會更換，舊 cookie 自動失效
async function hasAccess(): Promise<boolean> {
  const supabase = await createClient();
  // 必須先登入才能使用此功能
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const { data } = await supabase.rpc("check_numerology_token", {
    p_token: token,
  });
  return data === true;
}

export async function checkNumerologyAccess(): Promise<"ok" | "locked" | "not_logged_in"> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "not_logged_in";
  const ok = await hasAccess();
  return ok ? "ok" : "locked";
}

export async function unlockNumerology(
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "請先登入再使用此功能。" };

  const { data: configured } = await supabase.rpc("has_numerology_password");
  if (!configured) {
    return { ok: false, error: "此功能尚未開放，請洽詢調香師。" };
  }

  const { data: token } = await supabase.rpc("verify_numerology_password", {
    p_password: password.trim(),
  });
  if (typeof token !== "string" || !token) {
    return { ok: false, error: "密碼錯誤，請向調香師確認密碼。" };
  }

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 天
  });
  return { ok: true };
}

function reduceToSingleDigit(numStr: string): number {
  const total = [...numStr].reduce((sum, ch) => sum + parseInt(ch, 10), 0);
  return total > 9 ? reduceToSingleDigit(total.toString()) : total;
}

// 流年數字 = 當年年份 + 出生月 + 出生日，逐位相加至個位數
function calculatePersonalYearNumber(birthdate: string): number | null {
  // 直接解析 YYYY-MM-DD 字串，避免 new Date() 的時區偏移導致日期差一天
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthdate);
  if (!match) return null;
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return reduceToSingleDigit(`${CURRENT_YEAR}${month}${day}`);
}

export async function getNumerologyResult(
  birthdate: string,
): Promise<
  | { ok: true; result: NumerologyResult }
  | { ok: false; error: string; locked?: boolean }
> {
  if (!(await hasAccess())) {
    return { ok: false, error: "請先輸入調香師提供的密碼。", locked: true };
  }

  const num = calculatePersonalYearNumber(birthdate);
  if (num === null) {
    return { ok: false, error: "請輸入正確的出生年月日。" };
  }

  const data = (await getContent("numerology")) as Record<
    string,
    NumerologyResult
  >;
  const result = data[num] ?? data[1];

  await saveNumerologyHistory(birthdate, num, result);

  return { ok: true, result };
}

// 流年一年只變一次：同一使用者、同一生日、同一年份已有紀錄就不重複寫入
async function saveNumerologyHistory(
  birthdate: string,
  num: number,
  result: NumerologyResult,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { count } = await supabase
    .from("quiz_history")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("quiz_type", "numerology")
    .eq("result_data->>birthdate", birthdate)
    .eq("result_data->>year", String(CURRENT_YEAR));
  if (count) return;

  await saveQuizHistory("numerology", {
    birthdate,
    year: CURRENT_YEAR,
    number: num,
    title: result.yearTitle,
    ...result,
  });
}
