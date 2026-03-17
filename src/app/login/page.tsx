"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import {
  FlaskConical,
  Sparkles,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Phone,
} from "lucide-react";
import { login, signup, signInWithOAuth } from "./actions";

function OAuthButton({
  label,
  icon,
}: {
  provider: "google";
  label: string;
  icon: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full
        bg-white border border-stone-200 text-stone-700 text-sm font-medium
        hover:bg-stone-50 hover:border-amber-300 hover:text-amber-800 hover:shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300"
    >
      {icon}
      {label}
    </button>
  );
}

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 rounded-full font-semibold text-sm tracking-widest
        bg-amber-100 border border-amber-300 text-amber-800
        hover:bg-amber-200 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100
        hover:-translate-y-0.5 active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        transition-all duration-300 ease-out"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-amber-400/40 border-t-amber-700 rounded-full animate-spin" />
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
  const successMessage = null;

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === "login";

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    router.replace(`/login?mode=${newMode}`);
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Ambient glow blobs matching AppShell */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-rose-100/40 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-100/40 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-stone-100/60 blur-[120px]" />
      </div>

      {/* Back button */}
      <div className="relative z-10 w-full max-w-md mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-stone-400 hover:text-amber-700 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </button>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
          {/* Card glow bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-transparent to-amber-50/60 rounded-2xl pointer-events-none" />

          {/* Logo & title */}
          <div className="relative text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <FlaskConical className="w-8 h-8 text-amber-700" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mb-2 text-stone-400 text-xs tracking-widest">
              <span>✦</span>
              <span>SOULMATE SCENT</span>
              <span>✦</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-800 tracking-wide">
              {isLogin ? "歡迎回來" : "開啟你的香氣之旅"}
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {isLogin ? "登入以探索你的命定香氣" : "建立帳號，讓宇宙引領你"}
            </p>
          </div>

          {/* Mode toggle tabs */}
          <div className="relative flex rounded-full bg-stone-100 border border-stone-200 p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-white border border-stone-200 text-amber-800 shadow-sm"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              登入
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-white border border-stone-200 text-amber-800 shadow-sm"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              註冊
            </button>
          </div>

          {/* Error message */}
          {errorMessage && !successMessage && (
            <div className="relative mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <span className="text-red-400 text-lg leading-none mt-0.5">
                ⚠
              </span>
              <p className="text-red-600 text-sm leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="relative mb-5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2">
              <span className="text-emerald-500 text-lg leading-none mt-0.5">
                ✦
              </span>
              <p className="text-emerald-700 text-sm leading-relaxed">
                {successMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form action={isLogin ? login : signup} className="relative space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-stone-500 text-xs tracking-widest uppercase"
              >
                電子郵件
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 text-sm
                    focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                    transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-stone-500 text-xs tracking-widest uppercase"
              >
                密碼
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
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
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 text-sm
                    focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
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

            {/* Signup-only fields */}
            {!isLogin && (
              <>
                {/* Nickname */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="nickname"
                    className="block text-stone-500 text-xs tracking-widest uppercase"
                  >
                    暱稱
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      autoComplete="nickname"
                      placeholder="你的暱稱（選填）"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 text-sm
                        focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                        transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="block text-stone-500 text-xs tracking-widest uppercase"
                  >
                    手機號碼
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+886 912 345 678（選填）"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 text-sm
                        focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                        transition-all duration-200"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit button */}
            <SubmitButton isLogin={isLogin} />
          </form>

          {/* OAuth divider */}
          <div className="relative flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-400 text-xs whitespace-nowrap">
              或使用以下方式繼續
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* OAuth buttons */}
          <form action={signInWithOAuth.bind(null, "google")} className="relative">
            <OAuthButton
              provider="google"
              label="Google帳戶登入"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            />
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-amber-500/50 text-xs">✦</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Switch mode hint */}
          <p className="relative text-center text-stone-400 text-xs">
            {isLogin ? (
              <>
                還沒有帳號？{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-amber-700 hover:text-amber-600 underline underline-offset-2 transition-colors"
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
                  className="text-amber-700 hover:text-amber-600 underline underline-offset-2 transition-colors"
                >
                  直接登入
                </button>
              </>
            )}
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-stone-400 text-xs mt-6 tracking-wider">
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
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-300/40 border-t-amber-600 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
