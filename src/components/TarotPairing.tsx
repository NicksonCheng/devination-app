"use client";

import { useState } from "react";
import { Star, Sparkles, RotateCcw } from "lucide-react";

interface Zodiac {
  id: string;
  name: string;
  symbol: string;
  element: string;
  color: string;
  scent: string;
}

const ZODIACS: Zodiac[] = [
  {
    id: "aries",
    name: "白羊座",
    symbol: "♈",
    element: "火",
    color: "from-red-900/40",
    scent: "黑胡椒 · 雪松",
  },
  {
    id: "taurus",
    name: "金牛座",
    symbol: "♉",
    element: "土",
    color: "from-green-900/40",
    scent: "玫瑰 · 廣藿香",
  },
  {
    id: "gemini",
    name: "雙子座",
    symbol: "♊",
    element: "風",
    color: "from-yellow-900/40",
    scent: "薰衣草 · 柑橘",
  },
  {
    id: "cancer",
    name: "巨蟹座",
    symbol: "♋",
    element: "水",
    color: "from-blue-900/40",
    scent: "茉莉 · 海洋",
  },
  {
    id: "leo",
    name: "獅子座",
    symbol: "♌",
    element: "火",
    color: "from-orange-900/40",
    scent: "乳香 · 琥珀",
  },
  {
    id: "virgo",
    name: "處女座",
    symbol: "♍",
    element: "土",
    color: "from-emerald-900/40",
    scent: "白茶 · 岩蘭草",
  },
  {
    id: "libra",
    name: "天秤座",
    symbol: "♎",
    element: "風",
    color: "from-pink-900/40",
    scent: "牡丹 · 白麝香",
  },
  {
    id: "scorpio",
    name: "天蠍座",
    symbol: "♏",
    element: "水",
    color: "from-purple-900/40",
    scent: "烏木 · 鳶尾花",
  },
  {
    id: "sagittarius",
    name: "射手座",
    symbol: "♐",
    element: "火",
    color: "from-amber-900/40",
    scent: "沉香 · 肉桂",
  },
  {
    id: "capricorn",
    name: "摩羯座",
    symbol: "♑",
    element: "土",
    color: "from-stone-800/40",
    scent: "松木 · 皮革",
  },
  {
    id: "aquarius",
    name: "水瓶座",
    symbol: "♒",
    element: "風",
    color: "from-cyan-900/40",
    scent: "紫羅蘭 · 雨後",
  },
  {
    id: "pisces",
    name: "雙魚座",
    symbol: "♓",
    element: "水",
    color: "from-indigo-900/40",
    scent: "海藻 · 水仙",
  },
];

const PAIR_RESULTS: Record<string, string> = {
  "aries-taurus":
    "熾熱的火焰遇上大地的溫柔——你們的香氣是黑胡椒玫瑰，熱烈而持久。",
  "aries-gemini": "火焰與風的碰撞，迸發出檸檬草與黑胡椒的明亮辛香。",
  "cancer-pisces": "兩顆水象靈魂的交融，如同海洋茉莉，深邃而夢幻。",
  "leo-libra": "璀璨之火與和諧之風，琥珀牡丹的組合令人陶醉。",
  "scorpio-pisces": "兩個深水之魂，烏木與海藻編織出神秘的命定之香。",
  "taurus-libra": "兩顆愛美的靈魂，玫瑰與牡丹的相遇是最甜蜜的宿命。",
  "virgo-capricorn": "務實的大地之愛，白茶松木，清醒而雋永。",
};

function getPairResult(a: string, b: string): string {
  const key1 = `${a}-${b}`;
  const key2 = `${b}-${a}`;
  return (
    PAIR_RESULTS[key1] ||
    PAIR_RESULTS[key2] ||
    `✨ 宇宙的神秘力量將你們連結——${
      ZODIACS.find((z) => z.id === a)?.scent ?? ""
    } 與 ${ZODIACS.find((z) => z.id === b)?.scent ?? ""} 的交融，是獨一無二的命定之香。`
  );
}

