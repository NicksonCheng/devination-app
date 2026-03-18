import mbtiScentMapData from "@/data/mbtiScentMap.json";
import mbtiFallbacksData from "@/data/mbtiFallbacks.json";

export interface FragranceProfile {
  title: string;
  personality_desc: string;
  scent_notes: { top: string; middle: string; base: string };
  advice: string;
  life_application: string;
}

export interface ScentMapping {
  scentFamily: string;
  keywords: string[];
  ingredients: string[];
}

export const MBTI_SCENT_MAP: Record<string, ScentMapping> = mbtiScentMapData;

export const FALLBACK_PROFILES: Record<string, FragranceProfile> =
  mbtiFallbacksData as Record<string, FragranceProfile>;

export function buildGenericFallback(
  mbti: string,
  mapping: ScentMapping,
): FragranceProfile {
  return {
    title: `${mapping.ingredients[0]} · ${mapping.ingredients[1] ?? mapping.keywords[0]}`,
    personality_desc: `作為${mbti}型人格，你的氣質獨特而鮮明。你的內在能量與${mapping.scentFamily}產生了奇妙的共鳴，展現出自信與細膩並存的魅力。`,
    scent_notes: {
      top: mapping.ingredients.slice(0, 2).join("、"),
      middle: mapping.ingredients.slice(1, 3).join("、"),
      base: mapping.ingredients.slice(-2).join("、"),
    },
    advice: `選擇以${mapping.keywords[0]}為主軸的香氛，能夠完美映射你的人格特質，讓內在與外在達到和諧共鳴。`,
    life_application:
      "在日常生活中使用這款香氛，可以增強你的個人氣場，帶來自信與平靜。",
  };
}
