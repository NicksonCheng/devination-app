"use client";

import { useState } from "react";
import {
  FlaskConical,
  Search,
  RotateCcw,
  Sparkles,
  Loader2,
} from "lucide-react";
import ZODIACS from "@/data/zodiacs.json";
import { getFallbackPair, PairResult } from "@/lib/pairFallback";

const selectClass =
  "w-full py-3 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 " +
  "hover:border-stone-300 transition-all duration-200 appearance-none cursor-pointer";

export default function TarotPairing() {
  const [signA, setSignA] = useState("");
  const [signB, setSignB] = useState("");
  const [result, setResult] = useState<PairResult | null>(null);
  const [loading, setLoading] = useState(false);

  const canAnalyze = signA && signB && signA !== signB;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signA, signB }),
      });
      const data: PairResult = await res.json();
      setResult(data);
    } catch {
      //setResult(getFallbackPair(signA, signB));
    } finally {
      setLoading(false);
    }
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
          disabled={!canAnalyze || loading}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full
            bg-white border border-stone-200 text-stone-600 text-sm font-medium
            hover:shadow-md hover:border-amber-300 hover:text-amber-800 hover:bg-amber-50
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              命理師正在占卜…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              🔍 分析配對
            </>
          )}
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
            <h3 className="text-xl font-bold text-stone-800 mb-1">
              {result.title}
            </h3>
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
