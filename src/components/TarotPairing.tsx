"use client";

import { useState } from "react";
import { FlaskConical, Search, RotateCcw, Sparkles } from "lucide-react";

const ZODIACS = [
  { id: "aries", name: "牡羊座", symbol: "♈", element: "火" },
  { id: "taurus", name: "金牛座", symbol: "♉", element: "土" },
  { id: "gemini", name: "雙子座", symbol: "♊", element: "風" },
  { id: "cancer", name: "巨蟹座", symbol: "♋", element: "水" },
  { id: "leo", name: "獅子座", symbol: "♌", element: "火" },
  { id: "virgo", name: "處女座", symbol: "♍", element: "土" },
  { id: "libra", name: "天秤座", symbol: "♎", element: "風" },
  { id: "scorpio", name: "天蝎座", symbol: "♏", element: "水" },
  { id: "sagittarius", name: "射手座", symbol: "♐", element: "火" },
  { id: "capricorn", name: "摩羯座", symbol: "♑", element: "土" },
  { id: "aquarius", name: "水瓶座", symbol: "♒", element: "風" },
  { id: "pisces", name: "雙魚座", symbol: "♓", element: "水" },
];

interface PairResult {
  title: string;
  description: string;
  top: string;
  middle: string;
  base: string;
}

const PAIR_RESULTS: Record<string, PairResult> = {
  "aries-taurus": {
    title: "熾焰・大地交響",
    description:
      "牡羊的熱烈衝勁遇上金牛的沉穩踏實，截然不同的能量在此碰撞出奇妙火花。你們的關係如同馥奈香調，熱情奋發的開篇後，漸漸沉澱為溫厚而持久的深度。",
    top: "葡萄柚 · 黑胡椒",
    middle: "珫瑰 · 佛手柑",
    base: "廣藿香 · 雪松",
  },
  "aries-gemini": {
    title: "明亮・星火對話",
    description:
      "牁羊的熱情點燃雙子的好奇，你們的關係永遠充滿新鮮感與驚喜。香氣如同明亮的柑橘衝擊了一陣辛香，讓人精神為之一振，共同探索無盡的可能性。",
    top: "樹橗草 · 葡萄柚",
    middle: "苦橙葉 · 薄荷",
    base: "白麝香 · 雪松",
  },
  "taurus-virgo": {
    title: "大地・靜謐花園",
    description:
      "兩個土象靈魂的相遇，如同在清晨的花園裡並肩而坐。你們都珍惜細節與踏實，彼此給予的安全感是最珍貴的禮物。香氣清新自然，帶著泥土的芬芳與清新的草香。",
    top: "白茶 · 青草",
    middle: "鈴蘭 · 珫瑰木",
    base: "岩蘯草 · 橡木苔",
  },
  "taurus-libra": {
    title: "珫瑰・美的共鳴",
    description:
      "兩雙愛美的靈魂相遇，宇宙為你們獻上最甜跃的禮讚。金牛的感官享受與天秤的優雅美學融合，創造出令人沉醒的生活美學，每一刻都如詩如畫。",
    top: "荔枝 · 覆盆莓",
    middle: "珫瑰 · 牡丹",
    base: "白麝香 · 龍涎香",
  },
  "gemini-libra": {
    title: "輕盈・空氣之戀",
    description:
      "兩個風象靈魂的交織，思想的碰撞讓彼此都閃閃發光。你們的對話永遠充滿靈感，關係輕盈自由，如同空氣般流動卻無處不在。",
    top: "青蘋果 · 小黃瓜",
    middle: "苦橙葉 · 藰衣草",
    base: "檀香 · 白麝香",
  },
  "cancer-pisces": {
    title: "秘境・海洋夢境",
    description:
      "兩顔水象靈魂的深度交融，如同兩條河流匯入同一片海洋。你們天生理解彼此心底最細至的感受，這份默契無需言語，香氣如夢如幻。",
    top: "海洋 · 柑橘",
    middle: "茸莉 · 水仙",
    base: "檀香 · 龍涎香",
  },
  "leo-libra": {
    title: "璋燦・光與美麗",
    description:
      "獅子的王者之氣與天秤的優雅魅力相遇，你們是眾人矚目的完美組合。彼此欣賞對方的光芒，並讓這份光芒照耀得更加耀眼。香氣溫暖奧華，充滿存在感。",
    top: "橙花 · 小豆蔻",
    middle: "珫瑰 · 茸莉",
    base: "琥珀 · 麝香",
  },
  "scorpio-pisces": {
    title: "深淵・靈魂詩篇",
    description:
      "兩個深水之魂的相遇，彷彿宇宙刻意安排的命定之緣。你們都擁有看穿表象的直覺，靈魂深處的連結讓這段關係既神秘又深刻。香氣如詩，黑暗中帶著迷人的光。",
    top: "黑醒栗 · 柑橘",
    middle: "鳥尾花 · 烏木",
    base: "海藻 · 琥珀",
  },
  "virgo-capricorn": {
    title: "沈靜・隹永之約",
    description:
      "兩個務實踏實的靈魂共同構築吇實的基礎。你們都懂得長遠計劃與細心照料，感情在日復一日的相互依靠中愈加珍貴。香氣清醒而隹永，如同時間的沉澱。",
    top: "白茶 · 佛手柑",
    middle: "松木 · 鼠尾草",
    base: "廣藿香 · 岩蘯草",
  },
  "sagittarius-aquarius": {
    title: "自由・宇宙探險",
    description:
      "射手的大膽冒險精神與水瓶的創新思維相遇，你們一起探索世界的邊界。這段關係充滿哲學討論，自由是你們共同的信念，也是最深刻的連結。",
    top: "胡椒 · 薑",
    middle: "紫羅蘯 · 鳢尾",
    base: "廣藿香 · 烏木",
  },
};

