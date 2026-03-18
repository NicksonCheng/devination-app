"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  FlaskConical,
  User,
  Phone,
  Cake,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

type Toast = { type: "success" | "error"; message: string } | null;

export default function ProfilePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      setEmail(user.email ?? "");
      setNickname((user.user_metadata?.nickname as string) ?? "");
      setBirthdate((user.user_metadata?.birthdate as string) ?? "");
      setPhone((user.user_metadata?.phone as string) ?? "");
      setLoading(false);
    });
  }, [router]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { nickname: nickname.trim(), birthdate, phone: phone.trim() },
      });
      if (error) {
        showToast("error", `更新失敗：${error.message}`);
      } else {
        showToast("success", "個人資料已更新 ✦");
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-rose-100/40 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-100/40 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-stone-100/60 blur-[120px]" />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-lg border text-sm font-medium
            transition-all duration-300
            ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Back button */}
      <div className="relative z-10 w-full max-w-md mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-amber-700 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-transparent to-amber-50/60 rounded-2xl pointer-events-none" />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FlaskConical className="w-7 h-7 text-amber-700" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-2 text-stone-400 text-xs tracking-widest">
              <span>✦</span>
              <span>PERSONAL PROFILE</span>
              <span>✦</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-800 tracking-wide">
              個人資料
            </h1>
            {email && (
              <p className="text-stone-400 text-xs mt-1 truncate">{email}</p>
            )}
          </div>

          {loading ? (
            <div className="relative flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-5">
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
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="你的暱稱"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 text-sm
                      focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Birthdate */}
              <div className="space-y-1.5">
                <label
                  htmlFor="birthdate"
                  className="block text-stone-500 text-xs tracking-widest uppercase"
                >
                  生日
                </label>
                <div className="relative">
                  <Cake className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
                  <input
                    id="birthdate"
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 text-sm
                      focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-stone-500 text-xs tracking-widest uppercase"
                >
                  電話
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+886 912 345 678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 text-sm
                      focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-full font-semibold text-sm tracking-widest
                  bg-amber-100 border border-amber-300 text-amber-800
                  hover:bg-amber-200 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100
                  hover:-translate-y-0.5 active:translate-y-0
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  transition-all duration-300 ease-out"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    儲存中...
                  </span>
                ) : (
                  "✦ 儲存變更 ✦"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
