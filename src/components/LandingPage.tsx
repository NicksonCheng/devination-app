"use client";

import { useEffect, useState } from "react";
import { Sparkles, Wind, ArrowRight, RefreshCw } from "lucide-react";

const ENERGY_PHRASES = [
  "✨ 今日的你，散發著月光般的柔和能量，吸引著命定之緣悄然靠近。",
  "🌸 玫瑰與雪松的氣息環繞你，象徵著內心深處等待盛放的美麗。",
  "🌙 星辰低語：你的靈魂正在尋找那一縷讓心靈共鳴的神秘香氣。",
  "☽ 今日水星逆行已結束，是時候讓香氣引領你走入命運的交匯點。",
  "🔮 塔羅牌揭示：你的氣場與大地檀木產生了奇妙的共鳴，靜心感受。",
];

interface LandingPageProps {
  onNavigateTarot: () => void;
}

export default function LandingPage({ onNavigateTarot }: LandingPageProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // Pick random phrase on mount
    setPhraseIndex(Math.floor(Math.random() * ENERGY_PHRASES.length));
  }, []);

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
        <div className="flex items-center justify-center gap-3 mb-6 text-amber-400/60 text-sm tracking-widest">
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

        <p className="text-amber-100/60 text-lg mt-4 leading-relaxed">
          每一種香氣，都是宇宙為你書寫的密語
          <br />
          <span className="text-amber-400/80">
            透過塔羅牌，揭開你的香氛命運
          </span>
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
        <div className="glass-card rounded-2xl p-6 border border-amber-500/20 glow-border relative overflow-hidden">
          {/* Card glow bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-amber-900/10 rounded-2xl pointer-events-none" />

          {/* Card header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-amber-400" />
              <h2 className="text-amber-300 font-semibold tracking-wider text-sm">
                ✦ 當日能量彩虹卡
              </h2>
            </div>
            <button
              onClick={refreshPhrase}
              className="text-amber-500/50 hover:text-amber-400 transition-colors p-1 rounded-full hover:bg-amber-500/10"
              title="換一句"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Phrase */}
          <p
            className={`text-amber-100/90 text-base leading-relaxed text-center py-2 transition-opacity duration-300 ${
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
                  i === phraseIndex
                    ? "w-6 bg-amber-400"
                    : "w-1.5 bg-amber-500/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <section
        className="text-center fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <button
          onClick={onNavigateTarot}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg text-[#0B1021] bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          開始塔羅香氛配對
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          {/* Inner glow */}
          <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <p className="mt-3 text-amber-500/40 text-xs">
          選擇兩張塔羅牌・揭示你的命定香氣
        </p>
      </section>

      {/* Feature teasers */}
      <section
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        {[
          { icon: "🔮", title: "塔羅配對", desc: "選擇星座牌陣，解讀香氛密碼" },
          { icon: "🌸", title: "命定香氛", desc: "專屬於你靈魂的氣息組合" },
          { icon: "✨", title: "能量共鳴", desc: "感受香氣與塔羅的神秘連結" },
        ].map((item) => (
          <div
            key={item.title}
            className="glass-card rounded-xl p-4 text-center border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 cursor-default"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="text-amber-300 font-semibold mb-1 text-sm">
              {item.title}
            </h3>
            <p className="text-amber-100/50 text-xs leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