function getPairResult(a: string, b: string): PairResult {
  const key1 = `${a}-${b}`;
  const key2 = `${b}-${a}`;
  const zA = ZODIACS.find((z) => z.id === a);
  const zB = ZODIACS.find((z) => z.id === b);
  return (
    PAIR_RESULTS[key1] ||
    PAIR_RESULTS[key2] || {
      title: "靈魂・命定交匯",
      description: `${zA?.name}與${zB?.name}的相遇，是宇宙精心安排的美麗巧合。兩種截然不同的能量彼此吸引，在差異中找到深深的理解與欣賞，你們的關係豐富了彼此的生命。`,
      top: "葡萄柚 · 佛手柑",
      middle: "苦橙葉 · 藰衣草",
      base: "檀香 · 白麝香",
    }
  );
}

const selectClass =
  "w-full py-3 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 " +
  "hover:border-stone-300 transition-all duration-200 appearance-none cursor-pointer";


export default function TarotPairing() {
  const [signA, setSignA] = useState("");
  const [signB, setSignB] = useState("");
  const [result, setResult] = useState<PairResult | null>(null);

  const canAnalyze = signA && signB && signA !== signB;

  const handleAnalyze = () => {
    if (!canAnalyze) return;
    setResult(getPairResult(signA, signB));
  };

  const handleReset = () => {
    setSignA("");
    setSignB("");
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center px-4 py-12 gap-8 max-w-2xl mx-auto">
      {/* Header */}
      <section className="text-center fade-in-up">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-5">
          <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-amber-700 text-xs font-medium tracking-widest uppercase">
            Soul Fragrance Lab
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3 leading-tight">
          ✨ 靈魂香氛實驗室
        </h1>
        <p className="text-stone-400 text-sm tracking-wide">
          👫 情侶靈魂合盤・探索你們的命定香氣
        </p>
      </section>

      {/* Input card */}
      <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-100 fade-in-up">
        <p className="text-stone-400 text-xs text-center mb-6 tracking-widest uppercase">
          🧬 選擇兩人的星座
        </p>

        {/* Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <select
              value={signA}
              onChange={(e) => {
                setSignA(e.target.value);
                setResult(null);
              }}
              className={selectClass}
            >
              <option value="" disabled>
                我的星座…
              </option>
              {ZODIACS.map((z) => (
                <option key={z.id} value={z.id} disabled={z.id === signB}>
                  {z.symbol} {z.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs select-none">
              ▾
            </div>
          </div>

          <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-400 text-sm font-light select-none">
            +
          </div>

          <div className="flex-1 relative">
            <select
              value={signB}
              onChange={(e) => {
                setSignB(e.target.value);
                setResult(null);
              }}
              className={selectClass}
            >
              <option value="" disabled>
                他/她的星座…
              </option>
              {ZODIACS.map((z) => (
                <option key={z.id} value={z.id} disabled={z.id === signA}>
                  {z.symbol} {z.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs select-none">
              ▾
            </div>
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full
            bg-white border border-stone-200 text-stone-600 text-sm font-medium
            hover:shadow-md hover:border-amber-300 hover:text-amber-800 hover:bg-amber-50
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-300"
        >
          <Search className="w-4 h-4" />
          🔍 分析配對
        </button>
      </section>

      {/* Result card */}
      {result && (
        <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-100 fade-in-up">
          {/* Card header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-1">{result.title}</h3>
            <p className="text-xs text-stone-400 tracking-wide">
              {ZODIACS.find((z) => z.id === signA)?.symbol}{" "}
              {ZODIACS.find((z) => z.id === signA)?.name}
              {" · "}
              {ZODIACS.find((z) => z.id === signB)?.symbol}{" "}
              {ZODIACS.find((z) => z.id === signB)?.name}
            </p>
          </div>

          {/* Description */}
          <p className="text-stone-600 text-sm leading-relaxed text-center mb-6">
            {result.description}
          </p>

          {/* Fragrance notes */}
          <div className="bg-stone-50 rounded-2xl p-5">
            <p className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-4">
              命定香氛配方
            </p>
            <div className="space-y-3">
              {[
                { label: "前調 Top", value: result.top },
                { label: "中調 Middle", value: result.middle },
                { label: "後調 Base", value: result.base },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-xs text-stone-400 w-24 shrink-0 pt-0.5 font-medium">
                    {label}
                  </span>
                  <span className="text-sm text-stone-500 leading-relaxed">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="mt-5 flex items-center justify-center gap-1.5 text-stone-400 hover:text-stone-600 text-xs transition-colors mx-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重新選擇
          </button>
        </section>
      )}
    </div>
  );
}

