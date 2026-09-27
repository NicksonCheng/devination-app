import type { Content } from "@/lib/content";

export interface PairResult {
  title: string;
  description: string;
  top: string;
  middle: string;
  base: string;
}

export function getFallbackPair(
  a: string,
  b: string,
  zodiacs: Content["zodiacs"],
  pairResults: Content["pairResults"],
): PairResult {
  const PAIR_RESULTS = pairResults as Record<string, PairResult>;
  const key1 = `${a}-${b}`;
  const key2 = `${b}-${a}`;
  const zA = zodiacs.find((z) => z.id === a);
  const zB = zodiacs.find((z) => z.id === b);
  return (
    PAIR_RESULTS[key1] ??
    PAIR_RESULTS[key2] ?? {
      title: "靈魂・命定交匯",
      description: `${zA?.name}與${zB?.name}的相遇，是宇宙精心安排的美麗巧合。兩種截然不同的能量彼此吸引，在差異中找到深深的理解與欣賞，你們的關係豐富了彼此的生命。`,
      top: "葡萄柚 · 佛手柑",
      middle: "苦橙葉 · 薰衣草",
      base: "檀香 · 白麝香",
    }
  );
}
