"use client";

import { useEffect, useState, useTransition } from "react";
import { Lock } from "lucide-react";
import {
  checkNumerologyAccess,
  unlockNumerology,
  getNumerologyResult,
  type NumerologyResult,
} from "@/app/actions/numerology";
import { useLoading } from "@/components/LoadingContext";

/* ------------------------------------------------------------------ */
/*  2026 流年靈數 × 香氣尋境（需調香師密碼）                              */
/* ------------------------------------------------------------------ */

type Step = "checking" | "not_logged_in" | "locked" | "input" | "result";

const ARCH = "rounded-t-[100px] rounded-b-[24px]";
const BTN =
  "w-full bg-[#91634B] hover:bg-[#724a35] text-[#F1EAD8] font-serif py-3.5 rounded-xl shadow-sm tracking-wider text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed";
// text-[16px] prevents iOS Safari from auto-zooming (< 16px triggers zoom → layout shift)
const INPUT =
  "w-full bg-[#F1EAD8] border border-[#A7A48F]/40 rounded-xl px-4 py-3 text-[#91634B] text-center focus:outline-none focus:border-[#91634B] transition text-[16px] leading-normal";

function BrandHeader() {
  return (
    <>
      <div className="mb-4 text-[#A7A48F] flex flex-col items-center">
        <span className="text-2xl mb-1">🌙</span>
        <h1 className="text-2xl font-serif tracking-widest text-[#91634B] font-bold">
          馥 境
        </h1>
        <p className="text-[10px] tracking-[0.2em] text-[#A7A48F] uppercase">
          FRAGRANCE REALM
        </p>
      </div>
      <div className="h-px w-12 bg-[#A7A48F]/40 mx-auto my-4" />
      <h2 className="text-lg font-serif text-[#91634B] mb-2">
        2026 流年靈數 × 香氣尋境
      </h2>
    </>
  );
}

