"use client";

import { useState } from "react";
import { getFragranceProfile } from "@/app/actions/getFragranceProfile";
import { saveQuizHistory } from "@/app/actions/saveQuizHistory";
import type { FragranceProfile } from "@/lib/fragranceData";
import QUESTIONS_DATA from "@/data/quizQuestions.json";
import { Sparkles, RotateCcw, Share2, FlaskConical } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MBTI scoring types & quiz data                                     */
/* ------------------------------------------------------------------ */

type Dim = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

interface QuizOption {
  text: string;
  scores: Dim[];
}

interface Question {
  question: string;
  options: QuizOption[];
}

const QUESTIONS: Question[] = QUESTIONS_DATA as Question[];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type Step = "intro" | "loading" | "result" | number; // number = 1-6

export default function FragranceQuiz() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(6).fill(null),
  );
  const [result, setResult] = useState<FragranceProfile | null>(null);
  const [mbtiType, setMbtiType] = useState("");

  /* helpers */
  const selectOption = (optionIndex: number) => {
    if (typeof step !== "number") return;
    const next = [...answers];
    next[step - 1] = optionIndex;
    setAnswers(next);
  };

  const calculateMbti = (): string => {
    const s: Record<Dim, number> = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };
    answers.forEach((a, qi) => {
      if (a !== null) QUESTIONS[qi].options[a].scores.forEach((d) => s[d]++);
    });
    return (
      (s.E >= s.I ? "E" : "I") +
      (s.S >= s.N ? "S" : "N") +
      (s.T >= s.F ? "T" : "F") +
      (s.J >= s.P ? "J" : "P")
    );
  };

  const handleNext = async () => {
    if (typeof step !== "number") return;
    if (step < 6) {
      setStep(step + 1);
    } else {
      setStep("loading");
      const mbti = calculateMbti();
      setMbtiType(mbti);
      const profile = await getFragranceProfile(mbti);
      setResult(profile);
      saveQuizHistory("personality_quiz", { mbti, ...profile });
      setStep("result");
    }
  };

  const handlePrev = () => {
    if (typeof step === "number" && step > 1) setStep(step - 1);
  };

  const reset = () => {
    setStep("intro");
    setAnswers(Array(6).fill(null));
    setResult(null);
    setMbtiType("");
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `✨ 我的香氛人格是「${result.title}」！\n\n${result.personality_desc}\n\n快來測試你的命定香氣 🌸`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "香氛人格測試", text });
      } catch {
        /* cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };

  /* ————— Intro ————— */
  if (step === "intro") {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 min-h-[70vh]">
        <div className="text-center max-w-md fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6 text-stone-400 text-sm tracking-widest">
            <span>✦</span>
            <span>SOULMATE SCENT</span>
            <span>✦</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4 shimmer-text leading-tight">
            香氛人格測試
          </h1>

          <p className="text-stone-500 text-lg mb-2">探索屬於你的香氛氣質</p>
          <p className="text-stone-400 text-sm mb-10">
            6 道問題，了解你的香氛氣質
          </p>

          <div className="flex items-center justify-center gap-4 mb-10 text-amber-500/40">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
            <Sparkles className="w-4 h-4" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full max-w-xs mx-auto py-4 rounded-2xl font-semibold text-lg
              bg-stone-400 text-white shadow-sm
              hover:bg-stone-500 hover:shadow-md hover:-translate-y-0.5
              active:translate-y-0
              transition-all duration-300"
          >
            開始測試
          </button>
        </div>
      </div>
    );
  }

  /* ————— Question ————— */
  if (typeof step === "number") {
    const qi = step - 1;
    const q = QUESTIONS[qi];
    const selected = answers[qi];

    return (
      <div className="flex flex-col items-center px-4 py-8" key={step}>
        <div className="w-full max-w-lg fade-in-up">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            {/* Progress bar */}
            <div className="h-1.5 bg-stone-200">
              <div
                className="h-full bg-stone-700 rounded-r-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-stone-400 text-sm mb-2">問題 {step} / 6</p>

              <h2 className="text-2xl font-bold text-stone-800 mb-8 leading-relaxed">
                {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-base transition-all duration-200 ${
                      selected === i
                        ? "border-stone-500 bg-stone-50 text-stone-800 font-medium"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {/* Nav */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="flex-1 py-3 rounded-2xl font-medium text-base
                    border-2 border-stone-200 text-stone-500
                    hover:border-stone-300 hover:text-stone-700
                    disabled:opacity-30 disabled:cursor-not-allowed
                    transition-all duration-200"
                >
                  上一題
                </button>
                <button
                  onClick={handleNext}
                  disabled={selected === null}
                  className="flex-1 py-3 rounded-2xl font-medium text-base
                    bg-stone-400 text-white
                    hover:bg-stone-500
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200"
                >
                  下一題
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ————— Loading ————— */
  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 min-h-[70vh]">
        <div className="text-center fade-in-up">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
            <FlaskConical className="absolute inset-0 m-auto w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-stone-700 mb-2">
            正在萃取你的香氛氣質…
          </h2>
          <p className="text-stone-400 text-sm">
            請稍候，宇宙正在為你調配命定香氣
          </p>
        </div>
      </div>
    );
  }

  /* ————— Result ————— */
  if (step === "result" && result) {
    return (
      <div className="flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg fade-in-up">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden p-6 sm:p-8">
            {/* Header */}
            <h1 className="text-3xl font-bold text-stone-800 mb-1">
              你的香氛人格
            </h1>
            <p className="text-amber-700 text-lg font-medium mb-6">
              {result.title}
            </p>

            {/* Personality */}
            <div className="rounded-2xl bg-rose-50/80 border-l-4 border-amber-400 p-5 mb-4">
              <p className="text-amber-700 text-sm font-medium mb-2">
                你的人格特質
              </p>
              <p className="text-stone-700 leading-relaxed">
                {result.personality_desc}
              </p>
            </div>

            {/* Scent notes */}
            <div className="rounded-2xl bg-stone-50 border-l-4 border-amber-300 p-5 mb-4">
              <h3 className="text-stone-800 font-bold mb-3">
                氣味特質：{result.title}
              </h3>
              <div className="space-y-2 text-stone-700">
                <p>
                  <span className="font-semibold text-amber-800">前調：</span>
                  {result.scent_notes.top}
                </p>
                <p>
                  <span className="font-semibold text-amber-800">中調：</span>
                  {result.scent_notes.middle}
                </p>
                <p>
                  <span className="font-semibold text-amber-800">後調：</span>
                  {result.scent_notes.base}
                </p>
              </div>
            </div>

            {/* Advice */}
            <div className="rounded-2xl bg-stone-50 border-l-4 border-amber-200 p-5 mb-4">
              <h3 className="text-stone-800 font-bold mb-2">特別建議</h3>
              <p className="text-stone-600 leading-relaxed">{result.advice}</p>
            </div>

            {/* Life application */}
            <div className="rounded-2xl bg-stone-50 border-l-4 border-amber-200 p-5 mb-8">
              <h3 className="text-stone-800 font-bold mb-2">生活應用</h3>
              <p className="text-stone-600 leading-relaxed">
                {result.life_application}
              </p>
            </div>

            {/* MBTI badge */}
            {mbtiType && (
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  {mbtiType}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full py-3.5 rounded-2xl font-semibold text-base
                  bg-stone-400 text-white
                  hover:bg-stone-500 hover:shadow-md
                  transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  重新測試
                </span>
              </button>
              <button
                onClick={handleShare}
                className="w-full py-3.5 rounded-2xl font-semibold text-base
                  bg-rose-500 text-white
                  hover:bg-rose-600 hover:shadow-md
                  transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  分享結果
                </span>
              </button>
            </div>
          </div>

          <p className="text-center text-stone-400 text-xs mt-6 tracking-wider">
            ✦ 命定香氣探索 · Soulmate Scent ✦
          </p>
        </div>
      </div>
    );
  }

  return null;
}
