"use client";

import { FlaskConical, User, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Page } from "./AppShell";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { logout } from "@/app/login/actions";

interface NavbarProps {
  user: SupabaseUser | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ user, currentPage, onNavigate }: NavbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isLoggedIn = !!user;
  const navLinks: { label: string; page: Page }[] = [
    { label: "首頁", page: "home" },
    { label: "🧬 配對分析", page: "tarot" },
    { label: "🧪 香氛測驗", page: "quiz" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <FlaskConical className="w-5 h-5 text-amber-700 group-hover:text-amber-600 transition-colors" />
          <span className="text-base font-bold tracking-wide text-stone-800 group-hover:text-amber-800 transition-colors">
            命定香氣探索
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                currentPage === page
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Auth button */}
        {isLoggedIn ? (
          <button
            onClick={() => startTransition(() => logout())}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300
              border-stone-300 bg-stone-50 text-stone-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user?.email?.split("@")[0]}
            </span>
            <LogOut className="w-3 h-3 opacity-60" />
          </button>
        ) : (
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300
              border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>登入 / 註冊</span>
          </button>
        )}
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex gap-2 px-4 pb-2">
        {navLinks.map(({ label, page }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex-1 py-1 rounded-full text-xs transition-all duration-200 ${
              currentPage === page
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
