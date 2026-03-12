"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import {
  Moon,
  Sparkles,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { login, signup } from "./actions";
import StarField from "@/components/StarField";

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest
        bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600
        hover:from-yellow-500 hover:via-amber-400 hover:to-yellow-500
        text-[#0B1021] shadow-lg shadow-amber-500/20
        hover:shadow-amber-400/40 hover:shadow-xl
        hover:-translate-y-0.5
        active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        transition-all duration-300 ease-out
        border border-amber-400/30"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-[#0B1021]/40 border-t-[#0B1021] rounded-full animate-spin" />
          處理中...
        </span>
      ) : isLogin ? (
        "✦ 登入探索 ✦"
      ) : (
        "✦ 開啟旅程 ✦"
      )}
    </button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "login";
  const errorMessage = searchParams.get("error");
  const successMessage =
    searchParams.get("success") === "registered"
      ? "註冊成功！請至信箱收取驗證信件後即可登入 ✨"
      : null;

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === "login";

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    router.replace(`/login?mode=${newMode}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0B1021] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Star background */}
      <StarField />

      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-purple-900/25 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-900/25 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-950/20 blur-[120px]" />
      </div>

      {/* Back button */}
      <div className="relative z-10 w-full max-w-md mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-amber-300/60 hover:text-amber-300 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </button>
      </div>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Logo & title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <Moon className="w-8 h-8 text-amber-400" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mb-2 text-amber-400/60 text-xs tracking-widest">
              <span>✦</span>
              <span>SOULMATE SCENT</span>
              <span>✦</span>
            </div>
            <h1 className="text-2xl font-bold text-amber-100 tracking-wide">
              {isLogin ? "歡迎回來" : "開啟你的香氣之旅"}
            </h1>
            <p className="text-amber-100/40 text-sm mt-1">
              {isLogin ? "登入以探索你的命定香氣" : "建立帳號，讓宇宙引領你"}
            </p>
          </div>

          {/* Mode toggle tabs */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  : "text-amber-100/40 hover:text-amber-200"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              登入
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  : "text-amber-100/40 hover:text-amber-200"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              註冊
            </button>
          </div>

          {/* Error message */}
          {errorMessage && !successMessage && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/40 flex items-start gap-2">
              <span className="text-red-300 text-lg leading-none mt-0.5">
                ⚠
              </span>
              <p className="text-red-300 text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-900/30 border border-emerald-500/40 flex items-start gap-2">
              <span className="text-emerald-300 text-lg leading-none mt-0.5">
                ✦
              </span>
              <p className="text-emerald-300 text-sm leading-relaxed">
                {successMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form action={isLogin ? login : signup} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-amber-200/70 text-xs tracking-widest uppercase"
              >
                電子郵件
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/50 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/30 border border-white/10 text-amber-100 placeholder-amber-100/25 text-sm
                    focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30
                    transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-amber-200/70 text-xs tracking-widest uppercase"
              >
                密碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/50 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  placeholder={
                    isLogin ? "輸入你的密碼" : "設定密碼（至少 6 個字元）"
                  }
                  minLength={6}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/30 border border-white/10 text-amber-100 placeholder-amber-100/25 text-sm
                    focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400/40 hover:text-amber-300 transition-colors"
                  aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <SubmitButton isLogin={isLogin} />
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-amber-400/40 text-xs">✦</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Switch mode hint */}
          <p className="text-center text-amber-100/40 text-xs">
            {isLogin ? (
              <>
                還沒有帳號？{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                  立即註冊
                </button>
              </>
            ) : (
              <>
                已有帳號？{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                  直接登入
                </button>
              </>
            )}
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-amber-500/30 text-xs mt-6 tracking-wider">
          ✦ 命定香氣探索 · Soulmate Scent © 2026 ✦
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1021] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