export default function TarotPairing() {
  const [slots, setSlots] = useState<[Zodiac | null, Zodiac | null]>([
    null,
    null,
  ]);
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleZodiacClick = (zodiac: Zodiac) => {
    if (showResult) return;

    setSlots((prev) => {
      const [left, right] = prev;
      // If already selected in a slot, remove it
      if (left?.id === zodiac.id) return [null, right];
      if (right?.id === zodiac.id) return [left, null];
      // Fill left first, then right
      if (!left) {
        setSelected((s) => new Set(s).add(zodiac.id));
        return [zodiac, right];
      }
      if (!right) {
        setSelected((s) => new Set(s).add(zodiac.id));
        return [left, zodiac];
      }
      return prev; // both filled
    });
  };

  const handleStartPairing = () => {
    if (!slots[0] || !slots[1]) return;
    setResultText(getPairResult(slots[0].id, slots[1].id));
    setShowResult(true);
  };

  const handleReset = () => {
    setSlots([null, null]);
    setShowResult(false);
    setResultText("");
    setSelected(new Set());
  };

  const bothFilled = slots[0] !== null && slots[1] !== null;

  return (
    <div className="flex flex-col items-center px-4 py-12 gap-10 max-w-3xl mx-auto">
      {/* Header */}
      <section className="text-center fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-3 text-amber-400/60 text-xs tracking-widest">
          <span>✦</span>
          <span>TAROT SCENT PAIRING</span>
          <span>✦</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold shimmer-text mb-2">
          塔羅香氛配對
        </h1>
        <p className="text-amber-100/60 text-sm">探索你的命定香氣</p>
        <p className="mt-3 text-amber-300/80 text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          選擇兩張塔羅牌，揭示你們的香氛緣分
          <Sparkles className="w-4 h-4" />
        </p>
      </section>

      {/* Card Slots */}
      <section className="flex items-center justify-center gap-6 w-full fade-in-up">
        {/* Left slot */}
        <CardSlot zodiac={slots[0]} label="第一張" />

        {/* Center star icon */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative">
            <Star
              className={`w-8 h-8 text-amber-400 ${
                bothFilled ? "spin-slow" : "float-anim"
              }`}
              fill={bothFilled ? "currentColor" : "none"}
            />
            {bothFilled && (
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md animate-pulse" />
            )}
          </div>
          {bothFilled && (
            <span className="text-amber-400/60 text-xs">命定</span>
          )}
        </div>

        {/* Right slot */}
        <CardSlot zodiac={slots[1]} label="第二張" />
      </section>

      {/* CTA: Start Pairing or Result */}
      {bothFilled && !showResult && (
        <button
          onClick={handleStartPairing}
          className="group fade-in-up flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-[#0B1021] bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/40 hover:shadow-xl"
        >
          <Star
            className="w-5 h-5 group-hover:rotate-12 transition-transform"
            fill="currentColor"
          />
          開始配對
          <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
        </button>
      )}

      {/* Result card */}
      {showResult && (
        <div className="w-full fade-in-up">
          <div className="glass-card rounded-2xl p-6 border border-amber-400/30 glow-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-purple-900/10 to-indigo-900/10 rounded-2xl pointer-events-none" />
            <div className="relative text-center">
              <div className="flex justify-center mb-3">
                <Star className="w-8 h-8 text-amber-400" fill="currentColor" />
              </div>
              <h3 className="text-amber-300 font-bold text-lg mb-3 tracking-wide">
                ✦ 你們的命定香氛 ✦
              </h3>
              <div className="flex items-center justify-center gap-3 mb-4 text-2xl font-bold">
                <span className="shimmer-text">{slots[0]?.name}</span>
                <span className="text-amber-500/60">×</span>
                <span className="shimmer-text">{slots[1]?.name}</span>
              </div>
              <p className="text-amber-100/80 text-base leading-relaxed mb-2">
                {resultText}
              </p>
              <div className="mt-4 text-xs text-amber-500/50">
                {slots[0]?.scent} ∞ {slots[1]?.scent}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-amber-500/60 hover:text-amber-400 text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重新選擇
            </button>
          </div>
        </div>
      )}

      {/* Zodiac Grid */}
      {!showResult && (
        <section className="w-full fade-in-up">
          <p className="text-center text-amber-500/50 text-xs mb-4 tracking-widest">
            — 點選星座牌 —
          </p>
          <div className="grid grid-cols-4 gap-3">
            {ZODIACS.map((zodiac) => {
              const isInSlot = selected.has(zodiac.id);
              const isSlot0 = slots[0]?.id === zodiac.id;
              const isSlot1 = slots[1]?.id === zodiac.id;
              const disabled = bothFilled && !isInSlot;

              return (
                <button
                  key={zodiac.id}
                  onClick={() => handleZodiacClick(zodiac)}
                  disabled={disabled}
                  className={`
                    relative group flex flex-col items-center justify-center gap-1.5
                    py-4 px-2 rounded-xl border transition-all duration-200
                    bg-gradient-to-b ${zodiac.color} to-slate-900/60
                    ${
                      isInSlot
                        ? "border-amber-400/70 shadow-lg shadow-amber-500/20 scale-105"
                        : "border-amber-500/15 hover:border-amber-500/40 hover:scale-105"
                    }
                    ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {/* Selected badge */}
                  {(isSlot0 || isSlot1) && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[#0B1021] text-[9px] font-bold flex items-center justify-center shadow">
                      {isSlot0 ? "1" : "2"}
                    </span>
                  )}

                  <span className="text-2xl leading-none">{zodiac.symbol}</span>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isInSlot
                        ? "text-amber-300"
                        : "text-amber-100/70 group-hover:text-amber-200"
                    }`}
                  >
                    {zodiac.name}
                  </span>
                  <span className="text-[10px] text-amber-500/40 hidden sm:block">
                    {zodiac.element}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-amber-500/30 text-xs mt-4">
            {!slots[0] && !slots[1] && "請選擇第一張牌"}
            {slots[0] && !slots[1] && `已選 ${slots[0].name}・請選擇第二張牌`}
            {slots[0] &&
              slots[1] &&
              `${slots[0].name} ✦ ${slots[1].name}・點擊已選牌可取消`}
          </p>
        </section>
      )}
    </div>
  );
}

// ─── Card Slot sub-component ────────────────────────────────────────────────

function CardSlot({ zodiac, label }: { zodiac: Zodiac | null; label: string }) {
  return (
    <div
      className={`
        relative w-32 h-48 sm:w-40 sm:h-56 rounded-xl flex flex-col items-center justify-center
        transition-all duration-500
        ${
          zodiac
            ? "border-2 border-amber-400/60 bg-gradient-to-b from-amber-900/20 to-slate-900/60 shadow-lg shadow-amber-500/20 glow-border"
            : "border-2 border-dashed border-amber-500/30 bg-transparent hover:border-amber-500/50"
        }
      `}
    >
      {zodiac ? (
        <div className="text-center fade-in-up">
          <div className="text-4xl mb-2">{zodiac.symbol}</div>
          <p className="text-amber-300 font-bold text-sm">{zodiac.name}</p>
          <p className="text-amber-500/60 text-xs mt-1">{zodiac.element}象</p>
          <p className="text-amber-100/40 text-[10px] mt-1.5 px-2 leading-tight">
            {zodiac.scent}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <span className="text-3xl text-amber-500/30">?</span>
          <p className="text-amber-500/30 text-xs mt-2">{label}</p>
        </div>
      )}
    </div>
  );
}
