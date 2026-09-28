"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import Image from "next/image";

interface LandingPageProps {
  energyPhrases: string[];
  energyLink: string;
  scentExploreLink: string;
  masterPhotoUrl: string;
  masterBio: string;
}

const SCENTS = [
  {
    era: "Spring Era",
    family: "花香調",
    energy: "溫柔的情感能量",
    keywords: "初綻・敞開・愛與連結",
    emoji: "🌸",
    color: "from-rose-50 to-pink-50",
    border: "border-rose-100 hover:border-rose-300",
  },
  {
    era: "Summer Era",
    family: "果香調",
    energy: "喜悅的創造能量",
    keywords: "活力・澄澈・行動與天賦",
    emoji: "🍑",
    color: "from-amber-50 to-orange-50",
    border: "border-amber-100 hover:border-amber-300",
  },
  {
    era: "Autumn Era",
    family: "木質調",
    energy: "安定的守護能量",
    keywords: "沉穩・紮根・安定與自我肯定",
    emoji: "🌿",
    color: "from-stone-50 to-amber-50",
    border: "border-stone-200 hover:border-amber-300",
  },
  {
    era: "Winter Era",
    family: "美食調",
    energy: "溫暖的療癒能量",
    keywords: "包容・滋養・回憶與自我和解",
    emoji: "🕯️",
    color: "from-amber-50 to-yellow-50",
    border: "border-amber-100 hover:border-amber-300",
  },
  {
    era: "香脂天賦",
    family: "香脂天賦",
    energy: "療癒能量",
    keywords: "修復記憶創傷・溫暖包容力",
    emoji: "🌑",
    color: "from-stone-100 to-amber-50",
    border: "border-stone-200 hover:border-amber-300",
  },
  {
    era: "調和力",
    family: "複合天賦",
    energy: "整合的奇蹟能量",
    keywords: "象徵綜合不同天賦・創造奇蹟的整合力",
    emoji: "✨",
    color: "from-rose-50 to-amber-50",
    border: "border-rose-100 hover:border-amber-300",
  },
];

export default function LandingPage({
  energyPhrases: ENERGY_PHRASES,
  energyLink,
  scentExploreLink,
  masterPhotoUrl,
  masterBio,
}: LandingPageProps) {
  const [phraseIndex, setPhraseIndex] = useState(() =>
    Math.floor(Math.random() * ENERGY_PHRASES.length),
  );
  const [fadeIn, setFadeIn] = useState(true);

  const refreshPhrase = () => {
    setFadeIn(false);
    setTimeout(() => {
      setPhraseIndex((prev) => {
        let next = Math.floor(Math.random() * ENERGY_PHRASES.length);
        if (next === prev) next = (prev + 1) % ENERGY_PHRASES.length;
        return next;
      });
      setFadeIn(true);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* ── Hero ── */}
      <section className="w-full text-center px-4 py-20 fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-4 text-stone-400 text-xs tracking-widest">
          <span>✦</span>
          <span>FRAGRANCE REALM</span>
          <span>✦</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold shimmer-text leading-tight mb-4">
          馥境
        </h1>
        <p className="text-stone-500 text-lg tracking-wide">
          香氣是一扇通往內心的小門
        </p>
      </section>

      {/* ── Energy Rainbow Card ── */}
      <section className="w-full max-w-xl px-4 pb-12 fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-transparent to-amber-50/60 rounded-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-amber-800 font-semibold tracking-wider text-sm">
              ✦ 當日能量彩虹卡
            </h2>
            <button
              onClick={refreshPhrase}
              className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-full hover:bg-stone-100"
              title="換一句"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p
            className={`text-stone-700 text-base leading-relaxed text-center py-2 transition-opacity duration-300 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            {ENERGY_PHRASES[phraseIndex]}
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {ENERGY_PHRASES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === phraseIndex ? "w-6 bg-amber-500" : "w-1.5 bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 關於主理人 ── */}
      <section
        className="w-full max-w-3xl px-4 pb-16 fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-56 shrink-0">
              <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[18rem]">
                <Image
                  src={masterPhotoUrl}
                  alt="主理人"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 224px"
                  unoptimized={
                    !masterPhotoUrl.startsWith("/") &&
                    !masterPhotoUrl.includes("supabase.co")
                  }
                />
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="text-xs text-stone-400 tracking-widest mb-2">✦ 關於主理人</div>
              <p className="text-stone-600 text-sm leading-8">{masterBio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 六種天賦香調 ── */}
      <section
        className="w-full max-w-3xl px-4 pb-16 fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="text-center mb-8">
          <p className="text-xs text-stone-400 tracking-widest mb-2">✦ 香氣，不只是好聞</p>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">找到屬於你的香氣</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            香氣是你看得見的潛意識顏色
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCENTS.map((scent) => (
            <div
              key={scent.family}
              className={`bg-gradient-to-br ${scent.color} rounded-2xl p-5 border ${scent.border} transition-all duration-300`}
            >
              <div className="text-2xl mb-2">{scent.emoji}</div>
              <div className="text-xs text-stone-400 tracking-wider mb-0.5">{scent.era}</div>
              <h3 className="text-amber-800 font-semibold text-base mb-1">{scent.family}</h3>
              <p className="text-stone-600 text-xs mb-1">{scent.energy}</p>
              <p className="text-stone-500 text-xs mb-4">{scent.keywords}</p>
              <button
                onClick={() => window.open(scentExploreLink, "_blank")}
                className="text-xs text-amber-700 hover:text-amber-900 font-medium tracking-wide transition-colors"
              >
                探索此香調 →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="w-full max-w-xl px-4 pb-20 text-center fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <p className="text-stone-500 text-sm leading-relaxed mb-6">
          你也是時間的見證者。
          <br />
          來到馥境，用四季的香氣保存當下的回憶，找回最平衡的自己。
        </p>
        <button
          onClick={() => window.open(energyLink, "_blank")}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#8B7D6B] text-white text-sm font-medium hover:bg-[#7a6c5c] transition-colors shadow-md hover:shadow-lg"
        >
          ✦ 開始你的馥境香氣旅程
        </button>
      </section>
    </div>
  );
}
