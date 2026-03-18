"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  type FragranceProfile,
  MBTI_SCENT_MAP,
  FALLBACK_PROFILES,
  buildGenericFallback,
} from "@/lib/fragranceData";

export async function getFragranceProfile(
  mbti: string,
): Promise<FragranceProfile> {
  const type = mbti.toUpperCase();
  const mapping = MBTI_SCENT_MAP[type];

  if (!mapping) {
    return FALLBACK_PROFILES.INFP;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return FALLBACK_PROFILES[type] ?? buildGenericFallback(type, mapping);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `你是一位頂尖的香氛專家與人格分析師。請根據 MBTI 人格類型「${type}」，生成一份高度個人化的繁體中文香氛人格報告。

此人格的香氣屬性為：${mapping.scentFamily}
建議香調元素：${mapping.ingredients.join("、")}
香氣關鍵詞：${mapping.keywords.join("、")}

請以 JSON 格式回覆，欄位如下：
{
  "title": "香氛主題名稱（4-8字，詩意且有畫面感）",
  "personality_desc": "人格特質描述（60-100字繁體中文）",
  "scent_notes": {
    "top": "前調香料（2-3種，用頓號《、》分隔）",
    "middle": "中調香料（2-3種，用頓號《、》分隔）",
    "base": "後調香料（2-3種，用頓號《、》分隔）"
  },
  "advice": "專屬香氣建議（40-80字繁體中文）",
  "life_application": "生活應用場景（40-80字繁體中文）"
}

要求：
- 所有文字必須是繁體中文
- 語調溫暖而富有詩意
- 香料名稱使用常見的中文譯名`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const result = await model.generateContent(
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { signal: controller.signal as AbortSignal },
    );
    clearTimeout(timeout);

    const text = result.response.text();
    const parsed: FragranceProfile = JSON.parse(text);

    if (!parsed.title || !parsed.personality_desc || !parsed.scent_notes?.top) {
      throw new Error("Incomplete response");
    }

    return parsed;
  } catch (err) {
    console.error("Gemini fragrance API error:", err);
    return FALLBACK_PROFILES[type] ?? buildGenericFallback(type, mapping);
  }
}
