import { createClient } from "@supabase/supabase-js";
import energyPhrases from "@/data/energyPhrases.json";
import mbtiFallbacks from "@/data/mbtiFallbacks.json";
import mbtiScentMap from "@/data/mbtiScentMap.json";
import numerology from "@/data/numerology.json";
import pairResults from "@/data/pairResults.json";
import quizQuestions from "@/data/quizQuestions.json";
import zodiacs from "@/data/zodiacs.json";

/* ------------------------------------------------------------------ */
/*  可由調香師後台編輯的內容                                              */
/*  JSON 檔是預設值；site_content 表有資料時以資料庫為準                   */
/* ------------------------------------------------------------------ */

export const CONTENT_DEFAULTS = {
  energyLink: "https://myship.7-11.com.tw/general/detail/GM2603185975610",
  energyPhrases,
  quizQuestions,
  mbtiScentMap,
  mbtiFallbacks,
  zodiacs,
  pairResults,
  numerology,
};

export type ContentKey = keyof typeof CONTENT_DEFAULTS;
export type Content = typeof CONTENT_DEFAULTS;

export const CONTENT_LABELS: Record<ContentKey, string> = {
  energyLink: "能量共鳴連結",
  energyPhrases: "當日能量彩虹卡",
  quizQuestions: "香氛人格｜測驗題目",
  mbtiScentMap: "香氛人格｜MBTI 香調對應",
  mbtiFallbacks: "香氛人格｜MBTI 結果文案",
  zodiacs: "靈魂香氣｜星座",
  pairResults: "靈魂香氣｜配對結果文案",
  numerology: "流年香氣｜流年文案",
};

// 程式邏輯依賴的欄位，後台只能看不能改
export const READONLY_FIELDS = new Set(["id", "scores"]);

export function isContentKey(key: string): key is ContentKey {
  return key in CONTENT_DEFAULTS;
}

/**
 * 檢查 value 與預設值結構相同：物件的 key 一樣、型別一樣、唯讀欄位不變。
 * 只有「字串陣列」可以增減項目（例如能量彩虹卡句子、香氣標籤）。
 */
export function validateShape(
  value: unknown,
  template: unknown,
  path = "",
): string | null {
  const where = path || "內容";
  if (READONLY_FIELDS.has(path.split(".").pop() ?? "")) {
    return JSON.stringify(value) === JSON.stringify(template)
      ? null
      : `${where} 不可修改`;
  }
  if (typeof template === "string") {
    return typeof value === "string" ? null : `${where} 必須是文字`;
  }
  if (typeof template === "number" || typeof template === "boolean") {
    return typeof value === typeof template ? null : `${where} 型別錯誤`;
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return `${where} 必須是列表`;
    if (template.every((t) => typeof t === "string")) {
      if (value.length === 0) return `${where} 至少要有一項`;
      return value.every((v) => typeof v === "string")
        ? null
        : `${where} 只能包含文字`;
    }
    if (value.length !== template.length) return `${where} 項目數量不可變更`;
    for (let i = 0; i < template.length; i++) {
      const err = validateShape(value[i], template[i], `${path}[${i}]`);
      if (err) return err;
    }
    return null;
  }
  if (template && typeof template === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value))
      return `${where} 格式錯誤`;
    const tKeys = Object.keys(template);
    const vKeys = Object.keys(value);
    if (tKeys.length !== vKeys.length || tKeys.some((k) => !(k in value)))
      return `${where} 欄位不可增減`;
    for (const k of tKeys) {
      const err = validateShape(
        (value as Record<string, unknown>)[k],
        (template as Record<string, unknown>)[k],
        path ? `${path}.${k}` : k,
      );
      if (err) return err;
    }
    return null;
  }
  return null;
}

function contentClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

/** 讀取多個內容，資料庫沒有或格式不符時使用 JSON 預設值 */
export async function getContents<K extends ContentKey>(
  keys: K[],
): Promise<Pick<Content, K>> {
  const result = {} as Pick<Content, K>;
  for (const k of keys) result[k] = CONTENT_DEFAULTS[k];

  try {
    const { data, error } = await contentClient()
      .from("site_content")
      .select("key, value")
      .in("key", keys);
    if (error) throw error;

    for (const row of data ?? []) {
      const key = row.key as K;
      if (!keys.includes(key)) continue;
      const err = validateShape(row.value, CONTENT_DEFAULTS[key]);
      if (err) {
        console.warn(`[content] ${key} 格式不符，改用預設值：${err}`);
        continue;
      }
      result[key] = row.value as Content[K];
    }
  } catch (e) {
    console.warn("[content] 讀取 site_content 失敗，使用預設值", e);
  }
  return result;
}

export async function getContent<K extends ContentKey>(
  key: K,
): Promise<Content[K]> {
  return (await getContents([key]))[key];
}