export default function NumerologyScent() {
  const [step, setStep] = useState<Step>("checking");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    // AppShell shows loading before navigating here; update message and
    // hide only after the access check finishes (self-managed loading page).
    showLoading("驗證權限中");
    checkNumerologyAccess().then((status) => {
      if (status === "not_logged_in") setStep("not_logged_in");
      else if (status === "ok") setStep("input");
      else setStep("locked");
      hideLoading();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("請輸入調香師提供的密碼。");
      return;
    }
    setError("");
    showLoading("驗證密碼中");
    startTransition(async () => {
      const res = await unlockNumerology(password);
      hideLoading();
      if (res.ok) {
        setPassword("");
        setStep("input");
      } else {
        setError(res.error ?? "密碼錯誤。");
      }
    });
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthdate) {
      setError("請先選擇您的出生年月日！");
      return;
    }
    setError("");
    showLoading("尋境中");
    startTransition(async () => {
      const res = await getNumerologyResult(birthdate);
      hideLoading();
      if (res.ok) {
        setResult(res.result);
        setStep("result");
      } else if (res.locked) {
        setStep("locked");
        setError(res.error);
      } else {
        setError(res.error);
      }
    });
  };

  const reset = () => {
    setResult(null);
    setError("");
    setStep("input");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#F1EAD8] text-[#91634B] flex items-center justify-center p-4">
      {/* "checking" step: global LoadingScreen is shown instead */}
      {step === "checking" && null}

      {/* ================= 0. 未登入提示 ================= */}
      {step === "not_logged_in" && (
        <div className={`w-full max-w-md bg-[#EBE8E0] border border-[#A7A48F]/30 ${ARCH} p-6 sm:p-8 text-center shadow-sm`}>
          <BrandHeader />
          <p className="text-xs text-[#91634B]/80 mb-6 leading-relaxed">
            此為馥境會員專屬體驗。
            <br />
            請先登入以探索你的 2026 流年香氣。
          </p>
          <a
            href="/login"
            className={BTN + " inline-block"}
          >
            ✦ 前往登入 ✦
          </a>
          <p className="text-[11px] text-[#A7A48F] italic mt-4">
            「在自然與月光的陪伴下，屬於你的美麗由此展開。」
          </p>
        </div>
      )}

      {/* ================= 1. 密碼鎖 ================= */}
      {step === "locked" && (
        <form
          onSubmit={handleUnlock}
          className={`w-full max-w-md bg-[#EBE8E0] border border-[#A7A48F]/30 ${ARCH} p-6 sm:p-8 text-center shadow-sm`}
        >
          <BrandHeader />
          <p className="text-xs text-[#91634B]/80 mb-6 leading-relaxed">
            此為馥境專屬體驗。
            <br />
            請輸入調香師提供的密碼以開啟香氣尋境。
          </p>
          <div className="mb-4 relative">
            <Lock className="w-4 h-4 text-[#A7A48F] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="調香師密碼"
              autoComplete="off"
              className={`${INPUT} px-10`}
            />
          </div>
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <button type="submit" disabled={isPending} className={`${BTN} mb-4`}>
            {isPending ? "驗證中…" : "✦ 解鎖 ✦"}
          </button>
          <p className="text-[11px] text-[#A7A48F] italic">
            「在自然與月光的陪伴下，屬於你的美麗由此展開。」
          </p>
        </form>
      )}

      {/* ================= 2. 輸入生日 ================= */}
      {step === "input" && (
        <form
          onSubmit={handleAnalyze}
          className={`w-full max-w-md bg-[#EBE8E0] border border-[#A7A48F]/30 ${ARCH} p-6 sm:p-8 text-center shadow-sm`}
        >
          <BrandHeader />
          <p className="text-xs text-[#91634B]/80 mb-6 leading-relaxed">
            香氣是一扇通往內心世界的門。
            <br />
            輸入西元出生年月日，開啟專屬你的 KPIA 命定調香配方。
          </p>
          <div className="mb-6">
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className={INPUT}
            />
          </div>
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <button type="submit" disabled={isPending} className={`${BTN} mb-4`}>
            {isPending ? "尋境中…" : "✦ 開啟尋境密碼 ✦"}
          </button>
          <p className="text-[11px] text-[#A7A48F] italic">
            「在自然與月光的陪伴下，屬於你的美麗由此展開。」
          </p>
        </form>
      )}

      {/* ================= 3. 分析結果 ================= */}
      {step === "result" && result && (
        <div className="w-full max-w-md bg-[#F1EAD8] rounded-3xl p-4 shadow-sm my-6 border border-[#A7A48F]/20">
          <div
            className={`bg-[#EBE8E0] ${ARCH} p-6 text-center border border-[#A7A48F]/30 mb-6 shadow-sm`}
          >
            <div className="mb-3">
              <span className="bg-[#91634B] text-[#F1EAD8] text-xs font-serif px-3 py-1 rounded-full tracking-wider">
                {result.yearNumText}
              </span>
              <h2 className="text-base font-serif font-bold mt-2">
                {result.yearTitle}
              </h2>
            </div>

            <span className="inline-block border border-[#A7A48F] text-[11px] px-3 py-0.5 rounded-full mb-3 bg-[#F1EAD8]">
              {result.element}
            </span>

            <p className="text-[11px] text-[#A7A48F] tracking-widest uppercase">
              YOUR 香氣守護神
            </p>
            <h3 className="text-2xl font-serif font-bold my-1 tracking-wide">
              {result.godName}
            </h3>
            <p className="text-xs italic text-[#91634B]/90 mb-3">
              {result.quote}
            </p>
            <p className="text-xs text-[#91634B]/80 leading-relaxed text-justify px-2 mb-4">
              {result.description}
            </p>

            <div className="text-[11px] font-bold mb-2 border-t border-[#A7A48F]/20 pt-3">
              ✦ 馥境 ‧ 命定 80 隻調香組合 ✦
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mb-2">
              {result.scents.map((scent) => (
                <span
                  key={scent}
                  className="bg-[#F1EAD8] border border-[#A7A48F]/40 text-[11px] px-2.5 py-0.5 rounded-full font-sans"
                >
                  {scent}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-xs px-3 py-3 bg-[#EBE8E0]/50 rounded-2xl border border-[#A7A48F]/10">
            {[
              { title: "2026 年度生命課題與意義", body: result.challenge },
              { title: "2026 年度人生天賦", body: result.talent },
              { title: "年度尋境行動指南", body: result.action },
            ].map(({ title, body }, i) => (
              <div key={title}>
                {i > 0 && (
                  <div className="border-b border-dashed border-[#A7A48F]/30 mb-4" />
                )}
                <h3 className="font-bold font-serif flex items-center gap-1 text-xs mb-1">
                  <span className="text-[#A7A48F]">✦</span> {title}
                </h3>
                <p className="text-[#91634B]/80 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2.5">
            <button
              onClick={() =>
                window.open(
                  "https://myship.7-11.com.tw/general/detail/GM2603185975610",
                  "_blank",
                )
              }
              className="block w-full bg-[#91634B] hover:bg-[#724a35] text-[#F1EAD8] text-center font-serif text-sm py-3.5 rounded-xl transition shadow-sm"
            >
              ✦ 預約馥境調香體驗 / 選購配方 ✦
            </button>
            <button
              onClick={reset}
              className="w-full bg-[#EBE8E0] text-[#A7A48F] text-xs py-2.5 rounded-xl hover:bg-[#e0dcd2] transition"
            >
              ↺ 重新開啟香氣尋境
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-[10px] tracking-widest text-[#A7A48F] uppercase">
              馥境 FRAGRANCE REALM
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
