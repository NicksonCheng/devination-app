"use client";

import { useState } from "react";
import { Sparkles, Wind, RefreshCw } from "lucide-react";
import ENERGY_PHRASES from "@/data/energyPhrases.json";

interface LandingPageProps {
  onNavigateTarot: () => void;
  onNavigateQuiz: () => void;
}

export default function LandingPage({
  onNavigateTarot,
  onNavigateQuiz,
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
    <div className="flex flex-col items-center justify-center px-4 py-16 gap-12">
      {/* Hero section */}
      <section className="text-center max-w-2xl fade-in-up">
        {/* Decorative top */}
        <div className="flex items-center justify-center gap-3 mb-6 text-stone-400 text-sm tracking-widest">
          <span>✦</span>
          <span>SOULMATE SCENT</span>
          <span>✦</span>
        </div>

        {/* Main title */}
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 shimmer-text leading-tight">
          尋找你的
          <br />
          命定香氣
        </h1>

        <p className="text-stone-500 text-lg mt-4 leading-relaxed">
          每一種香氣，都是宇宙為你書寫的密語
          <br />
          <span className="text-amber-700">透過塔羅牌，揭開你的香氛命運</span>
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mt-6 text-amber-500/40">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
          <Sparkles className="w-4 h-4" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>
      </section>

      {/* Energy Rainbow Card */}
      <section
        className="w-full max-w-xl fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
          {/* Card glow bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-transparent to-amber-50/60 rounded-2xl pointer-events-none" />

          {/* Card header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-amber-600" />
              <h2 className="text-amber-800 font-semibold tracking-wider text-sm">
                ✦ 當日能量彩虹卡
              </h2>
            </div>
            <button
              onClick={refreshPhrase}
              className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-full hover:bg-stone-100"
              title="換一句"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Phrase */}
          <p
            className={`text-stone-700 text-base leading-relaxed text-center py-2 transition-opacity duration-300 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            {ENERGY_PHRASES[phraseIndex]}
          </p>

          {/* Bottom decoration */}
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

      {/* Feature teasers */}
      <section
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <button
          onClick={onNavigateTarot}
          className="bg-white rounded-2xl p-6 text-center border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-3xl mb-2">🧬</div>
          <h3 className="text-amber-800 font-semibold mb-1 text-sm">
            靈魂香氛實驗室
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            情侶靈魂合盤・探索你們的命定香氣
          </p>
        </button>
        <button
          onClick={onNavigateQuiz}
          className="bg-white rounded-2xl p-6 text-center border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-3xl mb-2">🧪</div>
          <h3 className="text-amber-800 font-semibold mb-1 text-sm">
            香氛人格測試
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            6 道問題・探索你的命定香氣
          </p>
        </button>
        <button
          onClick={() =>
            window.open(
              "https://myship.7-11.com.tw/general/detail/GM2603185975610",
              "_blank",
            )
          }
          className="bg-white rounded-2xl p-6 text-center border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          <div className="text-3xl mb-2">✨</div>
          <h3 className="text-amber-800 font-semibold mb-1 text-sm">
            能量共鳴
          </h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            感受香氣與塔羅的神秘連結
          </p>
        </button>
      </section>
    </div>
  );
}
