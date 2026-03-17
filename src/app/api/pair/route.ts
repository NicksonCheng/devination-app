import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import zodiacsData from "@/data/zodiacs.json";
import { getFallbackPair, PairResult } from "@/lib/pairFallback";

export async function POST(req: NextRequest) {
  const { signA, signB } = await req.json();
  if (!signA || !signB || signA === signB) {
    return NextResponse.json({ error: "Invalid signs" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(getFallbackPair(signA, signB));
  }

  const zA = zodiacsData.find((z) => z.id === signA);
  const zB = zodiacsData.find((z) => z.id === signB);

  const prompt = `你是一位精通星座學與香水調香的命理師。請為以下這對情侶星座組合，創作一份專屬的「命定香氛配對」報告。

星座組合：${zA?.name}（${zA?.element}象）× ${zB?.name}（${zB?.element}象）

請嚴格以 JSON 格式回應，不要包含任何其他文字或 markdown 代碼塊，只回傳純 JSON：

{
  "title": "（4-10字的詩意標題，格式如「熾焰・大地交響」）",
  "description": "（60-100字，描述這對星座的靈魂連結與愛情特質，語調浪漫而有深度）",
  "top": "（前調香氣，2-3種香料，用「·」分隔）",
  "middle": "（中調香氣，2-3種香料，用「·」分隔）",
  "base": "（後調香氣，2-3種香料，用「·」分隔）"
}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let text: string;
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text().trim();
    } finally {
      clearTimeout(timeoutId);
    }

    // Strip markdown code block if present
    const jsonText = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    const parsed: PairResult = JSON.parse(jsonText);

    // Validate required fields
    if (
      !parsed.title ||
      !parsed.description ||
      !parsed.top ||
      !parsed.middle ||
      !parsed.base
    ) {
      throw new Error("Incomplete response fields");
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.log(err);
    const isRateLimit = err instanceof Error && err.message.includes("429");
    const isTimeout =
      err instanceof Error &&
      (err.name === "AbortError" ||
        err.message.toLowerCase().includes("timeout"));

    if (isRateLimit || isTimeout || err instanceof SyntaxError) {
      // Fallback: return the pre-defined fixed result
      return NextResponse.json(getFallbackPair(signA, signB));
    }

    // Other unexpected errors — still fall back rather than surface a 500
    console.error("[/api/pair] Gemini error:", err);
    return NextResponse.json(getFallbackPair(signA, signB));
  }
}
